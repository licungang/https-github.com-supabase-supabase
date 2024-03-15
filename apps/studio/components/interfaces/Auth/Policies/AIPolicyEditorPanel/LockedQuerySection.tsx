import { Lock } from 'lucide-react'
import { useRouter } from 'next/router'

import { useParams } from 'common'
import { Button } from 'ui'
import { generateQuery } from './AIPolicyEditorPanel.utils'
import { useTableEditorStateSnapshot } from 'state/table-editor'

interface LockedCreateQuerySection {
  isEditing: boolean
  formFields: { name: string; table: string; behaviour: string; command: string; roles: string }
  editorOneRef: any
  editorTwoRef: any
}

export const LockedCreateQuerySection = ({
  isEditing,
  formFields,
  editorOneRef,
  editorTwoRef,
}: LockedCreateQuerySection) => {
  const router = useRouter()
  const { ref } = useParams()
  const state = useTableEditorStateSnapshot()

  const { name, table, behaviour, command, roles } = formFields

  return (
    <div className="bg-surface-300 pt-2 pb-1">
      <div className="flex items-center justify-between px-5 mb-1">
        <div className="flex items-center">
          <div className="pl-0.5 pr-5 flex items-center justify-center">
            <Lock size={14} className="text-foreground-lighter" />
          </div>
          <p className="text-xs text-foreground-lighter font-mono uppercase">
            Use options above to edit
          </p>
        </div>
        <Button
          type="default"
          onClick={() =>
            router.push(
              `/project/${ref}/sql/new?content=${generateQuery({
                name,
                schema: state.selectedSchemaName,
                table,
                behaviour,
                command,
                roles: roles.length === 0 ? 'public' : roles,
                using: (editorOneRef.current?.getValue() ?? undefined)?.trim(),
                check:
                  command === 'insert'
                    ? (editorOneRef.current?.getValue() ?? undefined)?.trim()
                    : (editorTwoRef.current?.getValue() ?? undefined)?.trim(),
              })}`
            )
          }
        >
          Open in SQL Editor
        </Button>
      </div>
      <div className="flex items-start" style={{ fontSize: '14px' }}>
        <p className="px-6 font-mono text-sm text-foreground-light select-none">1</p>
        <p className="font-mono tracking-tighter">
          <span className="text-[#569cd6]">{isEditing ? 'ALTER' : 'CREATE'}</span> POLICY "
          {name.length === 0 ? 'policy_name' : name}"
        </p>
      </div>
      <div className="flex items-start" style={{ fontSize: '14px' }}>
        <p className="px-6 font-mono text-sm text-foreground-light select-none">2</p>
        <p className="font-mono tracking-tighter">
          <span className="text-[#569cd6]">ON</span> "{state.selectedSchemaName}"."
          {table}"
        </p>
      </div>
      {!isEditing && (
        <>
          <div className="flex items-start" style={{ fontSize: '14px' }}>
            <p className="px-6 font-mono text-sm text-foreground-light select-none">3</p>
            <p className="font-mono tracking-tighter">
              <span className="text-[#569cd6]">AS</span> {behaviour.toLocaleUpperCase()}
            </p>
          </div>
          <div className="flex items-start" style={{ fontSize: '14px' }}>
            <p className="px-6 font-mono text-sm text-foreground-light select-none">4</p>
            <p className="font-mono tracking-tighter">
              <span className="text-[#569cd6]">FOR</span> {command.toLocaleUpperCase()}
            </p>
          </div>
        </>
      )}
      <div className="flex items-start" style={{ fontSize: '14px' }}>
        <p className="px-6 font-mono text-sm text-foreground-light select-none">5</p>
        <p className="font-mono tracking-tighter">
          <span className="text-[#569cd6]">TO</span> {roles.length === 0 ? 'public' : roles}
        </p>
      </div>
      <div className="flex items-start" style={{ fontSize: '14px' }}>
        <p className="px-6 font-mono text-sm text-foreground-light select-none">6</p>
        <p className="font-mono tracking-tighter">
          <span className="text-[#569cd6]">{command === 'insert' ? 'WITH CHECK' : 'USING'}</span>{' '}
          <span className="text-[#ffd700]">(</span>
        </p>
      </div>
    </div>
  )
}

export const LockedRenameQuerySection = ({
  oldName,
  newName,
  table,
  lineNumber,
}: {
  oldName: string
  newName: string
  table: string
  lineNumber: number
}) => {
  const state = useTableEditorStateSnapshot()

  return (
    <div className="bg-surface-300 py-1">
      <div className="flex items-center" style={{ fontSize: '14px' }}>
        <div className="w-[57px]">
          <p className="w-[31px] flex justify-end font-mono text-sm text-foreground-light select-none">
            {lineNumber}
          </p>
        </div>
        <p className="font-mono tracking-tighter">
          <span className="text-[#569cd6]">ALTER</span> POLICY {oldName}
        </p>
      </div>
      <div className="flex items-center" style={{ fontSize: '14px' }}>
        <div className="w-[57px]">
          <p className="w-[31px] flex justify-end font-mono text-sm text-foreground-light select-none">
            {lineNumber + 1}
          </p>
        </div>
        <p className="font-mono tracking-tighter">
          <span className="text-[#569cd6]">ON</span> "{state.selectedSchemaName}"."{table}"
        </p>
      </div>
      <div className="flex items-center" style={{ fontSize: '14px' }}>
        <div className="w-[57px]">
          <p className="w-[31px] flex justify-end font-mono text-sm text-foreground-light select-none">
            {lineNumber + 2}
          </p>
        </div>
        <p className="font-mono tracking-tighter">
          <span className="text-[#569cd6]">RENAME</span> TO "{newName}";
        </p>
      </div>
    </div>
  )
}
