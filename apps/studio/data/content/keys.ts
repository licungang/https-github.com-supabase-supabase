export const contentKeys = {
  list: (projectRef: string | undefined) => ['projects', projectRef, 'content'] as const,
  folders: (projectRef: string | undefined, id: string | undefined) =>
    ['projects', projectRef, 'content', 'folders', id].filter(Boolean),
  resource: (projectRef: string | undefined, id: string | undefined) =>
    ['projects', projectRef, 'content', id] as const,
}
