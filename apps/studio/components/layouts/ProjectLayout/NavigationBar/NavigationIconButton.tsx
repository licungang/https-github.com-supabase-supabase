import Link from 'next/link'
import React, { forwardRef } from 'react'

import { Route } from 'components/ui/ui.types'
import { cn } from 'ui'
import { useAppStateSnapshot } from 'state/app-state'

interface NavigationIconButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  route: Route
  isActive?: boolean
}

const NavigationIconButton = forwardRef<HTMLAnchorElement, NavigationIconButtonProps>(
  ({ route, isActive = false, ...props }, ref) => {
    const snap = useAppStateSnapshot()

    const iconClasses = [
      'absolute left-0 top-0 flex rounded items-center h-10 w-10 items-center justify-center', // Layout
    ]

    const classes = [
      'relative',
      'h-10 w-10 group-data-[state=expanded]:h-10 group-data-[state=expanded]:w-full',
      'transition-all duration-200',
      'flex items-center rounded',
      'group-data-[state=collapsed]:justify-center',
      'group-data-[state=expanded]:gap-0',
      'text-foreground-lighter hover:text-foreground ',
      'bg-studio hover:bg-surface-200',
      `${isActive ? '!bg-surface-300 !text-foreground shadow-sm' : ''}`,
      'group/item',
    ]
    return route.link !== undefined ? (
      <Link
        ref={ref}
        href={route.link!}
        aria-selected={isActive}
        {...props}
        className={cn(classes, props.className)}
      >
        <span className={cn(...iconClasses)} {...props}>
          {route.icon}
        </span>
        <span
          aria-hidden={snap.navigationPanelOpen || undefined}
          className={cn(
            'absolute',
            'left-7',
            'group-data-[state=expanded]:left-12',
            'min-w-[128px]',
            'text-sm text-foreground-light',
            'group-hover/item:text-foreground',
            'opacity-0 group-data-[state=expanded]:opacity-100',
            'transition-all',
            'group-aria-selected/item:text-foreground',
            'delay-100'
          )}
        >
          {route.label}
        </span>
      </Link>
    ) : (
      <span ref={ref} {...props}></span>
    )
  }
)

NavigationIconButton.displayName = 'NavigationIconButton'

export default NavigationIconButton
