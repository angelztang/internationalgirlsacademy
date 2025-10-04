-- =========================================
-- 1) Junction table: users ↔ modules
--    (per-user enrollment/progress lives here)
-- =========================================
CREATE TABLE IF NOT EXISTS user_modules (
    user_id    INT NOT NULL,
    module_id  INT NOT NULL,
    progress   NUMERIC DEFAULT 0,         -- per-user progress
    enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_user_modules PRIMARY KEY (user_id, module_id),
    CONSTRAINT fk_user_modules_user
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_modules_module
        FOREIGN KEY (module_id) REFERENCES modules (module_id) ON DELETE CASCADE,
    CONSTRAINT ck_user_modules_progress CHECK (progress >= 0)
);

-- Helpful reverse-lookup index
CREATE INDEX IF NOT EXISTS idx_user_modules_module_id ON user_modules (module_id);

-- =========================================
-- 2) Backfill from old one-to-many
--    modules.user_id + modules.module_progress → user_modules
-- =========================================
INSERT INTO user_modules (user_id, module_id, progress, enrolled_at)
SELECT m.user_id, m.module_id, COALESCE(m.module_progress, 0), NOW()
FROM modules m
WHERE m.user_id IS NOT NULL
ON CONFLICT (user_id, module_id) DO NOTHING;

-- =========================================
-- 3A) Cleanup OPTION A (recommended):
--     Drop old ownership + global progress on modules
-- =========================================
ALTER TABLE modules
  DROP CONSTRAINT IF EXISTS fk_module_user;

ALTER TABLE modules
  DROP COLUMN IF EXISTS user_id;

ALTER TABLE modules
  DROP COLUMN IF EXISTS module_progress;

-- =========================================
-- 3B) Cleanup OPTION B (keep authorship):
--     Keep who originally created the module, but move progress off modules
--     (Comment out 3A above if you choose this.)
-- =========================================
-- ALTER TABLE modules
--   DROP CONSTRAINT IF EXISTS fk_module_user;
-- ALTER TABLE modules
--   RENAME COLUMN user_id TO creator_user_id;
-- ALTER TABLE modules
--   ADD CONSTRAINT fk_module_creator
--   FOREIGN KEY (creator_user_id) REFERENCES users (user_id) ON DELETE SET NULL;
-- ALTER TABLE modules
--   DROP COLUMN IF EXISTS module_progress;
