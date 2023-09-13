import { ReactNode, createContext } from "react";
type ListData = {
  _id: string;
  title: string;
  description: string;
  filePath: string;
  UserId: string;
  email: string;
  __v: number;
};
export interface GlobalContextType {
  setKey: (key: number | null) => void;
  totalItems: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  createList: (title: string, description: string, file: File) => void;
  updateList: (
    id: string,
    title: string,
    description: string,
    file: File
  ) => void;
  deleteList: (id: string) => void;
  totalPages: number;
  getAllData: () => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  currentData: ListData[]; // Replace 'any' with the appropriate type
  loading: boolean;
  setLoading: (loading: boolean) => void;
  userId: string | null;
  setUserId: (userId: string) => void;
  user: any; // Replace 'any' with the appropriate type
  load: boolean;
  darkMode: boolean;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);
interface GlobalContextProviderProps {
  children: ReactNode;
  initialContextValues: GlobalContextType; // Pass the initial context values as a prop
}
export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({
  children,
  initialContextValues,
}) => {
  // Define your state and context value here

  return (
    <GlobalContext.Provider value={initialContextValues}>
      {children}
    </GlobalContext.Provider>
  );
};
