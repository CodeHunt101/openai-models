import { Button } from '@/components/ui/button'

export default function Logout() {
  return (
    <Button asChild variant="destructive">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/auth/logout">Log out</a>
    </Button>
  )
}
