import { AxiosError, HttpStatusCode } from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import ROUTES from "../constants/routes";
import { BriefProfile } from "../types/BriefProfile";

async function getBriefProfile(): Promise<BriefProfile> {
  return (await axiosInstance.get("/auth/profile")).data;
}

export type UseProfileOption = Parameters<typeof useQuery<BriefProfile>>[2];

const useProfile = (
  option = {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  } as UseProfileOption
) => {
  const { data, ...useQueryResult } = useQuery<BriefProfile>(
    "profile",
    getBriefProfile,
    option
  );
  const navigate = useNavigate();

  if (
    useQueryResult.error instanceof AxiosError &&
    useQueryResult.error.response?.status === HttpStatusCode.Unauthorized
  ) {
    navigate({ pathname: ROUTES.LOGIN }, { replace: true });
  }

  return { data: data!, ...useQueryResult };
};

export default useProfile;
