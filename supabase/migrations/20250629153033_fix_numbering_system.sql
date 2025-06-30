/*
  # Fix Numbering System for Alphabetical Order
  
  This migration fixes the numbering system to maintain alphabetical order:
  1. Renumbers all existing participants by alphabetical order of full_name
  2. Creates a function to automatically maintain numbering on insert/update
  3. Updates triggers to use the new numbering system
*/

-- First, fix the existing numbering to be alphabetical
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

-- Create a function to get the next available number
CREATE OR REPLACE FUNCTION get_next_participant_number()
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT MAX(number) FROM participants), 
    0
  ) + 1;
END;
$$ LANGUAGE plpgsql;

-- Create a function to reorder numbers after insert/update/delete
CREATE OR REPLACE FUNCTION reorder_participant_numbers()
RETURNS TRIGGER AS $$
BEGIN
  -- Renumber all participants in alphabetical order
  WITH ordered AS (
    SELECT 
      id, 
      ROW_NUMBER() OVER (ORDER BY full_name COLLATE "C") AS new_number
    FROM participants
  )
  UPDATE participants
  SET number = ordered.new_number
  FROM ordered
  WHERE participants.id = ordered.id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to maintain alphabetical numbering
DROP TRIGGER IF EXISTS maintain_alphabetical_numbering ON participants;

CREATE TRIGGER maintain_alphabetical_numbering
  AFTER INSERT OR UPDATE OF full_name OR DELETE
  ON participants
  FOR EACH ROW
  EXECUTE FUNCTION reorder_participant_numbers();

-- Update the set_created_by function to also set the number
CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  NEW.updated_by = auth.uid();
  
  -- Set number to the next available number (will be reordered by trigger)
  IF NEW.number IS NULL THEN
    NEW.number = get_next_participant_number();
  END IF;
  
  RETURN NEW;
END;
$$ language plpgsql;

-- Add comments
COMMENT ON FUNCTION get_next_participant_number() IS 'Returns the next available participant number';
COMMENT ON FUNCTION reorder_participant_numbers() IS 'Reorders participant numbers to maintain alphabetical order';
COMMENT ON TRIGGER maintain_alphabetical_numbering ON participants IS 'Maintains alphabetical numbering when participants are inserted, updated, or deleted'; 