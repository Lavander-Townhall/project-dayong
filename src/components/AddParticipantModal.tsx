import React, { useState, useEffect } from 'react'
import { X, Plus, Save } from 'lucide-react'
import { Participant } from '../types/participant'

interface AddParticipantModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, notes: string, number?: number) => Promise<{ success: boolean; error?: string }>
  editingParticipant?: Participant | null
}

export function AddParticipantModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingParticipant 
}: AddParticipantModalProps) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [number, setNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingParticipant) {
      setName(editingParticipant.full_name)
      setNotes(editingParticipant.notes || '')
      setNumber(editingParticipant.number.toString())
    } else {
      setName('')
      setNotes('')
      setNumber('')
    }
    setError('')
  }, [editingParticipant, isOpen])

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    // Validate number if provided
    const participantNumber = number.trim() ? parseInt(number.trim()) : undefined
    if (number.trim() && (isNaN(participantNumber!) || participantNumber! < 1)) {
      setError('Number must be a positive integer')
      return
    }

    setSaving(true)
    setError('')

    const result = await onSave(name.trim(), notes.trim(), participantNumber)
    
    if (result.success) {
      onClose()
      setName('')
      setNotes('')
      setNumber('')
    } else {
      setError(result.error || 'Failed to save participant')
    }
    
    setSaving(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingParticipant ? 'Edit Participant' : 'Add New Participant'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
              Number {!editingParticipant && '(Optional - will auto-assign if empty)'}
            </label>
            <input
              id="number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={editingParticipant ? "Enter number" : "Auto-assigned if empty"}
              min="1"
              className="
                w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg
                focus:border-blue-500 focus:ring-0 focus:outline-none
                transition-colors duration-200
              "
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="
                w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg
                focus:border-blue-500 focus:ring-0 focus:outline-none
                transition-colors duration-200
              "
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or reminders"
              rows={3}
              className="
                w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg
                focus:border-blue-500 focus:ring-0 focus:outline-none
                transition-colors duration-200 resize-none
              "
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {editingParticipant ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingParticipant ? 'Save Changes' : 'Add Participant'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}