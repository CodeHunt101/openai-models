import type { ReactNode } from 'react';
import SwitchTheme from './switchTheme';
import Link from 'next/link';
import {
  faComments,
  faPenClip,
  faFileAudio,
} from '@fortawesome/free-solid-svg-icons';
import { faImages as regularFaImages } from '@fortawesome/free-solid-svg-icons';
import { faImages as solidFaImages } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logout from '@/pages/logout';
import { useUser } from '@auth0/nextjs-auth0/client';

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  const { user, error, isLoading } = useUser();
  return (
    <>
      <main className="p-10">
        <SwitchTheme />
        <h1 className="my-7">
          By <b>Harold Torres</b>
        </h1>
        {isLoading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!user ? (
          <Link href="/api/auth/login">Login</Link>
        ) : (
          <>
            <ul className="menu bg-base-100 p-2 rounded-box flex md:flex-nowrap flex-row justify-center">
              <li>
                <Link href={'/chat'}>
                  <FontAwesomeIcon icon={faComments} />
                  Chats
                </Link>
              </li>
              <li>
                <Link href={'/completions'}>
                  <FontAwesomeIcon icon={faPenClip} />
                  Completions
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
            </ul>
            <Logout />
            {children}
          </>
        )}
      </main>
    </>
  );
}
