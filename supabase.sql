-- 1. Crear tabla tareas (Diapositiva 7)
create table tareas (
  id bigint generated always as identity primary key,
  titulo text not null,
  completada boolean default false,
  user_id uuid references auth.users default auth.uid(),
  created_at timestamptz default now()
);

-- 2. Habilitar RLS y crear políticas en la tabla tareas (Diapositiva 8)
alter table tareas enable row level security;

create policy "ver mis tareas" on tareas
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "crear mis tareas" on tareas
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "editar mis tareas" on tareas
  for update to authenticated using ((select auth.uid()) = user_id);

create policy "borrar mis tareas" on tareas
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 3. Habilitar Realtime en la tabla tareas (Diapositiva 10)
alter publication supabase_realtime add table tareas;

-- 4. Políticas RLS para el bucket 'avatars' en Storage (Diapositiva 13)
create policy "subir a mi carpeta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "reemplazar mis archivos" on storage.objects
  for update to authenticated
  using ((storage.foldername(name))[1] = (select auth.uid())::text);

CREATE POLICY "eliminar mis archivos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );
