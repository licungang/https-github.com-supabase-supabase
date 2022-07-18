import ReactMarkdown from 'react-markdown'
import { FC, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Input, Form } from '@supabase/ui'

import { useStore } from 'hooks'
import { FormSchema } from 'types'
import { FormActions, FormSection, FormSectionContent, FormSectionLabel } from 'components/ui/Forms'
import CodeEditor from 'components/ui/CodeEditor'
import InformationBox from 'components/ui/InformationBox'

interface Props {
  template: FormSchema
}

const TemplateEditor: FC<Props> = ({ template }) => {
  const { ui, authConfig } = useStore()
  const [bodyValue, setBodyValue] = useState('')

  const { isLoaded } = authConfig
  const { id, properties } = template

  const formId = `auth-config-email-templates-${id}`
  const INITIAL_VALUES: { [x: string]: string } = {}

  useEffect(() => {
    if (isLoaded) {
      Object.keys(properties).forEach((key) => {
        INITIAL_VALUES[key] = authConfig.config[key] ?? ''
      })
    }
  }, [isLoaded])

  const messageSlug = `MAILER_TEMPLATES_${id}_CONTENT`
  const messageProperty = properties[messageSlug]

  const onSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    const payload = { ...values }

    // Because the template content uses the code editor which is not a form component
    // its state is kept separately from the form state, hence why we manually inject it here
    delete payload[messageSlug]
    if (messageProperty) payload[messageSlug] = bodyValue

    try {
      setSubmitting(true)
      await authConfig.update(payload)
      ui.setNotification({ category: 'success', message: 'Successfully updated settings' })
      resetForm({
        values: values,
        initialValues: values,
      })
      setBodyValue(authConfig?.config?.[messageSlug])
    } catch (error) {
      ui.setNotification({ category: 'error', message: 'Failed to update settings' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form id={formId} className="!border-t-0" initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
      {({ isSubmitting, resetForm, values, initialValues }: any) => {
        useEffect(() => {
          // Form is reset once remote data is loaded in store
          resetForm({
            values: INITIAL_VALUES,
            initialValues: INITIAL_VALUES,
          })
          setBodyValue(authConfig?.config?.[messageSlug])
        }, [authConfig.isLoaded])

        const hasChanges =
          JSON.stringify(values) !== JSON.stringify(initialValues) ||
          (authConfig?.config?.[messageSlug] && authConfig?.config?.[messageSlug] !== bodyValue)

        return (
          <>
            <FormSection
              className="!border-t-0"
              header={
                <FormSectionLabel>
                  <span>SMTP Provider Settings</span>
                  <p className="text-scale-900 my-4">
                    Your SMTP Credentials will always be encrypted in our database.
                  </p>
                </FormSectionLabel>
              }
            >
              <FormSectionContent loading={!isLoaded}>
                {Object.keys(properties).map((x: string) => {
                  const property = properties[x]
                  if (property.type === 'string') {
                    return (
                      <Input
                        size="small"
                        layout="vertical"
                        id={x}
                        key={x}
                        name={x}
                        label={property.title}
                        descriptionText={
                          property.description ? (
                            <ReactMarkdown unwrapDisallowed disallowedElements={['p']}>
                              {property.description}
                            </ReactMarkdown>
                          ) : null
                        }
                        labelOptional={
                          property.descriptionOptional ? (
                            <ReactMarkdown unwrapDisallowed disallowedElements={['p']}>
                              {property.descriptionOptional}
                            </ReactMarkdown>
                          ) : null
                        }
                      />
                    )
                  }
                })}
              </FormSectionContent>
            </FormSection>
            <FormSection className="!mt-0 grid-cols-12 !border-t-0 !pt-0">
              <FormSectionContent loading={!isLoaded} fullWidth>
                {messageProperty && (
                  <>
                    <FormSectionLabel>
                      <span>{messageProperty.title}</span>
                    </FormSectionLabel>
                    <InformationBox
                      title={'Message variables'}
                      hideCollapse={false}
                      defaultVisibility={true}
                      description={
                        messageProperty.description && (
                          <ReactMarkdown>{messageProperty.description}</ReactMarkdown>
                        )
                      }
                    />
                    <div className="relative h-96">
                      <CodeEditor
                        id="code-id"
                        loading={!isLoaded}
                        language="html"
                        className="!mb-0 h-96 overflow-hidden rounded border"
                        onInputChange={(e: string | undefined) => setBodyValue(e ?? '')}
                        options={{ wordWrap: 'off', contextmenu: false }}
                        value={bodyValue}
                      />
                    </div>
                  </>
                )}
                <div className="col-span-12 flex w-full justify-between">
                  <FormActions
                    handleReset={() => {
                      resetForm({
                        values: authConfig.config,
                        initialValues: authConfig.config,
                      })
                      setBodyValue(authConfig?.config?.[messageSlug])
                    }}
                    form={formId}
                    isSubmitting={isSubmitting}
                    hasChanges={hasChanges}
                  />
                </div>
              </FormSectionContent>
            </FormSection>
          </>
        )
      }}
    </Form>
  )
}

export default observer(TemplateEditor)
