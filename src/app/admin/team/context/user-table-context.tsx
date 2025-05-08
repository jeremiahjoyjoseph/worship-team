import { createContext, useContext } from "react";
import { IUser } from "@/types/user";

export const UserTableContext = createContext<{
  updateRow: (user: IUser) => void;
} | null>(null);

export const useUserTableContext = () => {
  const context = useContext(UserTableContext);
  if (!context)
    throw new Error("useUserTableContext must be used within provider");
  return context;
};
