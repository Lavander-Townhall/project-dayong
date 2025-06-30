import React, { useState } from 'react'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useKeyboardAvoidance } from '../hooks/useKeyboardAvoidance'

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<{ error: any }>
  onGoBack: () => void
}

export function AdminLogin({ onLogin, onGoBack }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const containerRef = useKeyboardAvoidance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await onLogin(email, password)
    
    if (result.error) {
      setError(result.error.message || 'Login failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div ref={containerRef} className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Go Back</span>
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to manage the dayong list</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg
                focus:border-blue-500 focus:ring-0 focus:outline-none
                transition-colors duration-200
              "
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full px-4 py-3 pr-12 text-lg border-2 border-gray-200 rounded-lg
                  focus:border-blue-500 focus:ring-0 focus:outline-none
                  transition-colors duration-200
                "
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full px-4 py-3 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 transition-colors font-medium text-lg
              disabled:opacity-50 flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need an admin account? Contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}