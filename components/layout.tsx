import type { ReactNode } from 'react'
import SwitchTheme from './switchTheme'
import Link from 'next/link'
import {
  faComments,
  faPenClip,
  faFileAudio,
} from '@fortawesome/free-solid-svg-icons'
import { faImages as regularFaImages } from '@fortawesome/free-solid-svg-icons'
import { faImages as solidFaImages } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Logout from '@/pages/logout'
import { useUser } from '@auth0/nextjs-auth0/client'
import Login from '@/pages/login'

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

        {user && (
          <>
            <ul className="menu bg-base-100 p-2 rounded-box flex flex-row justify-center">
              <li>
                <Link href={'/chat'}>
                  <FontAwesomeIcon icon={faComments} />
                  Chats
                </Link>
              </li>
              <li>
                <Link href={'/images'}>
                  <FontAwesomeIcon icon={regularFaImages} />
                  Image Generation
                </Link>
              </li>
              <li>
                <Link href={'/visual-analysis'}>
                  <FontAwesomeIcon icon={solidFaImages} />
                  Image Analysis
                </Link>
              </li>
              <li>
                <Link href={'/audios'}>
                  <FontAwesomeIcon icon={faFileAudio} />
                  Voice Transcription
                </Link>
              </li>
              {/* <li>
                <Link href={'/ace-assistant'}>
                  <FontAwesomeIcon icon={faFileAudio} />
                  ACE Assistant
                </Link>
              </li> */}
              <li>
                <Link href={'/ace-assistant-image'}>
                  <FontAwesomeIcon icon={faFileAudio} />
                  ACE Assistant Image
                </Link>
              </li>
            </ul>
            <div className="m-auto">{children}</div>
          </>
        )}
      </main>
    </>
  )
}
