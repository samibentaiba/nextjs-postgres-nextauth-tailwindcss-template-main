
'use client'

import dynamic from 'next/dynamic';
const LoginPage = dynamic(() => import('@/components/login'), {
  ssr: false,
});
export default function ClientLoginPage() {
  return (
   <LoginPage />
  )
}
