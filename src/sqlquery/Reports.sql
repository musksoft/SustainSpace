-- ============================================================
-- REPORTS TABLE
-- ============================================================


create table public.reports (

    id uuid primary key default gen_random_uuid(),

    -- ========================================================
    -- BUYER WHO SUBMITTED THE REPORT
    -- ========================================================

    buyer_id uuid not null
        references public.profiles(id)
        on delete cascade,


    -- ========================================================
    -- LISTING BEING REPORTED
    -- ========================================================

    listing_id uuid not null
        references public.listings(id)
        on delete cascade,


    -- ========================================================
    -- TRANSACTION CONNECTED TO THE LISTING
    -- ========================================================

    transaction_id uuid
        references public.transactions(id)
        on delete set null,


    -- ========================================================
    -- ORDER CONNECTED TO THE TRANSACTION
    -- ========================================================

    order_id uuid
        references public.orders(id)
        on delete set null,


    -- ========================================================
    -- REPORT INFORMATION
    -- ========================================================

    reason text not null,

    description text,


    -- ========================================================
    -- ADMIN REPORT STATUS
    -- ========================================================

    status text not null default 'pending'
        check (
            status in (
                'pending',
                'reviewing',
                'resolved',
                'dismissed'
            )
        ),


    -- ========================================================
    -- ADMIN REVIEW INFORMATION
    -- ========================================================

    admin_notes text,


    reviewed_by uuid
        references public.admins(id)
        on delete set null,


    reviewed_at timestamptz,


    -- ========================================================
    -- CREATED
    -- ========================================================

    created_at timestamptz not null default now(),


    -- ========================================================
    -- ONE REPORT PER BUYER / TRANSACTION
    -- ========================================================

    constraint reports_buyer_transaction_unique
        unique (buyer_id, transaction_id)

);


-- ============================================================
-- ENABLE RLS
-- ============================================================

alter table public.reports enable row level security;


-- ============================================================
-- REMOVE OLD POLICIES
-- ============================================================

drop policy if exists "buyers_can_create_reports"
on public.reports;

drop policy if exists "buyers_can_view_own_reports"
on public.reports;

drop policy if exists "admins_can_view_reports"
on public.reports;

drop policy if exists "admins_can_update_reports"
on public.reports;

drop policy if exists "Users can submit listing reports"
on public.reports;

drop policy if exists "Users can view their own reports"
on public.reports;

drop policy if exists "Admins can view all reports"
on public.reports;


-- ============================================================
-- BUYER CAN CREATE REPORT
-- ============================================================

create policy "buyers_can_create_reports"

on public.reports

for insert

to authenticated

with check (

    buyer_id = auth.uid()

    and exists (

        select 1

        from public.transactions t

        join public.orders o
            on o.id = t.order_id

        where t.id = transaction_id

        and o.id = order_id

        and o.listing_id = listing_id

        and t.buyer_id = auth.uid()

    )

);


-- ============================================================
-- BUYER CAN VIEW OWN REPORTS
-- ============================================================

create policy "buyers_can_view_own_reports"

on public.reports

for select

to authenticated

using (

    buyer_id = auth.uid()

);


-- ============================================================
-- ADMIN CAN VIEW ALL REPORTS
-- ============================================================

create policy "admins_can_view_reports"

on public.reports

for select

to authenticated

using (

    exists (

        select 1

        from public.admins a

        where a.user_id = auth.uid()

        and a.active = true

    )

);


-- ============================================================
-- ADMIN CAN UPDATE REPORTS
-- ============================================================

create policy "admins_can_update_reports"

on public.reports

for update

to authenticated

using (

    exists (

        select 1

        from public.admins a

        where a.user_id = auth.uid()

        and a.active = true

    )

)

with check (

    exists (

        select 1

        from public.admins a

        where a.user_id = auth.uid()

        and a.active = true

    )

);


-- ============================================================
-- PERMISSIONS
-- ============================================================

grant select, insert, update
on public.reports
to authenticated;


grant all
on public.reports
to service_role;


-- ============================================================
-- ADMIN REPORTS VIEW
-- ============================================================

drop view if exists public.admin_reports;


create view public.admin_reports
with (security_invoker = true)
as

select

    -- ========================================================
    -- REPORT
    -- ========================================================

    r.id as report_id,

    r.reason,

    r.description,

    r.status as report_status,

    r.admin_notes,

    r.reviewed_at,

    r.created_at as report_created_at,


    -- ========================================================
    -- LISTING
    -- ========================================================

    l.id as listing_id,

    l.title as listing_title,

    l.description as listing_description,

    l.price as listing_price,

    l.category as listing_category,

    l.item_condition,

    l.location,

    l.featured_image,

    l.gallery_images,

    l.status as listing_status,


    -- ========================================================
    -- SELLER
    -- ========================================================

    seller.id as seller_id,

    seller.full_name as seller_name,

    seller.email as seller_email,


    -- ========================================================
    -- BUYER
    -- ========================================================

    buyer.id as buyer_id,

    buyer.full_name as buyer_name,

    buyer.email as buyer_email,


    -- ========================================================
    -- TRANSACTION
    -- ========================================================

    t.id as transaction_id,

    t.status as transaction_status,

    t.payment_method,

    t.delivery_method,

    t.pickup_date,

    t.pickup_location,

    t.created_at as transaction_created_at,


    -- ========================================================
    -- ORDER
    -- ========================================================

    o.id as order_id,

    o.status as order_status,

    o.agreed_price,


    -- ========================================================
    -- ADMIN REVIEWER
    -- ========================================================

    a.id as reviewer_id,

    a.full_name as reviewer_name,


    -- ========================================================
    -- NUMBER OF REPORTS FOR THIS LISTING
    -- ========================================================

    (
        select count(*)
        from public.reports r2
        where r2.listing_id = r.listing_id
    ) as report_count,


    -- ========================================================
    -- PRIORITY
    -- ========================================================

    case

        when (
            select count(*)
            from public.reports r2
            where r2.listing_id = r.listing_id
        ) >= 3

        then 'High'


        when (
            select count(*)
            from public.reports r2
            where r2.listing_id = r.listing_id
        ) = 2

        then 'Medium'


        else 'Low'

    end as priority


from public.reports r


-- ============================================================
-- LISTING
-- ============================================================

join public.listings l
    on l.id = r.listing_id


-- ============================================================
-- BUYER
-- ============================================================

join public.profiles buyer
    on buyer.id = r.buyer_id


-- ============================================================
-- SELLER
-- ============================================================

join public.profiles seller
    on seller.id = l.seller_id


-- ============================================================
-- TRANSACTION
-- ============================================================

left join public.transactions t
    on t.id = r.transaction_id


-- ============================================================
-- ORDER
-- ============================================================

left join public.orders o
    on o.id = r.order_id


-- ============================================================
-- ADMIN REVIEWER
-- ============================================================

left join public.admins a
    on a.id = r.reviewed_by


order by r.created_at desc;


-- ============================================================
-- VIEW PERMISSION
-- ============================================================

grant select
on public.admin_reports
to authenticated;


-- ============================================================
-- ADMIN PROFILE ACCESS
-- ============================================================

drop policy if exists "Admins can view all profiles"
on public.profiles;


create policy "Admins can view all profiles"

on public.profiles

for select

to authenticated

using (

    exists (

        select 1

        from public.admins a

        where a.user_id = auth.uid()

        and a.active = true

    )

);