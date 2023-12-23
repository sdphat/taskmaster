import { useEffect, useState } from "react";

export interface UseClickOutsideArgs {
  element: HTMLElement;
  onClickOutside: (event: MouseEvent) => void;
}

const useClickOutside = ({ onClickOutside, element }: UseClickOutsideArgs) => {
  const [isOutside, setOutside] = useState(false);
  useEffect(() => {
    function handleClickOutside(this: Document, ev: globalThis.MouseEvent) {
      const _isOutside = !(ev.target as Node).contains(element);
      setOutside(_isOutside);
      if (_isOutside) {
        onClickOutside(ev);
      }
    }
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [element, onClickOutside]);
  return [isOutside];
};

export default useClickOutside;
