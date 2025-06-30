-- Simple fix for alphabetical ordering
-- This will renumber participants based on alphabetical order of their names

-- Show current state
SELECT 'BEFORE FIX:' as status;
SELECT number, full_name FROM participants ORDER BY number;

-- Fix the numbering to be alphabetical
WITH ordered AS (
  SELECT 
    id, 
    full_name,
    ROW_NUMBER() OVER (ORDER BY full_name COLLATE "C") AS new_number
  FROM participants
)
UPDATE participants
SET number = ordered.new_number
FROM ordered
WHERE participants.id = ordered.id;

-- Show the result
SELECT 'AFTER FIX:' as status;
SELECT number, full_name FROM participants ORDER BY number;

-- Verify alphabetical order
SELECT 'VERIFICATION - Should be in alphabetical order:' as status;
SELECT 
  number,
  full_name,
  CASE 
    WHEN full_name = LAG(full_name) OVER (ORDER BY full_name COLLATE "C") 
    THEN 'DUPLICATE'
    WHEN full_name < LAG(full_name) OVER (ORDER BY full_name COLLATE "C") 
    THEN 'NOT ALPHABETICAL'
    ELSE 'OK'
  END as check_result
FROM participants 
ORDER BY full_name COLLATE "C"; 