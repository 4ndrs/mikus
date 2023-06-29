import { createContext, useContext, useState } from "react";

const ProgressBarContext = createContext<
  | {
      current: number;
      setCurrent: React.Dispatch<React.SetStateAction<number>>;
    }
  | undefined
>(undefined);

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [current, setCurrent] = useState(0);

  const value = { current, setCurrent };

  return (
    <ProgressBarContext.Provider value={value}>
      {children}
    </ProgressBarContext.Provider>
  );
};

const useProgressBar = () => {
  const context = useContext(ProgressBarContext);

  if (!context) {
    throw new Error("useProgressBar must be used within a ProgressBarProvider");
  }

  return context;
};

export { ProgressBarProvider, useProgressBar };
