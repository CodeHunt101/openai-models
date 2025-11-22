import Link from 'next/link'

export default function Logout() {
  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/auth/logout"
      className="inline-flex text-white items-center px-6 py-3 font-medium bg-rose-500 rounded-lg hover:opacity-75"
    >
      Log out
    </a>
  )
}
