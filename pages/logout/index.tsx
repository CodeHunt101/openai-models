import Link from 'next/link'

export default function Logout() {
  return (
    <Link href="/api/auth/logout">
      <button className="btn btn-neutral">Log out</button>
    </Link>
  )
}
