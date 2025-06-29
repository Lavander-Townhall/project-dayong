export interface Participant {
  id: string
  number: number
  full_name: string
  is_paid: boolean
  notes: string
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}