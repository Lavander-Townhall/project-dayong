import React from 'react'
import { Users, CheckCircle, Clock, Percent } from 'lucide-react'

interface StatsCardProps {
  total: number
  paid: number
  unpaid: number
}

export function StatsCard({ total, paid, unpaid }: StatsCardProps) {
  const paidPercentage = total > 0 ? Math.round((paid / total) * 100) : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{paid}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{unpaid}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
            <Percent className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{paidPercentage}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>
    </div>
  )
}