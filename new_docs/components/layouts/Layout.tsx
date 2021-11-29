import { ReactElement, useState } from 'react'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import NavBar from '../nav/NavBar'
import SideBar from '../nav/SideBar'
import Footer from '../Footer'

const DocsLayout = ({
  meta,
  children,
}: {
  meta: { title: string; description: string }
  children: ReactElement
}) => {
  const theme = 'okaidia'

  return (
    <div className="h-screen">
      <Head>
        <title>{meta?.title} | Supabase</title>
        <meta name="description" content={meta?.description} />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta?.title} />
        <meta property="og:description" content={meta?.description} />
        <meta property="og:title" content={meta?.title} />
        <link
          rel="preload"
          href="https://unpkg.com/prismjs@0.0.1/themes/prism-okaidia.css"
          as="script"
        />
        <link href={`https://unpkg.com/prismjs@0.0.1/themes/prism-${theme}.css`} rel="stylesheet" />
      </Head>

      <div className={`${styles.container} h-full`}>
        <main className={`${styles.main}`}>
          <NavBar />
          <div className="flex flex-row ">
            <SideBar />
            <div
              className={`prose dark:prose-dark ${styles.content} p-8`}
              dangerouslySetInnerHTML={{ __html: children }}
            />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default DocsLayout
