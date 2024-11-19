import { PermissionAction } from '@supabase/shared-types/out/constants'
import { partition } from 'lodash'
import { ChevronRight, Edit, ExternalLink, Table2, Trash } from 'lucide-react'
import Link from 'next/link'

import { useParams } from 'common'
import { ButtonTooltip } from 'components/ui/ButtonTooltip'
import type { FDW } from 'data/fdw/fdws-query'
import { EditorTablePageLink } from 'data/prefetchers/project.$ref.editor.$id'
import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
import { useState } from 'react'
import { SheetContent, SheetTrigger, Sheet, TableRow, TableCell, Badge } from 'ui'
import { INTEGRATIONS } from '../Landing/Integrations.constants'
import { EditWrapperSheet } from './EditWrapperSheet'
import DeleteWrapperModal from 'components/interfaces/Database/Wrappers/DeleteWrapperModal'
import tables from 'pages/api/pg-meta/[ref]/tables'
import { formatWrapperTables } from 'components/interfaces/Database/Wrappers/Wrappers.utils'
import Image from 'next/image'

interface WrapperRowProps {
  wrapper: FDW
}

const WrapperRow = ({ wrapper }: WrapperRowProps) => {
  const { ref, id } = useParams()
  const canManageWrappers = useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'wrappers')

  const [editWrapperShown, setEditWrapperShown] = useState(false)
  const [isClosingEditWrapper, setisClosingEditWrapper] = useState(false)
  const [selectedWrapper, setSelectedWrapper] = useState<FDW | null>(null)

  const integration = INTEGRATIONS.find((i) => i.id === id)

  const serverOptions = Object.fromEntries(
    wrapper.server_options.map((option: any) => option.split('='))
  )
  const [encryptedMetadata, visibleMetadata] = partition(
    integration?.meta?.server.options.filter((option) => !option.hidden),
    'secureEntry'
  )

  const _tables = formatWrapperTables(wrapper, integration?.meta)

  return (
    <>
      <TableRow key={wrapper.id} className="">
        <TableCell className="space-y-3 align-top !py-3">
          {wrapper.name}

          {visibleMetadata.map((metadata) => (
            <div
              key={metadata.name}
              className="flex items-center space-x-2 text-sm text-foreground-light"
            >
              <span className="text-foreground-lighter">{metadata.label}:</span>
              <span>{serverOptions[metadata.name]}</span>
            </div>
          ))}
        </TableCell>

        <TableCell className="space-y-2 !py-5">
          {_tables?.map((table) => {
            const target = table.table ?? table.object

            return (
              <div key={table.id} className="flex items-center -space-x-3">
                {/* <IconFirestore size={16} /> */}
                <Badge className="bg-surface-300 bg-opacity-100 pr-1 gap-2 z-[1] font-mono text-[0.75rem] h-6 text-foreground">
                  <div className="relative w-3 h-3">
                    <Image fill src={integration?.icon ?? ''} alt={`${integration?.name}`} />
                  </div>
                  {target}{' '}
                  <ChevronRight
                    size={12}
                    strokeWidth={1.5}
                    className="text-foreground-lighter/50"
                  />
                </Badge>

                <Badge className="pl-5 rounded-l-none gap-2 h-6 font-mono text-[0.75rem]">
                  <Table2 size={12} strokeWidth={1.5} className="text-foreground-lighter/50" />
                  {table.schema}.{table.table_name}
                </Badge>
              </div>
            )
          })}
        </TableCell>
        <TableCell>
          {encryptedMetadata.map((metadata) => (
            <div key={metadata.name} className="flex items-center space-x-2 text-sm">
              {/* <p className="text-foreground-light">{metadata.label}:</p> */}
              <Link
                href={`/project/${ref}/settings/vault/secrets?search=${wrapper.name}_${metadata.name}`}
                className="transition text-foreground-light hover:text-foreground flex items-center space-x-2"
              >
                <span>Vault</span>
                <ExternalLink size={12} strokeWidth={1.5} className="text-foreground-lighter" />
              </Link>
            </div>
          ))}
        </TableCell>
        <TableCell className="space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <ButtonTooltip
                disabled={!canManageWrappers}
                type="default"
                icon={<Edit strokeWidth={1.5} />}
                className="px-1.5"
                tooltip={{
                  content: {
                    side: 'bottom',
                    text: !canManageWrappers
                      ? 'You need additional permissions to edit wrappers'
                      : 'Edit wrapper',
                  },
                }}
              />
            </SheetTrigger>
            <SheetContent size="default" tabIndex={undefined}>
              <EditWrapperSheet
                wrapper={wrapper!}
                wrapperMeta={integration?.meta}
                // onClose={() => {
                //   setEditWrapperShown(false)
                //   setisClosingEditWrapper(false)
                // }}
                isClosing={isClosingEditWrapper}
                setIsClosing={setisClosingEditWrapper}
              />
            </SheetContent>
          </Sheet>
          <ButtonTooltip
            type="default"
            disabled={!canManageWrappers}
            icon={<Trash strokeWidth={1.5} />}
            className="px-1.5"
            // onClick={() => onSelectDelete(wrapper)}
            tooltip={{
              content: {
                side: 'bottom',
                text: !canManageWrappers
                  ? 'You need additional permissions to delete wrappers'
                  : 'Delete wrapper',
              },
            }}
          />
        </TableCell>
      </TableRow>
      {/* // below modal needds refactoring to not use selectedWrapper */}
      {/* <DeleteWrapperModal
        selectedWrapper={selectedWrapperForDelete}
        onClose={() => setSelectedWrapperForDelete(null)}
      /> */}
    </>
  )
}

export default WrapperRow
