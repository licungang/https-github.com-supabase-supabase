alter extension "vector" update to '0.4.0';

create table "public"."active_pgbouncer_projects" (
    "id" bigint generated by default as identity not null,
    "project_ref" text
);


alter table "public"."active_pgbouncer_projects" enable row level security;

create table "public"."vercel_project_connections_without_supavisor" (
    "id" bigint generated by default as identity not null,
    "project_ref" text not null
);


alter table "public"."vercel_project_connections_without_supavisor" enable row level security;

CREATE UNIQUE INDEX active_pgbouncer_projects_pkey ON public.active_pgbouncer_projects USING btree (id);

CREATE UNIQUE INDEX vercel_project_connections_without_supavisor_pkey ON public.vercel_project_connections_without_supavisor USING btree (id);

alter table "public"."active_pgbouncer_projects" add constraint "active_pgbouncer_projects_pkey" PRIMARY KEY using index "active_pgbouncer_projects_pkey";

alter table "public"."vercel_project_connections_without_supavisor" add constraint "vercel_project_connections_without_supavisor_pkey" PRIMARY KEY using index "vercel_project_connections_without_supavisor_pkey";

grant delete on table "public"."active_pgbouncer_projects" to "anon";

grant insert on table "public"."active_pgbouncer_projects" to "anon";

grant references on table "public"."active_pgbouncer_projects" to "anon";

grant select on table "public"."active_pgbouncer_projects" to "anon";

grant trigger on table "public"."active_pgbouncer_projects" to "anon";

grant truncate on table "public"."active_pgbouncer_projects" to "anon";

grant update on table "public"."active_pgbouncer_projects" to "anon";

grant delete on table "public"."active_pgbouncer_projects" to "authenticated";

grant insert on table "public"."active_pgbouncer_projects" to "authenticated";

grant references on table "public"."active_pgbouncer_projects" to "authenticated";

grant select on table "public"."active_pgbouncer_projects" to "authenticated";

grant trigger on table "public"."active_pgbouncer_projects" to "authenticated";

grant truncate on table "public"."active_pgbouncer_projects" to "authenticated";

grant update on table "public"."active_pgbouncer_projects" to "authenticated";

grant delete on table "public"."active_pgbouncer_projects" to "service_role";

grant insert on table "public"."active_pgbouncer_projects" to "service_role";

grant references on table "public"."active_pgbouncer_projects" to "service_role";

grant select on table "public"."active_pgbouncer_projects" to "service_role";

grant trigger on table "public"."active_pgbouncer_projects" to "service_role";

grant truncate on table "public"."active_pgbouncer_projects" to "service_role";

grant update on table "public"."active_pgbouncer_projects" to "service_role";

grant delete on table "public"."vercel_project_connections_without_supavisor" to "anon";

grant insert on table "public"."vercel_project_connections_without_supavisor" to "anon";

grant references on table "public"."vercel_project_connections_without_supavisor" to "anon";

grant select on table "public"."vercel_project_connections_without_supavisor" to "anon";

grant trigger on table "public"."vercel_project_connections_without_supavisor" to "anon";

grant truncate on table "public"."vercel_project_connections_without_supavisor" to "anon";

grant update on table "public"."vercel_project_connections_without_supavisor" to "anon";

grant delete on table "public"."vercel_project_connections_without_supavisor" to "authenticated";

grant insert on table "public"."vercel_project_connections_without_supavisor" to "authenticated";

grant references on table "public"."vercel_project_connections_without_supavisor" to "authenticated";

grant select on table "public"."vercel_project_connections_without_supavisor" to "authenticated";

grant trigger on table "public"."vercel_project_connections_without_supavisor" to "authenticated";

grant truncate on table "public"."vercel_project_connections_without_supavisor" to "authenticated";

grant update on table "public"."vercel_project_connections_without_supavisor" to "authenticated";

grant delete on table "public"."vercel_project_connections_without_supavisor" to "service_role";

grant insert on table "public"."vercel_project_connections_without_supavisor" to "service_role";

grant references on table "public"."vercel_project_connections_without_supavisor" to "service_role";

grant select on table "public"."vercel_project_connections_without_supavisor" to "service_role";

grant trigger on table "public"."vercel_project_connections_without_supavisor" to "service_role";

grant truncate on table "public"."vercel_project_connections_without_supavisor" to "service_role";

grant update on table "public"."vercel_project_connections_without_supavisor" to "service_role";


