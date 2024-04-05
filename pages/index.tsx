import { useUser } from "@auth0/nextjs-auth0/client"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()
  const { user } = useUser()

  if (user) {
    router.push('/chat')
  }
}