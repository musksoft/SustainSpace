drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop table if exists public.profiles cascade;

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,

    full_name text not null,
    email text unique not null,

    phone text,
    location text,

    role text not null
        check (role in ('buyer', 'seller')),

    is_verified_seller boolean default false,

    created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profile_select"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profile_insert"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profile_update"
on public.profiles
for update
to authenticated
using (auth.uid() = id);
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

    insert into public.profiles (
        id,
        full_name,
        email,
        phone,
        location,
        role
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
        new.email,
        new.raw_user_meta_data->>'phone',
        new.raw_user_meta_data->>'location',
        coalesce(
            new.raw_user_meta_data->>'role',
            'buyer'
        )
    );

    return new;

end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

drop policy if exists "profile_select" on public.profiles;
drop policy if exists "profile_insert" on public.profiles;
drop policy if exists "profile_update" on public.profiles;

create policy "Allow users to read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Allow users to insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Allow users to update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id);

grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.profiles
to authenticated;