'use client'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'

export default function LoginPage() {
  return (
    <SessionProvider>
      <div className="min-h-screen flex justify-center items-start md:items-center p-8">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              This demo uses GitHub for authentication.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => signIn('github', { callbackUrl: '/' })}
            >
              Sign in with GitHub
            </Button>
          </CardFooter>
        </Card>
      </div>
    </SessionProvider>
  )
}
