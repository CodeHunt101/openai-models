import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'

export const MenuElement = ({
  icon,
  route,
  title,
}: {
  icon: IconDefinition
  route: string
  title: string
}) => (
  <Button variant="ghost" asChild className="flex gap-2">
    <Link href={route}>
      <FontAwesomeIcon icon={icon} />
      {title}
    </Link>
  </Button>
)
