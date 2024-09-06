import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import type { components } from 'data/api'
import { get, handleError } from 'data/fetchers'
import type { ResponseError } from 'types'
import { COOLDOWN_DURATION } from './disk-attributes-update-mutation'
import { configKeys } from './keys'

export type DiskAttributesVariables = {
  projectRef?: string
}

export type DiskAttribute = components['schemas']['DiskResponse']

export async function getDiskAttributes(
  { projectRef }: DiskAttributesVariables,
  signal?: AbortSignal
) {
  if (!projectRef) throw new Error('Project ref is required')

  const { data, error } = await get(`/platform/projects/{ref}/disk`, {
    params: { path: { ref: projectRef } },
    signal,
  })

  if (error) handleError(error)
  return data
}

export type DiskAttributesData = Awaited<ReturnType<typeof getDiskAttributes>>
export type DiskAttributesError = ResponseError

export const useDiskAttributesQuery = <TData = DiskAttributesData>(
  { projectRef }: DiskAttributesVariables,
  {
    enabled = true,
    ...options
  }: UseQueryOptions<DiskAttributesData, DiskAttributesError, TData> = {}
) =>
  useQuery<DiskAttributesData, DiskAttributesError, TData>(
    configKeys.diskAttributes(projectRef),
    ({ signal }) => getDiskAttributes({ projectRef }, signal),
    { enabled: enabled && typeof projectRef !== 'undefined', ...options }
  )

export const useRemainingDurationForDiskAttributeUpdate = ({
  projectRef,
}: {
  projectRef?: string
}) => {
  const { data } = useDiskAttributesQuery({ projectRef })
  const lastModifiedAtString = '2024-09-06 11:35:00.030161' // data?.last_modified_at !== undefined ? dayjs(data.last_modified_at).utc() : undefined
  const secondsFromNow = Math.max(
    0,
    dayjs().utc().diff(dayjs(lastModifiedAtString).utc(), 'second')
  )

  const remainingDuration = useMemo(() => {
    return lastModifiedAtString === undefined || COOLDOWN_DURATION - secondsFromNow < 0
      ? 0
      : COOLDOWN_DURATION - secondsFromNow
  }, [lastModifiedAtString])

  return { remainingDuration, isWithinCooldownWindow: remainingDuration > 0 }
}
