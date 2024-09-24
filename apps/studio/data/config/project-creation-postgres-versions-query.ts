import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { get, handleError, post } from 'data/fetchers'
import type { ResponseError } from 'types'
import { configKeys } from './keys'
import { CloudProvider } from 'shared-data'
import { components } from 'api-types'

export type ProjectCreationPostgresVersionsVariables = {
  cloudProvider: CloudProvider
  dbRegion: string
  organizationSlug: string | undefined
}

export type ProjectCreationPostgresVersion = components['schemas']['ProjectCreationVersionInfo']

export type ProjectCreationPostgresVersionsResponse = {
  available_versions: ProjectCreationPostgresVersion[]
}

export async function getPostgresCreationVersions(
  { cloudProvider, dbRegion, organizationSlug }: ProjectCreationPostgresVersionsVariables,
  signal?: AbortSignal
) {
  if (!organizationSlug) throw new Error('organizationSlug is required')

  const { data, error } = await post('/platform/organizations/{slug}/available-versions', {
    params: { path: { slug: organizationSlug } },
    body: { provider: cloudProvider, region: dbRegion },
  })

  if (error) handleError(error)
  return data as ProjectCreationPostgresVersionsResponse
}

export type ProjectCreationPostgresVersionData = Awaited<
  ReturnType<typeof getPostgresCreationVersions>
>
export type ProjectCreationPostgresVersionError = ResponseError

export const useProjectCreationPostgresVersionsQuery = <TData = ProjectCreationPostgresVersionData>(
  { cloudProvider, dbRegion, organizationSlug }: ProjectCreationPostgresVersionsVariables,
  {
    enabled = true,
    ...options
  }: UseQueryOptions<
    ProjectCreationPostgresVersionData,
    ProjectCreationPostgresVersionError,
    TData
  > = {}
) => {
  return useQuery<ProjectCreationPostgresVersionData, ProjectCreationPostgresVersionError, TData>(
    configKeys.projectCreationPostgresVersions(organizationSlug, cloudProvider, dbRegion),
    ({ signal }) =>
      getPostgresCreationVersions({ organizationSlug, cloudProvider, dbRegion }, signal),
    {
      enabled: enabled && typeof organizationSlug !== 'undefined',
      ...options,
    }
  )
}
