import Link from 'next/link'

export const Login = () => (
  <Link href="/api/auth/login">
    <button className="btn btn-neutral">Log in</button>
  </Link>
)
