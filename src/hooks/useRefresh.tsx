import { useState } from "react";

const useRefresh = () => {
  const [, setValue] = useState(false);
  return () => setValue((v) => !v);
};

export default useRefresh;
