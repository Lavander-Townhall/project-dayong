import React from 'react'
import { Check, X, Edit2, Trash2 } from 'lucide-react'
import { Participant } from '../types/participant'

interface ParticipantCardProps {
  participant: Participant
  isAdmin: boolean
  onTogglePaid: (id: string, isPaid: boolean) => void
  onEdit: (participant: Participant) => void
  onDelete: (id: string) => void
}

export function ParticipantCard({ 
  participant, 
  isAdmin, 
  onTogglePaid, 
  onEdit, 
  onDelete 
}: ParticipantCardProps) {
  return (
    <div className={`
      bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-200
      ${participant.is_paid 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 hover:border-gray-300'
      }
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 truncate">
            <span className="text-blue-600 font-bold mr-2">{participant.number}.</span>
            {participant.full_name}
          </h3>
          {participant.notes && (
            <p className="text-base text-gray-600 mt-1 line-clamp-2">
              {participant.notes}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3 ml-4">
          {/* Payment Status */}
          <div className={`
            flex items-center justify-center w-12 h-12 rounded-full transition-colors
            ${participant.is_paid 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-500'
            }
          `}>
            {participant.is_paid ? (
              <Check className="w-6 h-6" />
            ) : (
              <X className="w-6 h-6" />
            )}
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => onTogglePaid(participant.id, !participant.is_paid)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-colors
                  ${participant.is_paid
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }
                `}
              >
                {participant.is_paid ? 'Mark Unpaid' : 'Mark Paid'}
              </button>
              
              <button
                onClick={() => onEdit(participant)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onDelete(participant.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}