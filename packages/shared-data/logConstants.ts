const schemas = [
  {
    name: 'API Edge',
    reference: 'edge_logs',
    fields: [
      { path: 'id', type: 'string' },
      { path: 'timestamp', type: 'datetime' },
      { path: 'event_message', type: 'string' },
      { path: 'metadata.request.cf.asOrganization', type: 'string' },
      { path: 'metadata.request.cf.asn', type: 'number' },
      { path: 'metadata.request.cf.botManagement.corporateProxy', type: 'boolean' },
      { path: 'metadata.request.cf.botManagement.detectionIds', type: 'number[]' },
      { path: 'metadata.request.cf.botManagement.ja3Hash', type: 'string' },
      { path: 'metadata.request.cf.botManagement.score', type: 'number' },
      { path: 'metadata.request.cf.botManagement.staticResource', type: 'boolean' },
      { path: 'metadata.request.cf.botManagement.verifiedBot', type: 'boolean' },
      { path: 'metadata.request.cf.city', type: 'string' },
      { path: 'metadata.request.cf.clientTcpRtt', type: 'number' },
      { path: 'metadata.request.cf.clientTrustScore', type: 'number' },
      { path: 'metadata.request.cf.colo', type: 'string' },
      { path: 'metadata.request.cf.continent', type: 'string' },
      { path: 'metadata.request.cf.country', type: 'string' },
      { path: 'metadata.request.cf.edgeRequestKeepAliveStatus', type: 'number' },
      { path: 'metadata.request.cf.httpProtocol', type: 'string' },
      { path: 'metadata.request.cf.latitude', type: 'string' },
      { path: 'metadata.request.cf.longitude', type: 'string' },
      { path: 'metadata.request.cf.metroCode', type: 'string' },
      { path: 'metadata.request.cf.postalCode', type: 'string' },
      { path: 'metadata.request.cf.region', type: 'string' },
      { path: 'metadata.request.cf.timezone', type: 'string' },
      { path: 'metadata.request.cf.tlsCipher', type: 'string' },
      { path: 'metadata.request.cf.tlsClientAuth.certPresented', type: 'string' },
      { path: 'metadata.request.cf.tlsClientAuth.certRevoked', type: 'string' },
      { path: 'metadata.request.cf.tlsClientAuth.certVerified', type: 'string' },
      { path: 'metadata.request.cf.tlsExportedAuthenticator.clientFinished', type: 'string' },
      { path: 'metadata.request.cf.tlsExportedAuthenticator.clientHandshake', type: 'string' },
      { path: 'metadata.request.cf.tlsExportedAuthenticator.serverFinished', type: 'string' },
      { path: 'metadata.request.cf.tlsExportedAuthenticator.serverHandshake', type: 'string' },
      { path: 'metadata.request.cf.tlsVersion', type: 'string' },
      { path: 'metadata.request.headers.cf_connecting_ip', type: 'string' },
      { path: 'metadata.request.headers.cf_ipcountry', type: 'string' },
      { path: 'metadata.request.headers.cf_ray', type: 'string' },
      { path: 'metadata.request.headers.host', type: 'string' },
      { path: 'metadata.request.headers.referer', type: 'string' },
      { path: 'metadata.request.headers.x_client_info', type: 'string' },
      { path: 'metadata.request.headers.x_forwarded_proto', type: 'string' },
      { path: 'metadata.request.headers.x_real_ip', type: 'string' },
      { path: 'metadata.request.host', type: 'string' },
      { path: 'metadata.request.method', type: 'string' },
      { path: 'metadata.request.path', type: 'string' },
      { path: 'metadata.request.protocol', type: 'string' },
      { path: 'metadata.request.search', type: 'string' },
      { path: 'metadata.request.url', type: 'string' },
      { path: 'metadata.response.headers.cf_cache_status', type: 'string' },
      { path: 'metadata.response.headers.cf_ray', type: 'string' },
      { path: 'metadata.response.headers.content_location', type: 'string' },
      { path: 'metadata.response.headers.content_range', type: 'string' },
      { path: 'metadata.response.headers.content_type', type: 'string' },
      { path: 'metadata.response.headers.date', type: 'string' },
      { path: 'metadata.response.headers.sb_gateway_version', type: 'string' },
      { path: 'metadata.response.headers.transfer_encoding', type: 'string' },
      { path: 'metadata.response.headers.x_kong_proxy_latency', type: 'string' },
      { path: 'metadata.response.origin_time', type: 'number' },
      { path: 'metadata.response.status_code', type: 'number' },
    ],
  },
  {
    name: 'Auth',
    reference: 'auth_logs',
    fields: [
      { path: 'event_message', type: 'string' },
      { path: 'id', type: 'string' },
      { path: 'timestamp', type: 'datetime' },
      { path: 'metadata.auth_event.action', type: 'string' },
      { path: 'metadata.auth_event.actor_id', type: 'string' },
      { path: 'metadata.auth_event.actor_username', type: 'string' },
      { path: 'metadata.auth_event.log_type', type: 'string' },
      { path: 'metadata.auth_event.traits.provider', type: 'string' },
      { path: 'metadata.auth_event.traits.user_email', type: 'string' },
      { path: 'metadata.auth_event.traits.user_id', type: 'string' },
      { path: 'metadata.auth_event.traits.user_phone', type: 'string' },
      { path: 'metadata.component', type: 'string' },
      { path: 'metadata.duration', type: 'number' },
      { path: 'metadata.host', type: 'string' },
      { path: 'metadata.level', type: 'string' },
      { path: 'metadata.method', type: 'string' },
      { path: 'metadata.msg', type: 'string' },
      { path: 'metadata.path', type: 'string' },
      { path: 'metadata.referer', type: 'string' },
      { path: 'metadata.remote_addr', type: 'string' },
      { path: 'metadata.status', type: 'number' },
      { path: 'metadata.timestamp', type: 'string' },
    ],
  },
  {
    name: 'Storage',
    reference: 'storage_logs',
    fields: [
      { path: 'event_message', type: 'string' },
      { path: 'id', type: 'string' },
      { path: 'timestamp', type: 'datetime' },
      { path: 'metadata.context.host', type: 'string' },
      { path: 'metadata.context.pid', type: 'number' },
      { path: 'metadata.level', type: 'string' },
      { path: 'metadata.project', type: 'string' },
      { path: 'metadata.req.headers.accept', type: 'string' },
      { path: 'metadata.req.headers.cf_connecting_ip', type: 'string' },
      { path: 'metadata.req.headers.cf_ray', type: 'string' },
      { path: 'metadata.req.headers.content_length', type: 'string' },
      { path: 'metadata.req.headers.content_type', type: 'string' },
      { path: 'metadata.req.headers.host', type: 'string' },
      { path: 'metadata.req.headers.referer', type: 'string' },
      { path: 'metadata.req.headers.user_agent', type: 'string' },
      { path: 'metadata.req.headers.x_client_info', type: 'string' },
      { path: 'metadata.req.headers.x_forwarded_proto', type: 'string' },
      { path: 'metadata.req.hostname', type: 'string' },
      { path: 'metadata.req.method', type: 'string' },
      { path: 'metadata.req.remoteAddress', type: 'string' },
      { path: 'metadata.req.remotePort', type: 'number' },
      { path: 'metadata.req.url', type: 'string' },
      { path: 'metadata.reqId', type: 'string' },
      { path: 'metadata.res.statusCode', type: 'number' },
      { path: 'metadata.res.headers.content_length', type: 'number' },
      { path: 'metadata.res.headers.content_type', type: 'string' },
      { path: 'metadata.responseTime', type: 'number' },
      { path: 'metadata.tenantId', type: 'string' },
      { path: 'metadata.rawError', type: 'string' },
    ],
  },
  {
    name: 'Function Edge',
    reference: 'function_edge_logs',
    fields: [
      { path: 'event_message', type: 'string' },
      { path: 'id', type: 'string' },
      { path: 'timestamp', type: 'datetime' },
      { path: 'metadata.deployment_id', type: 'string' },
      { path: 'metadata.execution_time_ms', type: 'number' },
      { path: 'metadata.function_id', type: 'string' },
      { path: 'metadata.project_ref', type: 'string' },
      { path: 'metadata.request.headers.accept', type: 'string' },
      { path: 'metadata.request.headers.content_length', type: 'string' },
      { path: 'metadata.request.headers.host', type: 'string' },
      { path: 'metadata.request.headers.user_agent', type: 'string' },
      { path: 'metadata.request.host', type: 'string' },
      { path: 'metadata.request.method', type: 'string' },
      { path: 'metadata.request.pathname', type: 'string' },
      { path: 'metadata.request.protocol', type: 'string' },
      { path: 'metadata.request.url', type: 'string' },
      { path: 'metadata.response.headers.content_length', type: 'string' },
      { path: 'metadata.response.headers.content_type', type: 'string' },
      { path: 'metadata.response.headers.date', type: 'string' },
      { path: 'metadata.response.headers.server', type: 'string' },
      { path: 'metadata.response.headers.vary', type: 'string' },
      { path: 'metadata.response.status_code', type: 'number' },
      { path: 'metadata.version', type: 'string' },
    ],
  },
  {
    name: 'Function Runtime',
    reference: 'function_logs',
    fields: [
      { path: 'event_message', type: 'string' },
      { path: 'id', type: 'string' },
      { path: 'timestamp', type: 'datetime' },
      { path: 'metadata.deployment_id', type: 'string' },
      { path: 'metadata.event_type', type: 'string' },
      { path: 'metadata.execution_id', type: 'string' },
      { path: 'metadata.function_id', type: 'string' },
      { path: 'metadata.level', type: 'string' },
      { path: 'metadata.project_ref', type: 'string' },
      { path: 'metadata.region', type: 'string' },
      { path: 'metadata.timestamp', type: 'string' },
      { path: 'metadata.version', type: 'string' },
    ],
  },
  {
    name: 'Postgres',
    reference: 'postgres_logs',
    fields: [
      { path: 'event_message', type: 'string' },
      { path: 'id', type: 'string' },
      { path: 'timestamp', type: 'datetime' },
      { path: 'metadata.host', type: 'string' },
      { path: 'metadata.parsed.backend_type', type: 'string' },
      { path: 'metadata.parsed.command_tag', type: 'string' },
      { path: 'metadata.parsed.connection_from', type: 'string' },
      { path: 'metadata.parsed.database_name', type: 'string' },
      { path: 'metadata.parsed.error_severity', type: 'string' },
      { path: 'metadata.parsed.process_id', type: 'number' },
      { path: 'metadata.parsed.query_id', type: 'number' },
      { path: 'metadata.parsed.session_id', type: 'string' },
      { path: 'metadata.parsed.session_line_num', type: 'number' },
      { path: 'metadata.parsed.session_start_time', type: 'string' },
      { path: 'metadata.parsed.sql_state_code', type: 'string' },
      { path: 'metadata.parsed.timestamp', type: 'string' },
      { path: 'metadata.parsed.transaction_id', type: 'number' },
      { path: 'metadata.parsed.user_name', type: 'string' },
      { path: 'metadata.parsed.virtual_transaction_id', type: 'string' },
    ],
  },
  {
    name: 'Realtime',
    reference: 'realtime_logs',
    fields: [
      { path: 'event_message', type: 'string' },
      { path: 'id', type: 'string' },
      { path: 'timestamp', type: 'datetime' },
      { path: 'metadata.level', type: 'string' },
      { path: 'metadata.measurements.connected', type: 'number' },
      { path: 'metadata.measurements.connected_cluster', type: 'number' },
      { path: 'metadata.measurements.limit', type: 'number' },
      { path: 'metadata.measurements.sum', type: 'number' },
      { path: 'metadata.external_id', type: 'string' },
    ],
  },
  {
    name: 'PostgREST',
    reference: 'postgrest_logs',
    fields: [
      { path: 'event_message', type: 'string' },
      { path: 'id', type: 'string' },
      { path: 'timestamp', type: 'datetime' },
      { path: 'metadata.host', type: 'string' },
    ],
  },
  {
    name: 'PgBouncer',
    reference: 'pgbouncer_logs',
    fields: [
      { path: 'event_message', type: 'string' },
      { path: 'id', type: 'string' },
      { path: 'timestamp', type: 'datetime' },
      { path: 'metadata.host', type: 'string' },
    ],
  },
]

export default {
  schemas,
}
