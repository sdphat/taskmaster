import { Member } from "./Board";

export interface BriefProfile extends Omit<Member, "id"> {
  
}
