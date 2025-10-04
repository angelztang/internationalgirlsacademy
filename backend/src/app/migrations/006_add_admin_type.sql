-- If you're using an ENUM type (user_role), add 'admin' if missing
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'users'
      AND column_name  = 'user_type'
      AND udt_name     = 'user_role'
  ) THEN
    -- Add enum value if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = 'user_role' AND e.enumlabel = 'admin'
    ) THEN
      ALTER TYPE user_role ADD VALUE 'admin';
    END IF;
  ELSE
    -- Otherwise it's a VARCHAR with a CHECK constraint: widen it
    BEGIN
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check;
    EXCEPTION WHEN undefined_object THEN NULL;
    END;

    ALTER TABLE users
      ADD CONSTRAINT users_user_type_check
      CHECK (lower(btrim(user_type)) IN ('student','volunteer','organizer','admin'));
  END IF;
END$$;
