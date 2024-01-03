import { AxiosError, HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import ROUTES from "./constants/routes";
import useProfile from "./hooks/useProfile";
import { useEffect } from "react";

function Root() {
  const { error: profileError } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      profileError instanceof AxiosError &&
      profileError.response?.status === HttpStatusCode.Unauthorized
    ) {
      navigate({ pathname: ROUTES.LOGIN }, { replace: true });
    } else {
      navigate({ pathname: ROUTES.APP }, { replace: true });
    }
  }, [navigate, profileError]);

  return <></>;
}

export default Root;
