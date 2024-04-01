import Link from 'next/link'

export default function Login() {
  return (
    <Link
      href="/api/auth/login"
      className="inline-flex text-white items-center px-6 py-3 font-medium bg-rose-500 rounded-lg hover:opacity-75"
    >
      Log in
    </Link>
  )
}
