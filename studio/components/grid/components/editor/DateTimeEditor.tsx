import { ChangeEvent } from 'react'
import { EditorProps } from '@supabase/react-data-grid'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import moment from 'moment'

dayjs.extend(customParseFormat)

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus()
  input?.select()
}

interface Props<TRow, TSummaryRow = unknown> extends EditorProps<TRow, TSummaryRow> {
  format: string
}

const INPUT_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

function BaseEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  format,
  onRowChange,
  onClose,
}: Props<TRow, TSummaryRow>) {
  const value = row[column.key as keyof TRow] as unknown as string
  const timeValue = value ? dayjs(value, format).format(INPUT_DATE_TIME_FORMAT) : value

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const _value = event.target.value
    console.log('the _value', _value)
    if (_value.length === 0) {
      onRowChange({ ...row, [column.key]: null })
    } else {
      //parsing the date into ISO 8601 date  using the momemt library
      const completeDate = moment(_value, moment.ISO_8601).toISOString()
      const _timeValue = dayjs(completeDate).format(format)
      onRowChange({ ...row, [column.key]: _timeValue })
    }
  }

  return (
    <input
      className="sb-grid-datetime-editor"
      ref={autoFocusAndSelect}
      value={timeValue ?? ''}
      onChange={onChange}
      onBlur={() => onClose(true)}
      type="datetime-local"
      step="1"
    />
  )
}

export function DateTimeEditor<TRow, TSummaryRow = unknown>(props: EditorProps<TRow, TSummaryRow>) {
  return <BaseEditor {...props} format="YYYY-MM-DDTHH:mm:ss" />
}

export function DateTimeWithTimezoneEditor<TRow, TSummaryRow = unknown>(
  props: EditorProps<TRow, TSummaryRow>
) {
  return <BaseEditor {...props} format="YYYY-MM-DDTHH:mm:ssZ" />
}
