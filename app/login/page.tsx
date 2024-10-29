'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Handle initial redirect based on session
    if (status === 'authenticated' && session?.user?.role) {
      switch (session.user.role) {
        case 'ADMIN':
          router.push('/dashboard')
          break
        case 'CASHIER':
          router.push('/cashier')
          break
        default:
          router.push('/')
      }
    } else if (status !== 'loading') {
      // Only show login form when we're sure there's no session
      setIsInitializing(false)
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      const result = await signIn('credentials', {
        username: formData.get('username'),
        password: formData.get('password'),
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        return
      }

      // Successful login will trigger the useEffect above
    } catch (error) {
      console.error('Login error:', error);  // Log the error for debugging
      setError('Something went wrong');
    } finally {
      setLoading(false)
    }
  }

  // Show loading state when checking session or redirecting
  if (isInitializing || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Only show login form when not authenticated
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="username"
                placeholder="Username"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                required
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}