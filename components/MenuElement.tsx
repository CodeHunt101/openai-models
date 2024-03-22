import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export const MenuElement = ({
  icon,
  route,
  title,
}: {
  icon: IconDefinition
  route: string
  title: string
}) => (
  <li>
    <Link href={route}>
      <FontAwesomeIcon icon={icon} />
      {title}
    </Link>
  </li>
)
