import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import CameraIcon from "remixicon-react/CameraLineIcon";
import axiosInstance from "../../api/axios";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import FormInput from "../../components/FormInput";
import FormInputError from "../../components/FormInputError";
import FormLabel from "../../components/FormLabel";
import useProfile from "../../hooks/useProfile";
import useSendAttachmentMutation from "../../hooks/useSendAttachmentMutation";

interface UpdateUserMutationArgs {
  avatarUrl?: string;
  fullName?: string;
}

const AccountPage = () => {
  const { data: profile, refetch } = useProfile();
  const {
    register,
    formState: { isDirty, errors },
    handleSubmit,
  } = useForm();
  const sendAttachmenetMutation = useSendAttachmentMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateUserMutation = useMutation({
    mutationFn: async (user: UpdateUserMutationArgs) => {
      return (await axiosInstance.put(`/users`, user)).data;
    },
  });

  async function handleChangeFile(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const file = event.currentTarget.files![0];
    const { url } = await sendAttachmenetMutation.mutateAsync({ file });
    await updateUserMutation.mutateAsync({
      avatarUrl: url,
    });
    refetch();
  }

  const onSubmit = handleSubmit(async (data) => {
    await updateUserMutation.mutateAsync({
      fullName: data.fullName,
    });
    refetch();
  });

  if (!profile) {
    return;
  }

  return (
    <div className="w-96 mx-auto py-8 px-4">
      <div>
        <h1>Profile</h1>
      </div>
      <form onSubmit={onSubmit} className="mt-4">
        <div className="relative w-32 h-32 mx-auto group cursor-pointer">
          <input
            ref={fileInputRef}
            onChange={handleChangeFile}
            type="file"
            name="attachment"
            accept="image/png,image/jpeg"
            className="hidden"
          />
          <img
            src={profile.avatarUrl}
            alt=""
            className="w-full h-full rounded-full"
          />
          <div
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="absolute inset-0 grid place-items-center rounded-full group-hover:opacity-80 opacity-0 bg-gray-200 transition-all"
          >
            <CameraIcon className="" size={36} />
          </div>
        </div>

        <FormField>
          <FormLabel>Email</FormLabel>
          <FormInput value={profile.email} readOnly disabled />
        </FormField>
        <FormField>
          <FormLabel>Full name</FormLabel>
          <FormInput
            {...register("fullName", {
              required: { message: "Full name cannot be empty", value: true },
            })}
            defaultValue={profile.fullName}
          />
          <ErrorMessage
            name="fullName"
            errors={errors}
            render={({ message }) => <FormInputError>{message}</FormInputError>}
          />
        </FormField>
        <Button className="w-full mt-2" disabled={!isDirty}>
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default AccountPage;
