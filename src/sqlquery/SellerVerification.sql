
-- =========================================================
-- SELLER VERIFICATION SYSTEM
-- React handles:
--   - seller role check
--   - 5+ sold items check
--   - maximum 2 attempts
--   - document selection
-- Admin approval/rejection will be added later.
-- =========================================================


-- =========================================================
-- 1. REMOVE OLD TABLE 
-- =========================================================

DROP TABLE IF EXISTS public.seller_verifications CASCADE;


-- =========================================================
-- 2. CREATE SELLER VERIFICATIONS TABLE
-- =========================================================

CREATE TABLE public.seller_verifications (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    seller_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    -- Attempt 1 or 2
    attempt_number INTEGER NOT NULL
        CHECK (attempt_number IN (1, 2)),

    -- Verification status
    status TEXT NOT NULL DEFAULT 'submitted'
        CHECK (
            status IN (
                'submitted',
                'approved',
                'rejected'
            )
        ),

    -- Required document
    primary_document_path TEXT NOT NULL,

    -- Optional second document
    secondary_document_path TEXT,

    -- Optional rejection reason
    rejection_reason TEXT,

    -- Admin review fields
    reviewed_at TIMESTAMPTZ,

    reviewed_by UUID,

    created_at TIMESTAMPTZ DEFAULT now(),

    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Seller can only have attempt 1 once
    -- and attempt 2 once.
    UNIQUE (
        seller_id,
        attempt_number
    )
);


-- =========================================================
-- 3. ENABLE RLS
-- =========================================================

ALTER TABLE public.seller_verifications
ENABLE ROW LEVEL SECURITY;


-- =========================================================
-- 4. SELLER CAN VIEW THEIR OWN REQUESTS
-- =========================================================

DROP POLICY IF EXISTS "sellers_view_own_verification"
ON public.seller_verifications;

CREATE POLICY "sellers_view_own_verification"

ON public.seller_verifications

FOR SELECT

TO authenticated

USING (
    seller_id = auth.uid()
);


-- =========================================================
-- 5. SELLER CAN SUBMIT THEIR OWN REQUEST
-- =========================================================

DROP POLICY IF EXISTS "sellers_submit_verification"
ON public.seller_verifications;

CREATE POLICY "sellers_submit_verification"

ON public.seller_verifications

FOR INSERT

TO authenticated

WITH CHECK (
    seller_id = auth.uid()
    AND status = 'submitted'
);


-- =========================================================
-- 6. SELLERS CANNOT UPDATE REQUESTS
-- =========================================================

-- No UPDATE policy
--
-- Admin approval/rejection will be implemented later.


-- =========================================================
-- 7. SELLERS CANNOT DELETE REQUESTS
-- =========================================================

-- No DELETE policy 


-- =========================================================
-- 8. TABLE PERMISSIONS
-- =========================================================

GRANT SELECT, INSERT
ON public.seller_verifications
TO authenticated;


-- =========================================================
-- 9. STORAGE BUCKET
-- =========================================================

INSERT INTO storage.buckets (
    id,
    name,
    public
)

VALUES (
    'seller-verification-documents',
    'seller-verification-documents',
    false
)

ON CONFLICT (id)
DO NOTHING;


-- =========================================================
-- 10. STORAGE UPLOAD POLICY
-- =========================================================

DROP POLICY IF EXISTS
"sellers_upload_verification_documents"
ON storage.objects;

CREATE POLICY
"sellers_upload_verification_documents"

ON storage.objects

FOR INSERT

TO authenticated

WITH CHECK (

    bucket_id = 'seller-verification-documents'

    AND
    (storage.foldername(name))[1] = auth.uid()::text

);


-- =========================================================
-- 11. STORAGE SELECT POLICY
-- =========================================================

DROP POLICY IF EXISTS
"sellers_view_verification_documents"
ON storage.objects;

CREATE POLICY
"sellers_view_verification_documents"

ON storage.objects

FOR SELECT

TO authenticated

USING (

    bucket_id = 'seller-verification-documents'

    AND
    (storage.foldername(name))[1] = auth.uid()::text

);


-- =========================================================
-- 12. STORAGE DELETE POLICY
-- =========================================================

DROP POLICY IF EXISTS
"sellers_delete_verification_documents"
ON storage.objects;

CREATE POLICY
"sellers_delete_verification_documents"

ON storage.objects

FOR DELETE

TO authenticated

USING (

    bucket_id = 'seller-verification-documents'

    AND
    (storage.foldername(name))[1] = auth.uid()::text

);


-- =========================================================
-- 13. STORAGE UPDATE POLICY
-- =========================================================

DROP POLICY IF EXISTS
"sellers_update_verification_documents"
ON storage.objects;

CREATE POLICY
"sellers_update_verification_documents"

ON storage.objects

FOR UPDATE

TO authenticated

USING (

    bucket_id = 'seller-verification-documents'

    AND
    (storage.foldername(name))[1] = auth.uid()::text

)

WITH CHECK (

    bucket_id = 'seller-verification-documents'

    AND
    (storage.foldername(name))[1] = auth.uid()::text

);


-- =========================================================
-- 14. CHECK TABLE
-- =========================================================

SELECT
    id,
    seller_id,
    attempt_number,
    status,
    primary_document_path,
    secondary_document_path,
    rejection_reason,
    reviewed_at,
    reviewed_by,
    created_at,
    updated_at

FROM public.seller_verifications

ORDER BY created_at DESC;


-- =========================================================
-- 15. CHECK STORAGE BUCKET
-- =========================================================

SELECT
    id,
    name,
    public

FROM storage.buckets

WHERE id = 'seller-verification-documents';

create policy "admins_can_view_all_seller_verifications"
on public.seller_verifications
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