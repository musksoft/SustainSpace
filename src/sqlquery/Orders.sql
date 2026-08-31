-- ==========================================
-- ORDERS TABLE
-- ==========================================

DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    purchase_request_id UUID NOT NULL
        REFERENCES public.purchase_requests(id)
        ON DELETE CASCADE,

    listing_id UUID NOT NULL
        REFERENCES public.listings(id)
        ON DELETE CASCADE,

    buyer_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    seller_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    image_url TEXT,

    agreed_price NUMERIC NOT NULL,

    status TEXT NOT NULL DEFAULT 'waiting_for_buyer'
        CHECK (
            status IN (
                'waiting_for_buyer',
                'buyer_confirmed',
                'transaction_started',
                'completed',
                'cancelled'
            )
        ),

    created_at TIMESTAMPTZ DEFAULT now(),

    updated_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(listing_id)
);

ALTER TABLE public.orders
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view their transactions"
ON transactions
FOR SELECT
TO authenticated
USING (
  auth.uid() = seller_id
);


CREATE POLICY "Buyers can view their transactions"
ON transactions
FOR SELECT
TO authenticated
USING (
  auth.uid() = buyer_id
);


CREATE POLICY "orders_select"
ON public.orders
FOR SELECT
TO authenticated
USING (

    buyer_id = auth.uid()

    OR

    seller_id = auth.uid()

);

CREATE POLICY "orders_insert"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (

    seller_id = auth.uid()

);

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.orders
TO authenticated;

ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
ADD CONSTRAINT orders_status_check
CHECK (
    status IN (
        'waiting_for_buyer',
        'buyer_confirmed',
        'completed',
        'cancelled'
    )
);
