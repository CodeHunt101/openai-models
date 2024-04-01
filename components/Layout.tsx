import type { ReactNode } from 'react'
import SwitchTheme from './SwitchTheme'
import { faComments, faFileAudio } from '@fortawesome/free-solid-svg-icons'
import { faImages as regularFaImages } from '@fortawesome/free-solid-svg-icons'
import Logout from '@/pages/logout'
import { useUser } from '@auth0/nextjs-auth0/client'
import Login from '@/pages/login'
import Image from 'next/image'
import { MenuElement } from './MenuElement'
import { Loading } from './Loading'
import Link from 'next/link'

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  const { user, error, isLoading } = useUser()
  
  return (
    <>
      <main>
        <aside className="relative overflow-hidden rounded-lg sm:mx-16 mx-2">
          <div className="relative z-10 max-w-screen-xl px-4  pb-20 pt-10 sm:py-12 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-xl space-y-8 text-center sm:text-right sm:ml-auto">
              <SwitchTheme />
              <h2 className="text-4xl font-bold sm:text-5xl">
                OpenAI Models
                <span className="hidden sm:block text-xl">
                  By Harold Torres
                </span>
              </h2>
              {isLoading && <Loading />}
              {!user ? <Login /> : <Logout />}
              {error && <div>{error.message}</div>}
            </div>
          </div>

          {!user && <div className="flex flex-row justify-center">
            <Image
              className="sm:w-96 w-48 rounded-lg"
              src="https://live.staticflickr.com/65535/53624799773_f4efa1ec2e_o.png"
              height={1200}
              width={1200}
              alt="logo"
            />
          </div>}
        </aside>

        {!user && <p className="text-center text-xl sm:text-2xl py-10 font-medium">
              If you require access, email me at{' '}
              <b>
                <a href="mailto:haroldtm55@gmail.com" target="_blank">
                  haroldtm55@gmail.com
                </a>
              </b>
            </p>}
            {user && (
          <>
            <ul className="menu bg-base-100 p-2 rounded-box flex flex-row justify-center">
              <MenuElement icon={faComments} route="/chat" title="Chats" />
              <MenuElement
                icon={regularFaImages}
                route="/images"
                title="Image Generation"
              />
              <MenuElement
                icon={faFileAudio}
                route="/audios"
                title="Voice Transcription"
              />
              {/* <MenuElement icon={faFileAudio} route="/ace-assistant" title="ACE Assistant" /> */}
              <MenuElement
                icon={faFileAudio}
                route="/ace-assistant-image"
                title="ACE Assistant Image"
              />
            </ul>
            <div className="m-auto">{children}</div>
          </>
        )}
        <footer className="text-center">
          <hr />
          <p className="text-center py-5">
            Crafted with ❤️ by{' '}
            <span className="font-black">
              <Link
                href="https://www.linkedin.com/in/harold-torres-marino/"
                target="_blank"
              >
                Harold Torres
              </Link>
            </span>
          </p>
        </footer>
      </main>
    </>
  )
}
