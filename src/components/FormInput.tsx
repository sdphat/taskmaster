import tw from "tailwind-styled-components";

export interface FormInputProps {
  $hasError?: boolean;
}

const FormInput = tw.input<FormInputProps>`
    py-2 
    px-2 
    w-full 
    focus:outline-none
    border-2 
    border-gray-300 
    rounded
    ${(p) =>
      p.$hasError
        ? "bg-red-100 text-red-500 placeholder:text-red-500 focus:border-red-300"
        : "focus:border-blue-700"}
    transition-colors
    duration-200
`;

export default FormInput;
