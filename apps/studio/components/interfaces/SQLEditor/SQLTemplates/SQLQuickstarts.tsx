import { PermissionAction } from '@supabase/shared-types/out/constants'
import { partition } from 'lodash'
import { useRouter } from 'next/router'
import { toast } from 'sonner'

import { useParams } from 'common'
import { SQL_TEMPLATES } from 'components/interfaces/SQLEditor/SQLEditor.queries'
import { useSendEventMutation } from 'data/telemetry/send-event-mutation'
import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'
import { TelemetryActions } from 'lib/constants/telemetry'
import { uuidv4 } from 'lib/helpers'
import { useProfile } from 'lib/profile'
import { useSqlEditorV2StateSnapshot } from 'state/sql-editor-v2'
import { createSqlSnippetSkeletonV2 } from '../SQLEditor.utils'
import { ActionCard } from 'components/layouts/tabs/actions-card'
import { cn, SQL_ICON } from 'ui'
import { getTabsStore } from 'state/tabs'

const SQLQuickstarts = () => {
  const router = useRouter()
  const { ref } = useParams()
  const { profile } = useProfile()
  const project = useSelectedProject()
  const [, quickStart] = partition(SQL_TEMPLATES, { type: 'template' })

  const snapV2 = useSqlEditorV2StateSnapshot()

  const canCreateSQLSnippet = useCheckPermissions(PermissionAction.CREATE, 'user_content', {
    resource: { type: 'sql', owner_id: profile?.id },
    subject: { id: profile?.id },
  })

  const { mutate: sendEvent } = useSendEventMutation()

  const handleNewQuery = async (sql: string, name: string) => {
    if (!ref) return console.error('Project ref is required')
    if (!project) return console.error('Project is required')
    if (!profile) return console.error('Profile is required')

    if (!canCreateSQLSnippet) {
      return toast('Your queries will not be saved as you do not have sufficient permissions')
    }

    try {
      const snippet = createSqlSnippetSkeletonV2({
        id: uuidv4(),
        name,
        sql,
        owner_id: profile?.id,
        project_id: project?.id,
      })
      snapV2.addSnippet({ projectRef: ref, snippet })
      snapV2.addNeedsSaving(snippet.id)

      const store = getTabsStore(ref)
      const tabId = `sql-${snippet.id}`
      store.openTabs = [...store.openTabs, tabId]
      store.tabsMap[tabId] = {
        id: tabId,
        type: 'sql',
        label: name,
        metadata: { sqlId: snippet.id, name },
      }
      store.activeTab = tabId

      router.push(`/project/${ref}/sql/${snippet.id}`)
    } catch (error: any) {
      toast.error(`Failed to create new query: ${error.message}`)
    }
  }

  return (
    <div className="block h-full space-y-8 overflow-y-auto p-6 px-10 bg-dash-sidebar dark:bg-surface-100">
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-foreground mb-1 text-xl">Quickstarts</h1>
          <p className="text-foreground-light text-sm">
            Click on any script to fill the query box, modify the script, then click
            <span className="text-code">Run</span>.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {quickStart.map((x, i) => (
            <ActionCard
              title={x.title}
              description={x.description}
              bgColor="bg-alternative border"
              key={`action-card-${i}`}
              icon={<SQL_ICON className={cn('fill-foreground', 'w-4 h-4')} strokeWidth={1.5} />}
              // sql={x.sql}
              onClick={() => {
                handleNewQuery(x.sql, x.title)
                sendEvent({
                  action: TelemetryActions.SQL_EDITOR_QUICKSTART_CLICKED,
                  properties: { title: x.title },
                })
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SQLQuickstarts
