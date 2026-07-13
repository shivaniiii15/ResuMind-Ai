-- Move the SECURITY DEFINER has_role() helper out of the API-exposed public schema
-- into a private schema so signed-in users cannot call it via the Data API,
-- while RLS policies continue to use it.

CREATE SCHEMA IF NOT EXISTS private;

-- Drop policies that depend on public.has_role so the function can be dropped
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins view all transactions" ON public.transactions;

-- Remove the function from the exposed schema
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- Recreate the helper inside the private (non-exposed) schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Allow the function to be used within RLS policy evaluation for signed-in users,
-- but only via the private schema which is not exposed through the API.
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate the policies referencing the relocated function
CREATE POLICY "Users view own profile"
ON public.profiles
FOR SELECT
USING ((auth.uid() = id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users view own roles"
ON public.user_roles
FOR SELECT
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins view all transactions"
ON public.transactions
FOR SELECT
USING (private.has_role(auth.uid(), 'admin'::public.app_role));