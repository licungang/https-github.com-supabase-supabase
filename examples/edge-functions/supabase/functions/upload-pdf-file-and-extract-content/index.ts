// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import 'https://deno.land/x/xhr@0.3.0/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Api2Pdf from 'https://esm.sh/api2pdf@2'

console.log('PDF Function is now running...')

// Supabase API URL & Anon Key - env values exported by default
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

// Get Api2Pdf api key via https://www.api2pdf.com/
// Run this command via Supabase CLI to set key: > supabase secrets set API2PDF_KEY=<secret_key_value>
// Remember to include secret in your deployment using the --secrets flag.
// For example: > supabase functions deploy <function-name> --secrets API2PDF_KEY
const a2pAPIKey = Deno.env.get('API2PDF_KEY')

// initialize new Api2Pdf instance
const a2pClient = new Api2Pdf(a2pAPIKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

class ApplicationError extends Error {
  constructor(message: string, public data: Record<string, any> = {}) {
    super(message)
  }
}

class UserError extends ApplicationError {}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    if (!supabaseUrl) {
      throw new ApplicationError('Missing environment variable: SUPABASE_URL')
    }

    if (!supabaseAnonKey) {
      throw new ApplicationError('Missing environment variable: SUPABASE_ANON_KEY')
    }

    if (!a2pAPIKey) {
      throw new ApplicationError('Missing environment variable: API2PDF_KEY')
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      // Add user Auth context to apply row-level-security (RLS) policies
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    )

    // Read multipart/form-data from request.
    // Note: Use req.json() if request contains a JSON body
    const reqFormData = await req.formData()

    if (!reqFormData) {
      throw new UserError('Missing or invalid request data')
    }

    // Check required data from request body
    if (!reqFormData.has('pdfFile') || !reqFormData.has('uploadPath')) {
      throw new UserError('Missing required (pdfFile or uploadPath) property from request data.')
    }

    const pdfFile = reqFormData.get('pdfFile')

    const timestamp = +new Date()
    const filePath = `${reqFormData.get('uploadPath')}-${timestamp}`

    if (!pdfFile || !(pdfFile instanceof File)) {
      throw new UserError('Invalid file field or value')
    }

    // Upload pdf file to supabase storage bucket
    const { data: uploadedFile, error: uploadError } = await supabaseClient.storage
      .from('<my-bucket-name>')
      .upload(filePath, pdfFile, {
        contentType: 'application/pdf',
        cacheControl: '3600',
      })

    if (uploadError) throw uploadError

    // Typical Supabase storage file public url pattern
    const filePublicUrl = `${supabaseUrl}/storage/v1/object/public/<my-bucket-name>/${filePath}`

    let finalText: string = ''

    if (uploadedFile) {
      // Convert PDF file to Html and remove Html tags to get plain text content
      await a2pClient
        .libreOfficePdfToHtml(filePublicUrl)
        .then(async function (htmlResult: { FileUrl: string }) {
          if (htmlResult) {
            const htmlDataResponse = await fetch(htmlResult.FileUrl)
            const htmlData = await htmlDataResponse.text()

            // Regular expression pattern to match HTML tags
            const regex = /<[^>]+>/g

            // Remove HTML tags from the document
            finalText = htmlData.replace(regex, '')

            console.log(`Final pdf text content: \n ${finalText}`)
          }
        })
    }

    const data = {
      pdfText: finalText,
      pdfStorageUrl: filePublicUrl,
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    if (err instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof ApplicationError) {
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err)
    }

    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})