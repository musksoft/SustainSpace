-- ==========================================
-- REVIEWS TABLE
-- ==========================================

CREATE TABLE public.reviews (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    transaction_id UUID NOT NULL
        REFERENCES public.transactions(id)
        ON DELETE CASCADE,

    listing_id UUID NOT NULL
        REFERENCES public.listings(id)
        ON DELETE CASCADE,

    seller_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    buyer_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    rating INTEGER NOT NULL
        CHECK (
            rating >= 1
            AND rating <= 5
        ),

    title TEXT,

    comment TEXT,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT reviews_one_per_transaction
        UNIQUE(transaction_id)

);

ALTER TABLE public.reviews
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select"

ON public.reviews

FOR SELECT

TO authenticated

USING (

    buyer_id = auth.uid()

    OR

    seller_id = auth.uid()

);

CREATE POLICY "reviews_insert"

ON public.reviews

FOR INSERT

TO authenticated

WITH CHECK (

    buyer_id = auth.uid()

);

GRANT SELECT, INSERT
ON public.reviews
TO authenticated;