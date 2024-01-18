import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import axiosInstance from "../../Api/axios";
import appIcon from "../../assets/app-icon-with-text.svg";
import FormField from "../../components/FormField";
import FormInput from "../../components/FormInput";
import FormInputError from "../../components/FormInputError";
import FormLabel from "../../components/FormLabel";
import { useState } from "react";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import ROUTES from "../../constants/routes";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field is required" })
    .email({ message: "Email is not correctly formatted" }),
});

type FormDataType = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<FormDataType>({
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
  });

  const submitMutation = useMutation({
    mutationFn: async (email: string) => {
      return await axiosInstance.post("auth/password-reset", {
        email,
      });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await submitMutation.mutateAsync(data.email);
    setIsSubmitted(true);
  });

  const handleResendRequest = async () => {
    await submitMutation.mutateAsync(getValues().email);
  };

  const emailForm = (
    <div className="max-w-xl w-full mx-auto my-24 px-8 py-8 rounded-md bg-white lg:shadow-md">
      <img className="mx-auto w-60 mb-10" src={appIcon} />
      <div className="text-center text-lg font-semibold">Reset password</div>
      <form onSubmit={onSubmit}>
        <FormField>
          <FormLabel>Email</FormLabel>
          <FormInput
            $hasError={Boolean(errors.email?.message)}
            id="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          <ErrorMessage
            name="email"
            errors={errors}
            render={({ message }) => <FormInputError>{message}</FormInputError>}
          />
        </FormField>
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

  return isSubmitted ? (
    <div className="max-w-xl w-full mx-auto my-24 px-8 py-8 rounded-md bg-white lg:shadow-md">
      A password request has been sent to your email. Please open attached the
      link in the email to reset your password.
      <div className="flex justify-between mt-2">
        <Button $variant="neutral" onClick={handleResendRequest}>
          Resend request
        </Button>
        <Link to={ROUTES.LOGIN}>
          <Button>Back to login page</Button>
        </Link>
      </div>
    </div>
  ) : (
    emailForm
  );
};

export default ForgotPasswordPage;
