import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import appIcon from "../../assets/app-icon-with-text.svg";
import FormField from "../../components/FormField";
import FormInput from "../../components/FormInput";
import FormInputError from "../../components/FormInputError";
import FormLabel from "../../components/FormLabel";
import { isStrongPassword } from "../../utils/isStrongPassword";
import { useMutation } from "react-query";
import axiosInstance from "../../Api/axios";
import { HttpStatusCode } from "axios";
import { useEffect } from "react";

const schema = z
  .object({
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

const ResetPasswordPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterInput>({
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submitMutation = useMutation({
    mutationFn: async ({
      password,
      token,
    }: {
      token: string;
      password: string;
    }) => {
      return await axiosInstance.post("auth/change-password", {
        token,
        password,
      });
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const token = searchParams.get("token");
    if (!token) {
      return;
    }
    const response = await submitMutation.mutateAsync({
      token,
      password: data.password,
    });

    if (response.status === HttpStatusCode.NotFound) {
      alert("Session has expired or token is invalid.");
      navigate("/");
      return;
    }

    alert("Change password successfully.");
    navigate("/login");
  });

  return (
    <div className="max-w-xl w-full mx-auto my-24 px-8 py-8 rounded-md bg-white lg:shadow-md">
      <img className="mx-auto w-60 mb-10" src={appIcon} />
      <div className="text-center text-lg font-semibold">Reset password</div>
      <form onSubmit={onSubmit}>
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
            render={({ message }) => <FormInputError>{message}</FormInputError>}
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
            render={({ message }) => <FormInputError>{message}</FormInputError>}
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
    </div>
  );
};

export default ResetPasswordPage;
