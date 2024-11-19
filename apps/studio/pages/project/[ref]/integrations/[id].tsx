import { useParams } from 'common'
import { OverviewTab } from 'components/interfaces/Integrations/Integration/OverviewTab'
import { WrappersTab } from 'components/interfaces/Integrations/Integration/WrappersTab'
import { INTEGRATIONS } from 'components/interfaces/Integrations/Landing/Integrations.constants'
import { Header } from 'components/layouts/Integrations/header'
import IntegrationsLayout from 'components/layouts/Integrations/layout'
import { ScrollProgressBar } from 'components/layouts/Integrations/scroll-example'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import ProjectLayout from 'components/layouts/ProjectLayout/ProjectLayout'
import {
  useMotionValue,
  useMotionValueEvent,
  motion,
  useViewportScroll,
  useScroll,
  useSpring,
} from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { parseAsString, useQueryState } from 'nuqs'
import { Page } from 'openai/pagination'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GetStaticProps, GetStaticPaths } from 'next'
import fs from 'fs'
import path from 'path'

import type { NextPageWithLayout } from 'types'
import { Button, NavMenu, NavMenuItem } from 'ui'

const IntegrationPage: NextPageWithLayout = () => {
  const { id } = useParams()
  const { project } = useProjectContext()
  const [selectedTab] = useQueryState('tab', parseAsString.withDefault('overview'))

  const integration = INTEGRATIONS.find((i) => i.id === id)

  if (!integration) {
    return null
  }

  return (
    <div className="py-0">
      <div className="">
        {selectedTab === 'overview' && <OverviewTab integration={integration} />}
        {selectedTab === 'wrappers' && <WrappersTab />}
        {selectedTab === 'logs' && (
          <div className="">
            <div className="px-10 bg-surface-100 flex items-center gap-2 py-2 border-b">
              <div className="flex items-center gap-2">
                <Button className="px-2 py-1 text-xs bg-surface-100 hover:bg-surface-200 rounded-md transition">
                  Clear logs
                </Button>
                <Button className="px-2 py-1 text-xs bg-surface-100 hover:bg-surface-200 rounded-md transition">
                  Download
                </Button>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <select className="px-2 py-1 text-xs bg-surface-100 rounded-md">
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
                <input
                  type="search"
                  placeholder="Search logs..."
                  className="px-2 py-1 text-xs bg-surface-100 rounded-md w-[200px]"
                />
              </div>
            </div>
            <div className="">
              {[...Array(100)].map((_, i) => (
                <div key={i} className="px-10 py-0.5 font-mono text-sm hover:bg-surface-100/50">
                  <div className="flex items-center gap-2 text-foreground-light">
                    <span className="text-foreground-lighter">[{new Date().toISOString()}]</span>
                    <span className="px-1.5 py-0.5 bg-success-900/30 text-success-500 rounded-full text-xs">
                      SUCCESS
                    </span>
                    <span className="text-foreground">Integration {id} execution completed</span>
                  </div>
                  {/* <div className="mt-2 pl-6 text-foreground-light">
                Integration executed successfully
              </div>
              <div className="mt-2 pl-6 flex items-center gap-2 text-xs text-foreground-lighter">
                <span>duration=0.24s</span>
                <span>status=success</span>
                <span>request_id=req_8f3d92</span>
              </div> */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

IntegrationPage.getLayout = (page) => <IntegrationsLayout>{page}</IntegrationsLayout>

export default IntegrationPage
