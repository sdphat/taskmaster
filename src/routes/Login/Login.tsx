import { SubmitHandler, useForm } from "react-hook-form";
import appIcon from "../../assets/app-icon-with-text.svg";
import googleIcon from "../../assets/google-icon.svg";
import FormField from "../../components/FormField";
import FormInput from "../../components/FormInput";
import FormLabel from "../../components/FormLabel";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import FormInputError from "../../components/FormInputError";
import axios, { AxiosError, HttpStatusCode } from "axios";

interface LoginInput {
  email: string;
  password: string;
}

const schema = z.object({
  email: z.string().email({ message: "Email is not correctly formatted" }),

  password: z.string().min(1, { message: "Password field in required" }),
});

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

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        data
      );
      console.log(response.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === HttpStatusCode.Unauthorized) {
          setError("root", { message: "Login failed. Please check again.", type: "custom" });
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
                <div className="flex-grow font-bold text-sm">
                  Continue with Google
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="pb-12"></div>
      </div>
    </div>
  );
};

export default Login;
