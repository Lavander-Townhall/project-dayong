import React, { useState, useMemo } from 'react'
import { Plus, Settings, LogOut, Users, RefreshCw } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import { useParticipants } from './hooks/useParticipants'
import { ParticipantCard } from './components/ParticipantCard'
import { SearchBar } from './components/SearchBar'
import { StatsCard } from './components/StatsCard'
import { AddParticipantModal } from './components/AddParticipantModal'
import { AdminLogin } from './components/AdminLogin'
import { Participant } from './types/participant'

// Force new deployment - updated at ${new Date().toISOString()}

function App() {
  const { user, loading: authLoading, signIn, signOut, isAdmin } = useAuth()
  const { 
    participants, 
    loading: participantsLoading, 
    error,
    addParticipant, 
    updateParticipant, 
    deleteParticipant,
    refetch
  } = useParticipants()

  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  // Filter participants based on search query
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants
    
    const query = searchQuery.toLowerCase()
    return participants.filter(participant =>
      participant.full_name.toLowerCase().includes(query) ||
      participant.number.toString().includes(query) ||
      (participant.notes && participant.notes.toLowerCase().includes(query))
    )
  }, [participants, searchQuery])

  // Calculate stats
  const stats = useMemo(() => {
    const total = participants.length
    const paid = participants.filter(p => p.is_paid).length
    const unpaid = total - paid
    return { total, paid, unpaid }
  }, [participants])

  const handleTogglePaid = async (id: string, isPaid: boolean) => {
    await updateParticipant(id, { is_paid: isPaid })
  }

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant)
    setShowAddModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this participant?')) {
      await deleteParticipant(id)
    }
  }

  const handleSaveParticipant = async (name: string, notes: string, number?: number) => {
    if (editingParticipant) {
      const updates: Partial<Participant> = { 
        full_name: name, 
        notes 
      }
      if (number !== undefined) {
        updates.number = number
      }
      return await updateParticipant(editingParticipant.id, updates)
    } else {
      return await addParticipant(name, notes, number)
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingParticipant(null)
  }

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show admin login if trying to access admin features
  if (showAdminPanel && !isAdmin) {
    return <AdminLogin onLogin={signIn} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dayong List</h1>
                <p className="text-sm text-gray-600">Funeral Contribution Tracker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={refetch}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              {isAdmin ? (
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Admin Login"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Card */}
        <StatsCard {...stats} />

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, number, or notes..."
        />

        {/* Admin Add Button */}
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="
              w-full flex items-center justify-center gap-3 p-4
              bg-blue-600 text-white rounded-xl hover:bg-blue-700
              transition-colors font-medium text-lg
            "
          >
            <Plus className="w-6 h-6" />
            Add New Participant
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Participants List */}
        {participantsLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading participants...</p>
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery ? 'No participants found' : 'No participants yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : isAdmin 
                  ? 'Add the first participant to get started'
                  : 'Participants will appear here once added by an admin'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredParticipants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                isAdmin={isAdmin}
                onTogglePaid={handleTogglePaid}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Results Summary */}
        {searchQuery && filteredParticipants.length > 0 && (
          <div className="text-center py-4">
            <p className="text-gray-600">
              Showing {filteredParticipants.length} of {participants.length} participants
            </p>
          </div>
        )}
      </main>

      {/* Add/Edit Participant Modal */}
      <AddParticipantModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={handleSaveParticipant}
        editingParticipant={editingParticipant}
      />
    </div>
  )
}

export default App