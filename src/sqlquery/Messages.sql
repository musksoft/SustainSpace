create table public.conversations (
    id uuid primary key default gen_random_uuid(),

    listing_id uuid not null
        references public.listings(id)
        on delete cascade,

    buyer_id uuid not null
        references public.profiles(id)
        on delete cascade,

    seller_id uuid not null
        references public.profiles(id)
        on delete cascade,

    created_at timestamptz not null default now(),

    -- ensures ONLY ONE conversation per buyer per listing
    unique (listing_id, buyer_id)
);

create table public.messages (
    id uuid primary key default gen_random_uuid(),

    conversation_id uuid not null
        references public.conversations(id)
        on delete cascade,

    sender_id uuid not null
        references public.profiles(id)
        on delete cascade,

    text text not null,

    created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "view_conversations"
on public.conversations
for select
to authenticated
using (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
);

create policy "create_conversation"
on public.conversations
for insert
to authenticated
with check (
    buyer_id = auth.uid()
);

create policy "view_messages"
on public.messages
for select
to authenticated
using (
    exists (
        select 1
        from public.conversations c
        where c.id = messages.conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
);

create policy "send_message"
on public.messages
for insert
to authenticated
with check (
    exists (
        select 1
        from public.conversations c
        where c.id = messages.conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
    and sender_id = auth.uid()
);

grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.conversations
to authenticated;

grant select, insert, update, delete
on public.messages
to authenticated;

drop policy if exists "create_conversation" on public.conversations;

create policy "create_conversation"
on public.conversations
for insert
to authenticated
with check (
    auth.uid() = buyer_id
    or auth.uid() = seller_id
);