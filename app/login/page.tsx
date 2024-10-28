'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setLoading(true)
  
      const formData = new FormData(e.currentTarget)
  
      try {
        const result = await signIn('credentials', {
          username: formData.get('username'),
          password: formData.get('password'),
          redirect: false,
          callbackUrl: '/dashboard'
        })
  
        if (result?.error) {
          toast({
            title: "Login Failed",
            description: "Invalid username or password",
            variant: "destructive",
          });
          return;
        }

        if (result?.ok) {
          toast({
            title: "Success",
            description: "Logged in successfully",
          });
          router.push('/dashboard');
          router.refresh();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false)
      }
    }
  
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
                />
              </div>
              <div className="space-y-2">
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
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
    )
}