/*
  # Dayong Funeral Contribution System

  1. New Tables
    - `participants`
      - `id` (uuid, primary key) - Unique identifier for each participant
      - `full_name` (text, required) - Full name of the contributor
      - `is_paid` (boolean, default false) - Payment status
      - `notes` (text, optional) - Additional notes or reminders
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `created_by` (uuid, foreign key) - Admin who created the record
      - `updated_by` (uuid, foreign key) - Admin who last updated the record

  2. Security
    - Enable RLS on `participants` table
    - Add policy for public read access (anonymous and authenticated users)
    - Add policy for authenticated admin users to insert, update, and delete
    - Add indexes for performance optimization

  3. Features
    - Automatic timestamp management with triggers
    - Foreign key references to auth.users for audit trail
    - Optimized for mobile viewing with proper indexing
    - Support for ~300 participants as specified
*/

-- Create the participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  is_paid boolean NOT NULL DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_participants_full_name ON participants(full_name);
CREATE INDEX IF NOT EXISTS idx_participants_is_paid ON participants(is_paid);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_participants_updated_at ON participants(updated_at DESC);

-- Create a composite index for common queries (unpaid participants)
CREATE INDEX IF NOT EXISTS idx_participants_unpaid_name ON participants(is_paid, full_name) WHERE is_paid = false;

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (both anonymous and authenticated users can view)
CREATE POLICY "Public can view all participants"
  ON participants
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert new participants
CREATE POLICY "Authenticated users can insert participants"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for authenticated users to update participants
CREATE POLICY "Authenticated users can update participants"
  ON participants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for authenticated users to delete participants
CREATE POLICY "Authenticated users can delete participants"
  ON participants
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create a function to set created_by on insert
CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers for automatic timestamp and user tracking
CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_participants_created_by
  BEFORE INSERT ON participants
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

-- Add helpful comments to the table and columns
COMMENT ON TABLE participants IS 'Tracks contributors and their payment status for funeral contributions (dayong)';
COMMENT ON COLUMN participants.id IS 'Unique identifier for each participant';
COMMENT ON COLUMN participants.full_name IS 'Full name of the contributor';
COMMENT ON COLUMN participants.is_paid IS 'Payment status - true if paid, false if pending';
COMMENT ON COLUMN participants.notes IS 'Optional notes for reminders or additional information';
COMMENT ON COLUMN participants.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN participants.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN participants.created_by IS 'Admin user who created this record';
COMMENT ON COLUMN participants.updated_by IS 'Admin user who last updated this record';