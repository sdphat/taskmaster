import { ReactNode, createContext, useContext } from "react";
import { BoardRole } from "../types/Board";

export interface RoleContextData {
  role?: BoardRole;
}

const RoleContext = createContext<RoleContextData>({});

const useRoleContext = () => useContext(RoleContext);

export const RoleProvider = ({
  children,
  role,
}: {
  children?: ReactNode;
  role?: BoardRole;
}) => {
  return (
    <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>
  );
};

export default useRoleContext;
