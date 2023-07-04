import { createContext, useContext } from "react";

const ColorContext = createContext<string | undefined>(undefined);

const useColor = () => {
  const context = useContext(ColorContext);

  return context;
};

export { useColor, ColorContext };
