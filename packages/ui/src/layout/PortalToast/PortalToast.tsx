import dynamic from 'next/dynamic'
import { Toaster, ToastBar, toast } from 'react-hot-toast'
import { Button, IconX } from 'ui'

const PortalRootWithNoSSR = dynamic(
  // @ts-ignore
  () => import('@radix-ui/react-portal').then((portal) => portal.Root),
  { ssr: false }
)

const PortalToast = () => (
  // @ts-ignore
  <PortalRootWithNoSSR className="portal--toast">
    <Toaster
      position="top-right"
      toastOptions={{
        className: '!bg-overlay !text border !max-w-[600px] h-[auto] overflow-scroll',
        style: {
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          fontSize: '0.875rem',
          opacity: '1',
        },
        error: {
          duration: 8000,
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t} style={t.style}>
          {({ icon, message }) => {
            const isConsentToast = t.id === 'consent-toast'
            return (
              <>
                {/* {icon} */}
                <div className="w-full flex flex-col-reverse items-end">
                  <div
                    className={`toast-message w-full ${
                      t.type === 'loading'
                        ? 'max-w-[380px]'
                        : isConsentToast
                        ? 'max-w-none sm:max-w-[800px]'
                        : 'max-w-[600px]'
                    }`}
                    style={{
                      wordWrap: 'break-word',
                      overflow: 'auto',
                      maxHeight: "600px",
                    }}
                  >
                    {message}
                  </div>
                  {t.type !== 'loading' && !isConsentToast && (
                    <div className="ml-4">
                      <Button
                        className="!p-1"
                        type="text"
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          toast.dismiss(t.id)
                        }}
                      >
                        <IconX size={14} strokeWidth={2} />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )
          }}
        </ToastBar>
      )}
    </Toaster>
  </PortalRootWithNoSSR>
)

export default PortalToast
