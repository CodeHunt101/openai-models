import { faComments, faFileAudio } from '@fortawesome/free-solid-svg-icons'
import { faImages as regularFaImages } from '@fortawesome/free-solid-svg-icons'
import { MenuElement } from './MenuElement'

const NavBarModels = () => {
  return (
    <nav className="flex flex-wrap justify-center gap-2 p-2 rounded-lg">
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
    </nav>
  )
}

export default NavBarModels
