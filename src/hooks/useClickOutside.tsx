import { useEffect, useState } from "react";

export interface UseClickOutsideArgs {
  element: HTMLElement | undefined;
  onClickOutside: (event: MouseEvent) => void;
}

const useClickOutside = ({ onClickOutside, element }: UseClickOutsideArgs) => {
  const [isOutside, setOutside] = useState(false);
  useEffect(() => {
    function handleClickOutside(this: Document, ev: globalThis.MouseEvent) {
      if (!element) {
        return;
      }

      const _isOutside = !(element as Node).contains(ev.target as Node);
      if (_isOutside) {
        onClickOutside(ev);
      }
      setOutside(_isOutside);
    }
    document.addEventListener("mouseup", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [element, onClickOutside]);
  return [isOutside];
};

export default useClickOutside;
