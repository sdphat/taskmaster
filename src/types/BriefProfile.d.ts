import { User } from "./Board";

export interface BriefProfile extends Omit<User, "id"> {}
