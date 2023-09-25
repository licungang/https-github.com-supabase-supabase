import { AlertTitle } from '@ui/components/shadcn/ui/alert'
import Link from 'next/link'
import { AlertDescription_Shadcn_, Alert_Shadcn_, Button, IconAlertCircle } from 'ui'

interface CPUWarningsProps {
  isFreePlan: boolean
  upgradeUrl: string
  severity?: 'warning' | 'critical' | null
}

const CPUWarnings = ({ isFreePlan, upgradeUrl, severity }: CPUWarningsProps) => {
  if (severity === 'warning') {
    return (
      <Alert_Shadcn_ variant="warning">
        <IconAlertCircle />
        <AlertTitle>Your max CPU usage has exceeded 80%</AlertTitle>
        <AlertDescription_Shadcn_>
          High CPU usage could result in slower queries, disruption of daily back up routines, and
          in rare cases, your instance may become unresponsive. If you need more resources, consider
          upgrading to a larger compute add-on.
        </AlertDescription_Shadcn_>
        <div className="mt-3 flex items-center space-x-2">
          <Link href="https://supabase.com/docs/guides/platform/exhaust-cpu">
            <a>
              <Button type="default">Learn more</Button>
            </a>
          </Link>
          <Link href={upgradeUrl}>
            <a>
              <Button type="warning">
                {isFreePlan ? 'Upgrade project' : 'Change compute add-on'}
              </Button>
            </a>
          </Link>
        </div>
      </Alert_Shadcn_>
    )
  }

  if (severity === 'critical') {
    return (
      <Alert_Shadcn_ variant="destructive">
        <IconAlertCircle />
        <AlertTitle>Your max CPU usage has reached 100%</AlertTitle>
        <AlertDescription_Shadcn_>
          High CPU usage could result in slower queries, disruption of daily back up routines, and
          in rare cases, your instance may become unresponsive. If you need more resources, consider
          upgrading to a larger compute add-on.
        </AlertDescription_Shadcn_>
        <div className="mt-3 flex items-center space-x-2">
          <Link href="https://supabase.com/docs/guides/platform/exhaust-cpu">
            <a>
              <Button type="default">Learn more</Button>
            </a>
          </Link>
          <Link href={upgradeUrl}>
            <a>
              <Button type="danger">
                {isFreePlan ? 'Upgrade project' : 'Change compute add-on'}
              </Button>
            </a>
          </Link>
        </div>
      </Alert_Shadcn_>
    )
  }

  return null
}

export default CPUWarnings
