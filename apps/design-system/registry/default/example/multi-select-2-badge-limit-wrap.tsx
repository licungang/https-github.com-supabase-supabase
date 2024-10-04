import { useState } from 'react'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from 'ui-patterns/multi-select-2'

export default function MultiSelectDemo() {
  const [selectedValues, setSelectedValues] = useState<string[]>(['Apple', 'Banana'])
  const [open, setOpen] = useState(true)

  return (
    <MultiSelector
      open={open}
      onOpenChange={setOpen}
      values={selectedValues}
      onValuesChange={setSelectedValues}
    >
      <MultiSelectorTrigger
        className="w-72"
        label="Fruits"
        badgeLimit="wrap"
        showIcon={false}
        deletableBadge
      />
      <MultiSelectorContent sameWidthAsTrigger>
        <MultiSelectorList>
          <MultiSelectorItem value="Apple">Apple</MultiSelectorItem>
          <MultiSelectorItem value="Banana">Banana</MultiSelectorItem>
          <MultiSelectorItem value="Cherry">Cherry</MultiSelectorItem>
          <MultiSelectorItem value="Date">Date</MultiSelectorItem>
          <MultiSelectorItem value="Elderberrie">Elderberrie</MultiSelectorItem>
          <MultiSelectorItem value="Fig">Fig</MultiSelectorItem>
          <MultiSelectorItem value="Grape">Grape</MultiSelectorItem>
          <MultiSelectorItem value="Kiwi">Kiwi</MultiSelectorItem>
          <MultiSelectorItem value="Mango">Mango</MultiSelectorItem>
          <MultiSelectorItem value="Strawberry">Strawberry</MultiSelectorItem>
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  )
}
