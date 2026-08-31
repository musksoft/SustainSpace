-- ==========================================
-- TRANSACTIONS TABLE
-- ==========================================

CREATE TABLE public.transactions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES public.orders(id)
        ON DELETE CASCADE,

    buyer_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    seller_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    delivery_method TEXT NOT NULL
        CHECK (
            delivery_method IN (
                'pickup',
                'delivery'
            )
        ),

    payment_method TEXT NOT NULL
        CHECK (
            payment_method IN (
                'cash',
                'bank_transfer'
            )
        ),

    pickup_date DATE,

    pickup_location TEXT,

    verification_code TEXT,

    status TEXT NOT NULL DEFAULT 'waiting_for_seller'
        CHECK (
            status IN (
                'waiting_for_seller',
                'verification_generated',
                'waiting_for_pickup',
                'completed',
                'cancelled'
            )
        ),

    created_at TIMESTAMPTZ DEFAULT now(),

    updated_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(order_id)
);

ALTER TABLE public.transactions
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select"
ON public.transactions
FOR SELECT
TO authenticated
USING (

    buyer_id = auth.uid()

    OR

    seller_id = auth.uid()

);

CREATE POLICY "transactions_insert"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (

    buyer_id = auth.uid()

);

CREATE POLICY "buyer_update_transaction"
ON public.transactions
FOR UPDATE
TO authenticated
USING (

    buyer_id = auth.uid()

)
WITH CHECK (

    buyer_id = auth.uid()

);

CREATE POLICY "seller_update_transaction"
ON public.transactions
FOR UPDATE
TO authenticated
USING (

    seller_id = auth.uid()

)
WITH CHECK (

    seller_id = auth.uid()

);

CREATE POLICY "buyer_delete_transaction"
ON public.transactions
FOR DELETE
TO authenticated
USING (

    buyer_id = auth.uid()

);

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.transactions
TO authenticated;

ALTER TABLE public.transactions
DROP CONSTRAINT IF EXISTS transactions_status_check;


ALTER TABLE public.transactions
ADD CONSTRAINT transactions_status_check
CHECK (
    status IN (
        'pending',
        'completed'
    )
);


ALTER TABLE public.transactions
ALTER COLUMN status
SET DEFAULT 'pending';


SELECT id, 
seller_id,
status
FROM transactions
WHERE status="completed";