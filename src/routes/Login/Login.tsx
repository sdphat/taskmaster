import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { AxiosError, HttpStatusCode } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import axiosInstance from "../../Api/axios";
import appIcon from "../../assets/app-icon-with-text.svg";
import googleIcon from "../../assets/google-icon.svg";
import FormField from "../../components/FormField";
import FormInput from "../../components/FormInput";
import FormInputError from "../../components/FormInputError";
import FormLabel from "../../components/FormLabel";
import Link from "../../components/Link";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field is required" })
    .email({ message: "Email is not correctly formatted" }),
  password: z.string().min(1, { message: "Password field is required" }),
});

type LoginInput = z.infer<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const navigate = useNavigate();
  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    async onSuccess(codeResponse) {
      const response = await axiosInstance.post("/auth/login/google", {
        code: codeResponse.code,
      });
      if (response.status === HttpStatusCode.Conflict) {
        setError("root", {
          message:
            "Login failed. An account with this email was created before.",
          type: "custom",
        });
        return;
      }
      navigate("/app", { replace: true });
    },
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      await axiosInstance.post("/auth/login", data);
      navigate("/app", { replace: true });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === HttpStatusCode.Unauthorized) {
          setError("root", {
            message: "Login failed. Please check again.",
            type: "custom",
          });
        }
      }
    }
  };

  return (
    <div className="w-full h-[100vh] bg-cover grid place-items-center">
      <div className="min-w-[512px] px-8 py-8 rounded-md bg-white lg:shadow-md">
        <img className="mx-auto w-60 mb-10" src={appIcon} />
        <div className="text-center text-lg font-semibold">
          Log in to continue
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel>Email</FormLabel>
            <FormInput
              $hasError={Boolean(errors.email?.message)}
              {...register("email")}
              type="text"
              id="email"
              placeholder="Enter your email"
            />
            <ErrorMessage
              name="email"
              errors={errors}
              render={({ message }) => (
                <FormInputError>{message}</FormInputError>
              )}
            />
          </FormField>
          <FormField>
            <FormLabel>Password</FormLabel>
            <FormInput
              $hasError={Boolean(errors.password?.message)}
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            <ErrorMessage
              name="password"
              errors={errors}
              render={({ message }) => (
                <FormInputError>{message}</FormInputError>
              )}
            />
            <Link to="/forgot-password">Forgot password</Link>
          </FormField>
          <FormInputError>{errors.root?.message}</FormInputError>
          <div>
            <button
              className="bg-blue-700 text-white px-1 py-2 rounded-sm w-full mt-6 active:bg-blue-800"
              type="submit"
            >
              Continue
            </button>
          </div>
        </form>
        <div className="text-center my-4 font-light text-xs">OR</div>
        <div>
          <div>
            <button className="block w-full h-11 border-2 shadow-md mx-auto hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center mx-4">
                <div className="w-5">
                  <img src={googleIcon} className="h-5 w-5" />
                </div>
                <button
                  onClick={loginWithGoogle}
                  className="flex-grow font-bold text-sm"
                >
                  Continue with Google
                </button>
              </div>
            </button>
          </div>
        </div>
        <div className="pb-12"></div>
        <Link className="block mx-auto w-max" to="/register">
          Don't have an account? Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
