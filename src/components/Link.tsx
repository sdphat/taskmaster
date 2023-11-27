import { Link as RouterLink } from 'react-router-dom'
import tw from 'tailwind-styled-components'

const Link = tw(RouterLink)`
    text-sm
    text-blue-500
    hover:underline
`

export default Link