import { ChevronLeft, LucideIcon } from 'lucide-react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import { Badge, TextLink } from 'ui'
import DefaultLayout from '~/components/Layouts/Default'
import { features } from '~/data/features'
import type { FeatureType } from '~/data/features'
import ShareArticleActions from '../../components/Blog/ShareArticleActions'
import SectionContainer from '../../components/Layouts/SectionContainer'
import CTABanner from '../../components/CTABanner'
import ReactMarkdown from 'react-markdown'

interface FeaturePageProps {
  feature: FeatureType
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths based on each feature's slug
  const paths = features.map((feature) => ({
    params: { slug: feature.slug },
  }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }
  const feature = features.find((feature) => feature.slug === slug)

  if (!feature) {
    return { notFound: true }
  }

  // Destructure the icon property out, and add the icon name to props instead
  const { icon, ...featureWithoutIcon } = feature

  return {
    props: {
      feature: {
        ...featureWithoutIcon,
        // iconName: icon.name, // Adjust this if your icon property is different
      },
    },
  }
}

const FeaturePage: React.FC<FeaturePageProps> = ({ feature }) => {
  const meta = {
    title: `${feature.title} | Supabase Features`,
    description: feature.subtitle,
    url: `https://supabase.com/features/${feature.slug}`,
    // image: ogImageUrl,
  }

  const Icon = features.find((f) => f.slug === feature.slug)?.icon as LucideIcon

  return (
    <>
      <NextSeo
        title={meta.title}
        description={meta.description}
        openGraph={{
          title: meta.title,
          description: meta.description,
          url: meta.url,
          type: 'article',
          // images: [
          //   {
          //     url: meta.image,
          //     alt: `${feature.title} thumbnail`,
          //     width: 1200,
          //     height: 627,
          //   },
          // ],
        }}
      />
      <DefaultLayout className="bg-alternative">
        <div className="flex flex-col w-full">
          <header className="relative w-full overflow-hidden">
            <SectionContainer className="!py-4 md:flex items-start hidden">
              <Link
                href="/features"
                className="text-foreground-lighter hover:text-foreground flex !leading-3 gap-1 cursor-pointer items-center text-sm transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Features
              </Link>
            </SectionContainer>
            <SectionContainer
              className="
                relative z-10
                lg:min-h-[400px] h-full
                flex flex-col md:text-center
                gap-8
                text-foreground-light
                !py-10 md:!pb-10 md:!pt-0
              "
            >
              <div className="h-full flex flex-col items-start md:items-center gap-2">
                <h1 className="h1 !m-0">{feature.title}</h1>
                <p>{feature.subtitle}</p>
                <Badge className="capitalize mt-4" size="large">
                  {feature.products[0]}
                </Badge>
              </div>
              <div
                className="
                relative w-full aspect-video bg-surface-100 overflow-hidden
                border shadow-lg rounded-lg
                z-10 mx-auto max-w-2xl
                flex items-center justify-center
                "
              >
                {!!feature.heroImage ? (
                  <Image
                    src={feature.heroImage}
                    fill
                    sizes="100%"
                    quality={100}
                    alt={`${feature.title} thumbnail`}
                    className="absolute inset-0 object-cover object-center"
                  />
                ) : (
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-foreground" />
                )}
              </div>
            </SectionContainer>
          </header>
          <SectionContainer className="!pt-4">
            <main className="max-w-xl mx-auto flex flex-col items-start gap-4">
              <div className="prose prose-docs">
                <ReactMarkdown>{feature.description}</ReactMarkdown>
              </div>
              {feature.docsUrl && <TextLink label="Read documentation" url={feature.docsUrl} />}
              <div className="w-full flex text-foreground-lighter flex-col text-sm border-t pt-4 mt-4">
                <span>Share on</span>
                <ShareArticleActions title={meta.title} slug={meta.url} basePath="" />
              </div>
            </main>
          </SectionContainer>
          <CTABanner />
        </div>
      </DefaultLayout>
    </>
  )
}

export default FeaturePage
