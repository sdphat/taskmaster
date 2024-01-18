import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpStatusCode } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import axiosInstance from "../../Api/axios";
import appIcon from "../../assets/app-icon-with-text.svg";
import googleIcon from "../../assets/google-icon.svg";
import FormField from "../../components/FormField";
import FormInput from "../../components/FormInput";
import FormInputError from "../../components/FormInputError";
import FormLabel from "../../components/FormLabel";
import Link from "../../components/Link";
import ROUTES from "../../constants/routes";
import { isStrongPassword } from "../../utils/isStrongPassword";

const schema = z
  .object({
    fullName: z.string().min(1, { message: "Name field is required" }),
    email: z
      .string()
      .min(1, { message: "Email field is required" })
      .email({ message: "Email is not correctly formatted" }),
    password: z.string().min(1, { message: "Password field is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password field is required" }),
  })
  .superRefine(({ password }, ctx) => {
    if (!isStrongPassword(password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message:
          "Password must have minimum length of 8 and include 1 uppercase letter, 1 lowercase letter and 1 number",
      });
    }
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (!password) {
      return z.NEVER;
    }

    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Confirm password does not match password",
        path: ["confirmPassword"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

type RegisterInput = z.infer<typeof schema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onSubmit: SubmitHandler<RegisterInput> = async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    confirmPassword,
    ...data
  }) => {
    const response = await axiosInstance.post("/auth/register", data);
    if (response.status === HttpStatusCode.Conflict) {
      setError("email", {
        message:
          "This email is already in use. Please register with other email.",
        type: "custom",
      });
      return;
    }
    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl) {
      navigate(redirectUrl, { replace: true });
    } else {
      navigate(ROUTES.APP, { replace: true });
    }
  };

  return (
    <div className="w-full h-[100vh] bg-cover grid place-items-center">
      <div className="min-w-[512px] px-8 py-8 rounded-md bg-white lg:shadow-md">
        <img className="mx-auto w-60 mb-10" src={appIcon} />
        <div className="text-center text-lg font-semibold">Register</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel>Full name</FormLabel>
            <FormInput
              $hasError={Boolean(errors.fullName?.message)}
              {...register("fullName")}
              type="text"
              id="full-name"
              placeholder="Enter your name"
            />
            <ErrorMessage
              name="fullName"
              errors={errors}
              render={({ message }) => (
                <FormInputError>{message}</FormInputError>
              )}
            />
          </FormField>
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
              id="confirm-password"
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
          <FormField>
            <FormLabel>Confirm password</FormLabel>
            <FormInput
              $hasError={Boolean(errors.confirmPassword?.message)}
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
            />
            <ErrorMessage
              name="confirmPassword"
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
              Register
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
        <Link className="block mx-auto w-max" to="/login">
          Already have an account? Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;
