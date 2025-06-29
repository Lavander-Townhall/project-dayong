import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Participant } from '../types/participant'

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchParticipants = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('number', { ascending: true })

      if (error) throw error
      setParticipants(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addParticipant = async (name: string, notes: string = '', number?: number) => {
    try {
      // If no number provided, get the next available number
      let participantNumber = number
      if (!participantNumber) {
        const { data: maxData } = await supabase
          .from('participants')
          .select('number')
          .order('number', { ascending: false })
          .limit(1)
        
        participantNumber = maxData && maxData.length > 0 ? maxData[0].number + 1 : 1
      }

      const { data, error } = await supabase
        .from('participants')
        .insert([{ full_name: name, notes, number: participantNumber }])
        .select()
        .single()

      if (error) throw error
      setParticipants(prev => [...prev, data].sort((a, b) => a.number - b.number))
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add participant' }
    }
  }

  const updateParticipant = async (id: string, updates: Partial<Participant>) => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setParticipants(prev => 
        prev.map(p => p.id === id ? data : p).sort((a, b) => a.number - b.number)
      )
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update participant' }
    }
  }

  const deleteParticipant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id)

      if (error) throw error
      setParticipants(prev => prev.filter(p => p.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete participant' }
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  return {
    participants,
    loading,
    error,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    refetch: fetchParticipants
  }
}