import { Link } from "react-router-dom";
import tw from "tailwind-styled-components";

const AccountDropdownItem = tw(Link)`
    block    
    p-2
    w-full
    hover:bg-gray-200
`;

export default AccountDropdownItem;
