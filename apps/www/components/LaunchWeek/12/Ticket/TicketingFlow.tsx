import React from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion'
import { Badge, cn } from 'ui'
import { DEFAULT_TRANSITION, INITIAL_BOTTOM, getAnimation } from '~/lib/animations'
import { LW12_DATE, LW12_LAUNCH_DATE } from '~/lib/constants'
import useWinningChances from '../../hooks/useWinningChances'
import useLwGame from '../../hooks/useLwGame'

import useConfData from '~/components/LaunchWeek/hooks/use-conf-data'
import SectionContainer from '~/components/Layouts/SectionContainer'
import TicketContainer from './TicketContainer'
import TicketForm from './TicketForm'
import CountdownComponent from '../Countdown'
import TicketPresence from './TicketPresence'
import TicketActions from './TicketActions'
import LW12Background from '../LW12Background'

const LWGame = dynamic(() => import('./LW12Game'))

const TicketingFlow = () => {
  const { ticketState, userData, showCustomizationForm } = useConfData()
  const { isGameMode, setIsGameMode } = useLwGame(ticketState !== 'ticket' || showCustomizationForm)

  const isLoading = !isGameMode && ticketState === 'loading'
  const isRegistering = !isGameMode && ticketState === 'registration'
  const hasTicket = !isGameMode && ticketState === 'ticket'
  const hasPlatinumTicket = userData.platinum
  const hasSecretTicket = userData.secret
  const metadata = userData?.metadata

  const transition = DEFAULT_TRANSITION
  const initial = INITIAL_BOTTOM
  const animate = getAnimation({ duration: 1 })
  const exit = { opacity: 0, transition: { ...transition, duration: 0.2 } }

  const winningChances = useWinningChances()

  const DISPLAY_NAME = userData?.name || userData?.username
  const FIRST_NAME = DISPLAY_NAME?.split(' ')[0]

  return (
    <>
      <SectionContainer className="relative !pt-8 lg:!pt-20 gap-5 h-full flex-1">
        <div className="relative z-10 flex flex-col h-full">
          <h1 className="sr-only">Supabase Launch Week 12 | {LW12_DATE}</h1>
          <div className="relative z-10 w-full h-full flex flex-col justify-center gap-5 md:gap-10">
            <LazyMotion features={domAnimation}>
              <AnimatePresence mode="wait" key={ticketState}>
                {isLoading && (
                  <m.div
                    key="loading"
                    initial={exit}
                    animate={animate}
                    exit={exit}
                    className="relative w-full min-h-[400px] mx-auto py-16 md:py-24 flex flex-col items-center gap-6 text-foreground"
                  >
                    <div className="hidden">
                      <TicketForm />
                    </div>
                    <svg
                      className="animate-spinner opacity-50 w-5 h-5 md:w-6 md:h-6"
                      width="100%"
                      height="100%"
                      viewBox="0 0 62 61"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M61 31C61 14.4315 47.5685 1 31 1C14.4315 1 1 14.4315 1 31"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                  </m.div>
                )}
                {isRegistering && (
                  <m.div
                    key="registration"
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    className={cn(
                      'w-full min-h-[400px] max-w-3xl mx-auto text-left md:text-center flex flex-col md:items-center justify-center gap-6 lg:gap-8 opacity-0 invisible',
                      !isGameMode && !hasTicket && 'opacity-100 visible'
                    )}
                  >
                    <div>
                      <CountdownComponent
                        date={LW12_LAUNCH_DATE}
                        showCard={false}
                        className="[&_*]:leading-4 text-foreground-lighter"
                        size="large"
                      />
                    </div>
                    <div className="flex flex-col md:items-center gap-2">
                      <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-6 uppercase text-2xl tracking-wider">
                        <h2 className="text-foreground">
                          <strong className="font-medium">Launch Week</strong> 12
                        </h2>
                        <span className="h-full border-r border-foreground hidden md:inline" />
                        <p className="text-foreground-light">{LW12_DATE}</p>
                      </div>
                      <p className="text-foreground-lighter text-lg">
                        Join us for a week of new features and find new ways to level up your
                        development.
                      </p>
                    </div>
                    <TicketForm />
                  </m.div>
                )}
                {hasTicket && (
                  <m.div
                    key="ticket"
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    className="w-full flex-1 min-h-[400px] h-full flex flex-col xl:flex-row items-center xl:justify-center xl:items-center gap-8 md:gap-10 xl:gap-20 text-foreground text-center md:text-left"
                  >
                    <div className="w-full lg:w-auto h-full mt-3 md:mt-6 xl:mt-0 max-w-lg flex flex-col items-center justify-center">
                      <TicketContainer />
                    </div>
                    <div className="order-first xl:h-full w-full max-w-lg gap-3 flex flex-col items-center justify-center xl:items-start xl:justify-center text-center xl:text-left">
                      {hasSecretTicket && <Badge variant="outline">Secret ticket</Badge>}
                      <div className="flex flex-col">
                        <CountdownComponent date={LW12_LAUNCH_DATE} showCard={false} />
                      </div>
                      {hasPlatinumTicket ? (
                        <div>
                          {hasSecretTicket && !metadata?.hasSharedSecret ? (
                            <p className="text-2xl mb-1">
                              Share again to boost your chance of winning!
                            </p>
                          ) : (
                            <p className="text-2xl mb-1">Thanks for sharing!</p>
                          )}
                          <p className="text-[#8B9092]">
                            Join on {LW12_DATE} to find out what we shipped.
                          </p>
                        </div>
                      ) : winningChances !== 2 ? (
                        <div>
                          {!hasSecretTicket && (
                            <p className="text-2xl mb-1">{FIRST_NAME}, you're in!</p>
                          )}
                          <p className="text-[#8B9092]">
                            Now share your ticket to have a chance of winning limited swag.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl mb-1">{FIRST_NAME}, almost there!</p>
                          <p className="text-[#8B9092]">
                            Keep sharing to max out your chances of winning AirPods Max and other
                            limited swag.
                          </p>
                        </div>
                      )}
                      <div className="w-full my-3">
                        <TicketActions />
                      </div>
                      {!hasPlatinumTicket && <TicketPresence />}
                    </div>
                  </m.div>
                )}
                {!showCustomizationForm && isGameMode && (
                  <m.div
                    key="ticket"
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    className="w-full flex justify-center text-foreground !h-[500px]"
                  >
                    <LWGame setIsGameMode={setIsGameMode} />
                  </m.div>
                )}
              </AnimatePresence>
            </LazyMotion>
          </div>
        </div>
      </SectionContainer>
      <LW12Background
        className={cn('opacity-100 transition-opacity', hasTicket && 'opacity-80 dark:opacity-60')}
      />
    </>
  )
}

export default TicketingFlow
