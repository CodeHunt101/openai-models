import Link from 'next/link'
import {
  faComments,
  faPenClip,
  faFileAudio,
} from '@fortawesome/free-solid-svg-icons'
import { faImages } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Home() {
  return (
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
  )
}
