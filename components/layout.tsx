import type { ReactNode } from 'react'
import SwitchTheme from './SwitchTheme'
import { faComments, faFileAudio } from '@fortawesome/free-solid-svg-icons'
import { faImages as regularFaImages } from '@fortawesome/free-solid-svg-icons'
import Logout from '@/pages/logout'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Login } from '@/pages/login'
import Image from 'next/image'
import logo from '../Images/OpenAI_Logo.svg'
import { MenuElement } from './MenuElement'

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  const { user, error, isLoading } = useUser()
  return (
    <>
      <main className="p-10 w-fit m-auto">
        <SwitchTheme />
        <div className="flex flex-row gap-4 my-7 justify-around">
          <h1>
            By <b>Harold Torres</b>
          </h1>
          {isLoading && (
            <span className="loading loading-dots loading-lg"></span>
          )}
          {!user ? <Login /> : <Logout />}
          {error && <div>{error.message}</div>}
        </div>
        {!user && (
          <>
            <Image
              src={logo}
              alt="logo"
              width={512}
              height={512}
              className="my-4 bg-[#faf7f8] rounded-lg"
            />
            <h1>
              If you require access, email me at{' '}
              <b>
                <a href="mailto:recipient@example.com">haroldtm55@gmail.com</a>
              </b>
            </h1>
          </>
        )}

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
      </main>
    </>
  )
}
