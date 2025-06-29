import React from 'react'
import { ParticipantCard } from './ParticipantCard'
import { ParticipantCardMobile } from './ParticipantCardMobile'
import { Participant } from '../types/participant'

interface ParticipantCardResponsiveProps {
  participant: Participant
  isAdmin: boolean
  onTogglePaid: (id: string, isPaid: boolean) => void
  onEdit: (participant: Participant) => void
  onDelete: (id: string) => void
}

export function ParticipantCardResponsive(props: ParticipantCardResponsiveProps) {
  return (
    <>
      {/* Desktop version - hidden on mobile */}
      <div className="hidden md:block">
        <ParticipantCard {...props} />
      </div>
      
      {/* Mobile version - hidden on desktop */}
      <div className="md:hidden">
        <ParticipantCardMobile {...props} />
      </div>
    </>
  )
} 