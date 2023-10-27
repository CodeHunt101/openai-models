import type { ReactNode } from 'react';
import SwitchTheme from './switchTheme';
import Link from 'next/link'
import {
  faComments,
  faPenClip,
  faFileAudio,
} from '@fortawesome/free-solid-svg-icons'
import { faImages } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <main className='p-10'>
        <SwitchTheme />
        <ul className="menu bg-base-100 w-56 p-2 rounded-box">
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
          <FontAwesomeIcon icon={faImages} />
          Images
        </Link>
      </li>
      <li>
        <Link href={'/audios'}>
          <FontAwesomeIcon icon={faFileAudio} />
          Audios
        </Link>
      </li>
    </ul>
        {children}
      </main>
    </>
  );
}
