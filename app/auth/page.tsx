import { AuthForm } from '@/components/AuthForm'

export default function AuthPage() {
  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">麻雀ソーシャルへようこそ</h1>
      <AuthForm />
    </div>
  )
}