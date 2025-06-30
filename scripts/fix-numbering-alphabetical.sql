-- Fix numbering to maintain alphabetical order by full_name
-- This script will renumber participants based on alphabetical order of their names

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

-- Verify the results
SELECT 
  number,
  full_name,
  is_paid,
  created_at
FROM participants 
ORDER BY number;

-- Optional: Show the alphabetical order
SELECT 
  ROW_NUMBER() OVER (ORDER BY full_name COLLATE "C") as alphabetical_rank,
  full_name,
  number as current_number
FROM participants 
ORDER BY full_name COLLATE "C"; 