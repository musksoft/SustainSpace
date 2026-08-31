-- ============================================================
-- 1. ADD SELLER ACTIVE STATUS TO PROFILES
-- ============================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;


-- ============================================================
-- 2. MAKE EXISTING SELLERS ACTIVE
-- ============================================================

UPDATE public.profiles
SET active = true
WHERE role = 'seller';


-- ============================================================
-- 3. ALLOW ADMINS TO VIEW ALL PROFILES
-- ============================================================

DROP POLICY IF EXISTS "Admins can view all profiles"
ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.admins a
        WHERE a.user_id = auth.uid()
        AND a.active = true
    )
);


-- ============================================================
-- 4. ALLOW ADMINS TO ACTIVATE / DEACTIVATE PROFILES
-- ============================================================

DROP POLICY IF EXISTS "Admins can update seller profiles"
ON public.profiles;

CREATE POLICY "Admins can update seller profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.admins a
        WHERE a.user_id = auth.uid()
        AND a.active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.admins a
        WHERE a.user_id = auth.uid()
        AND a.active = true
    )
);



-- ============================================================
-- 6. GRANT REQUIRED PERMISSIONS
-- ============================================================

GRANT SELECT, UPDATE
ON public.profiles
TO authenticated;
