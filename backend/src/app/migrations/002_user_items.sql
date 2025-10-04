-- =========================================
-- 1) Create association table users ↔ items
-- =========================================
CREATE TABLE IF NOT EXISTS user_items (
    user_id     INT NOT NULL,
    item_id     INT NOT NULL,
    quantity    INT NOT NULL DEFAULT 1,
    acquired_at TIMESTAMP NOT NULL DEFAULT NOW(),
    equipped    BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT pk_user_items PRIMARY KEY (user_id, item_id),
    CONSTRAINT fk_user_items_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_items_item FOREIGN KEY (item_id)
        REFERENCES items (item_id) ON DELETE CASCADE,
    CONSTRAINT ck_user_items_quantity_pos CHECK (quantity > 0)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_items_user_id ON user_items (user_id);
CREATE INDEX IF NOT EXISTS idx_user_items_item_id ON user_items (item_id);

-- =========================================
-- 2) Backfill existing ownership
--    (each item row currently has a single owner)
-- =========================================
INSERT INTO user_items (user_id, item_id, quantity, acquired_at, equipped)
SELECT i.user_id, i.item_id, 1, NOW(), FALSE
FROM items i
WHERE i.user_id IS NOT NULL
ON CONFLICT (user_id, item_id) DO NOTHING;

-- =========================================
-- 3A) Cleanup OPTION A: drop old FK/column
--    (ownership is ONLY via user_items now)
-- =========================================
ALTER TABLE items
  DROP CONSTRAINT IF EXISTS fk_item_user;

ALTER TABLE items
  DROP COLUMN IF EXISTS user_id;

-- =========================================
-- 3B) Cleanup OPTION B: keep authorship info
--    (rename user_id → creator_user_id)
--    Comment out 3A if you choose 3B.
-- =========================================
-- ALTER TABLE items
--   DROP CONSTRAINT IF EXISTS fk_item_user;
--
-- ALTER TABLE items
--   RENAME COLUMN user_id TO creator_user_id;
--
-- ALTER TABLE items
--   ADD CONSTRAINT fk_item_creator
--   FOREIGN KEY (creator_user_id)
--   REFERENCES users (user_id)
--   ON DELETE SET NULL;

-- =========================================
-- 4) (Optional) Data hygiene / guarantees
--    Ensure no orphaned rows slipped in
-- =========================================
DELETE FROM user_items ui
USING users u
WHERE ui.user_id = u.user_id IS NOT TRUE;

DELETE FROM user_items ui
USING items it
WHERE ui.item_id = it.item_id IS NOT TRUE;
