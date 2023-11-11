import Link from 'next/link';

export default function Login() {
  return (
    <Link href="/api/auth/login">
      <button className="btn btn-neutral">Log in</button>
    </Link>
  );
}
