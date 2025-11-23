import { Button } from '@/components/ui/button'

export default function Login() {
  return (
    <Button asChild className="bg-rose-500 hover:bg-rose-600 text-white">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/auth/login">Log in</a>
    </Button>
  )
}
