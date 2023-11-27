import { NavLink as RouterNavLink } from "react-router-dom";
import tw from "tailwind-styled-components";

const NavLink = tw(RouterNavLink)`
    flex 
    gap-2
    hover:text-blue-700
    transition-color
    duration-150
`;

export default NavLink;
