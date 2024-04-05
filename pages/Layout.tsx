import type { ReactNode } from 'react'
import SwitchTheme from '../components/SwitchTheme'
import Logout from '@/pages/logout'
import { useUser } from '@auth0/nextjs-auth0/client'
import Login from '@/pages/login'
import Image from 'next/image'
import { Loading } from '../components/Loading'
import NavBarModels from '../components/NavBarModels'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  const { user, error, isLoading } = useUser()

  return (
    <main>
      <div className="relative overflow-hidden rounded-lg sm:mx-16 mx-2">
        <div className="relative z-10 max-w-screen-xl px-4  pb-20 pt-10 sm:py-12 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-xl space-y-8 text-center sm:text-right sm:ml-auto">
            <SwitchTheme />
            <Header />
            {isLoading && <Loading />}
            {!user ? <Login /> : <Logout />}
            {error && <div>{error.message}</div>}
          </div>
        </div>
        {!user && (
          <div className="flex flex-row justify-center">
            <Image
              className="sm:w-96 w-48 rounded-lg"
              src="https://live.staticflickr.com/65535/53624799773_f4efa1ec2e_o.png"
              height={1200}
              width={1200}
              alt="logo"
            />
          </div>
        )}
      </div>
      {!user && (
        <p className="text-center text-xl sm:text-2xl py-10 font-medium">
          If you require access, email me at{' '}
          <b>
            <a href="mailto:haroldtm55@gmail.com" target="_blank">
              haroldtm55@gmail.com
            </a>
          </b>
        </p>
      )}
      {user && (
        <>
          <NavBarModels />
          <div className="m-auto">{children}</div>
        </>
      )}
      <Footer />
    </main>
  )
}
