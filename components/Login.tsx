export default function Login() {
  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/auth/login"
      className="inline-flex text-white items-center px-6 py-3 font-medium bg-rose-500 rounded-lg hover:opacity-75"
    >
      Log in
    </a>
  )
}
