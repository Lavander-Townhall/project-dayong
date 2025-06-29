import React, { useState } from 'react'
import { Check, X, Edit2, Trash2, MoreVertical } from 'lucide-react'
import { Participant } from '../types/participant'

interface ParticipantCardMobileProps {
  participant: Participant
  isAdmin: boolean
  onTogglePaid: (id: string, isPaid: boolean) => void
  onEdit: (participant: Participant) => void
  onDelete: (id: string) => void
}

export function ParticipantCardMobile({ 
  participant, 
  isAdmin, 
  onTogglePaid, 
  onEdit, 
  onDelete 
}: ParticipantCardMobileProps) {
  const [showActions, setShowActions] = useState(false)

  const handleTogglePaid = () => {
    onTogglePaid(participant.id, !participant.is_paid)
    setShowActions(false)
  }

  const handleEdit = () => {
    onEdit(participant)
    setShowActions(false)
  }

  const handleDelete = () => {
    onDelete(participant.id)
    setShowActions(false)
  }

  return (
    <>
      <div className={`
        bg-white rounded-lg shadow-sm border p-4 transition-all duration-200
        ${participant.is_paid 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200'
        }
      `}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${participant.is_paid 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {participant.number}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {participant.full_name}
                </h3>
                {participant.notes && (
                  <p className="text-sm text-gray-600 truncate">
                    {participant.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            {/* Payment Status Indicator */}
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full
              ${participant.is_paid 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {participant.is_paid ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </div>

            {/* Admin Actions Menu */}
            {isAdmin && (
              <button
                onClick={() => setShowActions(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="More actions"
                aria-label="Open actions menu"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Actions Modal */}
      {showActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-xl w-full max-w-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {participant.full_name}
              </h3>
              <p className="text-sm text-gray-600">
                {participant.is_paid ? 'Currently Paid' : 'Currently Unpaid'}
              </p>
            </div>
            
            <div className="p-4 space-y-3">
              <button
                onClick={handleTogglePaid}
                className={`
                  w-full flex items-center justify-center gap-3 p-4 rounded-lg font-medium transition-colors
                  ${participant.is_paid
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }
                `}
              >
                {participant.is_paid ? (
                  <>
                    <X className="w-5 h-5" />
                    Mark as Unpaid
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Mark as Paid
                  </>
                )}
              </button>
              
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center gap-3 p-4 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors"
              >
                <Edit2 className="w-5 h-5" />
                Edit Participant
              </button>
              
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete Participant
              </button>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowActions(false)}
                className="w-full p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 