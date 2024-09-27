import { PermissionAction } from '@supabase/shared-types/out/constants'

import { CronjobsListing } from 'components/interfaces/Database/Cronjobs/CronjobsListing'
import DatabaseLayout from 'components/layouts/DatabaseLayout/DatabaseLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import NoPermission from 'components/ui/NoPermission'
import { useCheckPermissions, usePermissionsLoaded } from 'hooks/misc/useCheckPermissions'
import type { NextPageWithLayout } from 'types'

const FunctionsPage: NextPageWithLayout = () => {
  // TODO: Change this to the correct permissions
  const canReadFunctions = useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_READ, 'functions')
  const isPermissionsLoaded = usePermissionsLoaded()

  if (isPermissionsLoaded && !canReadFunctions) {
    return <NoPermission isFullPage resourceText="manage database cronjobs" />
  }

  return (
    <>
      <ScaffoldContainer>
        <ScaffoldSection>
          <div className="col-span-12">
            <CronjobsListing />
          </div>
        </ScaffoldSection>
      </ScaffoldContainer>
    </>
  )
}

FunctionsPage.getLayout = (page) => <DatabaseLayout title="Database">{page}</DatabaseLayout>

export default FunctionsPage
