import { faComments, faFileAudio } from '@fortawesome/free-solid-svg-icons'
import { faImages as regularFaImages } from '@fortawesome/free-solid-svg-icons'
import { MenuElement } from './MenuElement'

const NavBarModels = () => {
  return (
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
  )
}

export default NavBarModels
