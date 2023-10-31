import clsx from 'clsx'
import { useParams } from 'common'
import dayjs from 'dayjs'
import { noop } from 'lodash'
import Link from 'next/link'
import { forwardRef, PropsWithChildren, useState } from 'react'
import {
  Badge,
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconExternalLink,
  IconGitBranch,
  IconGitHub,
  IconMoreVertical,
  IconShield,
  IconTrash,
} from 'ui'

import { Markdown } from 'components/interfaces/Markdown'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import { Branch } from 'data/branches/branches-query'
import { GitHubPullRequest } from 'data/integrations/integrations-github-pull-requests-query'

interface BranchPanelProps {
  repo?: string
  branch?: Branch
  onSelectUpdate?: () => void
  onSelectDelete?: () => void
  onSelectCreateBranch?: () => void
  onSelectDisableBranching?: () => void
  generateCreatePullRequestURL?: (branch?: string) => string
}

const MainBranchPanel = ({
  repo,
  branch,
  onSelectUpdate = noop,
  onSelectCreateBranch = noop,
  onSelectDisableBranching = noop,
}: BranchPanelProps) => {
  const { ref } = useParams()
  const [open, setOpen] = useState(false)
  const isActive = ref === branch?.project_ref

  return (
    <div className="border rounded-lg">
      <div className="bg-surface-200 shadow-sm flex justify-between items-center pl-8 pr-6 py-3 rounded-t-lg text-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-background rounded-md flex items-center justify-center">
              <IconGitHub size={18} strokeWidth={2} />
            </div>
            <p>Github branch workflow</p>
            <Button
              asChild
              type="text"
              size="small"
              className="text-foreground-light hover:text py-1 px-1.5"
              iconRight={<IconExternalLink size={14} strokeWidth={1.5} />}
            >
              <Link href={`https://github.com/${repo}`} target="_blank" rel="noreferrer">
                {repo}
              </Link>
            </Button>
          </div>
          <Button type="default" onClick={() => onSelectCreateBranch()}>
            Create preview branch
          </Button>
        </div>
      </div>
      <div className="bg-surface-100 border-t shadow-sm flex justify-between items-center pl-8 pr-6 py-3 rounded-b-lg text-sm">
        {branch === undefined ? (
          <ShimmeringLoader className="w-full" />
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-amber-300 rounded-md flex items-center justify-center">
                <IconShield size={18} strokeWidth={2} className="text-amber-900" />
              </div>
              <p>{branch?.name}</p>
              <Badge color="amber">Production</Badge>
              {isActive && <Badge color="green">Selected</Badge>}
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu open={open} onOpenChange={() => setOpen(!open)} modal={false}>
                <DropdownMenuTrigger>
                  <Button
                    asChild
                    type="text"
                    className="px-1"
                    icon={<IconMoreVertical size={14} />}
                  >
                    <span></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-48">
                  <DropdownMenuItem
                    asChild
                    className="flex gap-2"
                    onSelect={() => onSelectUpdate()}
                  >
                    <Link href={`/project/${ref}/settings/integrations`}>
                      Change production branch
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex gap-2"
                    onSelect={() => onSelectDisableBranching()}
                  >
                    Disable branching
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const BranchContainer = ({ className, children }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className="list-none ml-6 pl-8 pb-4 border-l border-overlay relative last:!border-transparent">
      <div className="absolute w-[33px] rounded-bl-full border-b border-l border-overlay h-10 -left-px" />
      <div
        className={clsx(
          'border shadow-sm flex justify-between items-center pl-8 pr-6 py-4 rounded-lg text-sm',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

const BranchPanel = ({
  branch,
  generateCreatePullRequestURL,
  onSelectDelete = noop,
}: BranchPanelProps) => {
  const { ref } = useParams()
  const [open, setOpen] = useState(false)

  const isActive = ref === branch?.project_ref
  const daysFromNow = dayjs().diff(dayjs(branch?.created_at), 'day')
  const formattedTimeFromNow = dayjs(branch?.created_at).fromNow()
  const formattedCreatedAt = dayjs(branch?.created_at).format('DD MMM YYYY, HH:mm:ss (ZZ)')

  const pullRequestURL = generateCreatePullRequestURL?.(branch?.git_branch) ?? 'https://github.com'

  return (
    <BranchContainer className="bg-surface-100">
      <div className="flex items-center space-x-4">
        <IconGitBranch size={16} strokeWidth={2} />
        <p>{branch?.name}</p>
        {isActive && <Badge color="green">Selected</Badge>}
        <p className="text-foreground-light">
          {daysFromNow > 1 ? `Created on ${formattedCreatedAt}` : `Created ${formattedTimeFromNow}`}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Button asChild type="default" icon={<IconExternalLink />}>
          <Link target="_blank" rel="noreferrer" href={pullRequestURL}>
            Create pull request
          </Link>
        </Button>
        <DropdownMenu open={open} onOpenChange={() => setOpen(!open)} modal={false}>
          <DropdownMenuTrigger>
            <Button asChild type="text" className="px-1" icon={<IconMoreVertical size={14} />}>
              <span></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem className="flex gap-2" onSelect={() => onSelectDelete()}>
              <IconTrash size={14} />
              Delete branch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </BranchContainer>
  )
}

interface BranchHeader extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  markdown?: string
}

const BranchHeader = forwardRef<HTMLDivElement, BranchHeader>(
  ({ className, name, markdown = '', ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn('border-l border-overlay ml-6 pl-8 pt-6 pb-3', className)}
      >
        <Markdown content={markdown} className="" />
      </div>
    )
  }
)

const PullRequestPanel = ({
  pr,
  onSelectDelete = noop,
}: {
  pr: GitHubPullRequest
  onSelectDelete: () => void
}) => {
  const [open, setOpen] = useState(false)
  const daysFromNow = dayjs().diff(dayjs(pr.created_at), 'day')
  const formattedTimeFromNow = dayjs(pr.created_at).fromNow()
  const formattedCreatedAt = dayjs(pr.created_at).format('DD MMM YYYY, HH:mm:ss (ZZ)')

  return (
    <BranchContainer className="bg-surface-100">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <IconGitBranch className="text-brand-900" size={16} strokeWidth={2} />
              <p>{pr.branch}</p>
              <p className="text-foreground-light">
                {daysFromNow > 1
                  ? `Created on ${formattedCreatedAt}`
                  : `Created ${formattedTimeFromNow}`}
              </p>
            </div>
            <p className="text-foreground-light ml-8 mt-0.5">{pr.title}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild type="default" icon={<IconExternalLink />}>
              <Link href={pr.url} target="_blank" rel="noreferrer">
                View pull request
              </Link>
            </Button>
            <DropdownMenu open={open} onOpenChange={() => setOpen(!open)} modal={false}>
              <DropdownMenuTrigger>
                <Button asChild type="text" className="px-1" icon={<IconMoreVertical size={14} />}>
                  <span></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem className="flex gap-2" onSelect={() => onSelectDelete()}>
                  <IconTrash size={14} />
                  Delete branch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </BranchContainer>
  )
}

BranchHeader.displayName = 'BranchHeader'
export { BranchContainer, BranchHeader, BranchPanel, MainBranchPanel, PullRequestPanel }
