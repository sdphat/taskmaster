import { useSelector } from "react-redux";
import { RootState } from "../store";
import { boardSelector } from "../slices/BoardSlice";

export const useBoard = () =>
  useSelector<RootState, ReturnType<typeof boardSelector>>(boardSelector);
