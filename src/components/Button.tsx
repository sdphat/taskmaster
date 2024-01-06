import { ButtonHTMLAttributes } from "react";
import tw from "tailwind-styled-components";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "neutral"
  | "danger";
export type ButtonShape = "square" | "rect";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: ButtonVariant;
  $shape?: ButtonShape;
}

const buttonVariantClassNames: Record<ButtonVariant, string> = {
  primary: "bg-blue-700 text-white active:bg-blue-800",
  ghost: "hover:bg-gray-200 active:bg-gray-400",
  secondary: "",
  neutral: "bg-slate-200 hover:bg-slate-300 active:bg-slate-400",
  danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
};

const buttonShapeClassNames: Record<ButtonShape, string> = {
  rect: "px-3 py-2",
  square: "p-2",
};

const Button = tw.button<ButtonProps>`    
    rounded-md
    transition-all
    disabled:bg-gray-400 disabled:text-white
    ${(p) => buttonVariantClassNames[p.$variant ?? "primary"]}
    ${(p) => buttonShapeClassNames[p.$shape ?? "rect"]}
`;

export default Button;
