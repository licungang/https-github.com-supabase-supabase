import * as Tooltip from '@radix-ui/react-tooltip'
import { Wand } from 'lucide-react'
import { Button } from 'ui'
import { useAppStateSnapshot } from 'state/app-state'
import { AiIconAnimation } from 'ui'

const AssistantButton = () => {
  const { setAiAssistantPanel, aiAssistantPanel } = useAppStateSnapshot()

  return (
    <Button
      type="text"
      id="assistant-trigger"
      className="w-6 h-6"
      onClick={() => {
        setAiAssistantPanel({ open: !aiAssistantPanel.open })
      }}
      icon={<AiIconAnimation allowHoverEffect className="w-4 h-4 text-foreground-light" />}
    />
  )
}

export default AssistantButton
