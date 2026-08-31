-- ==========================================
-- CREATE SYSTEM ACTIVITY TABLE
-- ==========================================

CREATE TABLE public.system_activity (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    -- Person who performed the action
    user_id UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,


    -- Admin who performed action (optional)
    admin_id UUID
        REFERENCES public.admins(id)
        ON DELETE SET NULL,


    -- Action name
    action TEXT NOT NULL,


    -- Related table/entity
    entity_type TEXT NOT NULL
    CHECK (
        entity_type IN (
            'user',
            'listing',
            'purchase_request',
            'order',
            'transaction',
            'admin'
        )
    ),


    -- ID of related record
    entity_id UUID,


    -- Human readable information
    description TEXT,


    created_at TIMESTAMPTZ DEFAULT now()

);



-- ==========================================
-- ENABLE SECURITY
-- ==========================================

ALTER TABLE public.system_activity
ENABLE ROW LEVEL SECURITY;



-- ==========================================
-- ADMIN CAN VIEW ALL ACTIVITIES
-- ==========================================

CREATE POLICY "admins_can_view_system_activity"

ON public.system_activity

FOR SELECT

TO authenticated

USING (

    EXISTS (

        SELECT 1

        FROM public.admins

        WHERE admins.user_id = auth.uid()

        AND admins.active = true

    )

);



-- ==========================================
-- AUTHENTICATED USERS CAN INSERT THEIR OWN EVENTS
-- ==========================================

CREATE POLICY "users_can_create_activity"

ON public.system_activity

FOR INSERT

TO authenticated

WITH CHECK (

    user_id = auth.uid()

);



-- ==========================================
-- ADMINS CAN INSERT ADMIN EVENTS
-- ==========================================

CREATE POLICY "admins_can_create_activity"

ON public.system_activity

FOR INSERT

TO authenticated

WITH CHECK (

    EXISTS (

        SELECT 1

        FROM public.admins

        WHERE admins.user_id = auth.uid()

        AND admins.active = true

    )

);



-- ==========================================
-- PERMISSIONS
-- ==========================================

GRANT USAGE
ON SCHEMA public
TO authenticated;


GRANT SELECT, INSERT
ON public.system_activity
TO authenticated;



-- ==========================================
-- OPTIONAL INDEXES FOR FAST ADMIN SEARCH
-- ==========================================

CREATE INDEX system_activity_entity_index

ON public.system_activity(entity_type);



CREATE INDEX system_activity_created_index

ON public.system_activity(created_at DESC);



-- ==========================================
-- CHECK TABLE
-- ==========================================

SELECT *
FROM public.system_activity;

INSERT INTO public.system_activity
(
    user_id,
    action,
    entity_type,
    entity_id,
    description,
    created_at
)

SELECT

    seller_id,

    'LISTING_CREATED',

    'listing',

    id,

    CONCAT(
        'Listing created: ',
        title
    ),

    created_at

FROM public.listings;

INSERT INTO public.system_activity
(
    user_id,
    action,
    entity_type,
    entity_id,
    description,
    created_at
)

SELECT

    buyer_id,

    CASE
        WHEN status='accepted'
        THEN 'REQUEST_ACCEPTED'

        WHEN status='cancelled'
        THEN 'REQUEST_CANCELLED'

        ELSE 'REQUEST_CREATED'
    END,

    'purchase_request',

    id,

    CONCAT(
        'Purchase request status: ',
        status
    ),

    created_at

FROM public.purchase_requests;