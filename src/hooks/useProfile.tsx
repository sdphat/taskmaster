import { useQuery } from "react-query";
import axiosInstance from "../api/axios";
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
    retry: 0,
  } as UseProfileOption
) => {
  const { data, ...useQueryResult } = useQuery<BriefProfile>(
    "profile",
    getBriefProfile,
    option
  );

  return { data: data!, ...useQueryResult };
};

export default useProfile;
