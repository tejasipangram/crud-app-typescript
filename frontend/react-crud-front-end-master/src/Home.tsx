import React, { useContext } from "react";
import CreateList from "./components/List/Modal";
import ListCard from "./components/List/ListCards";
import { GlobalContext } from "./GloblaCotext";
import PaginationOutlined from "./components/MuiPagination";
type arr = {
  key: string;
  UserId: string;
  _id: string;
  description: string;
  email: string;
  filePath: string;

  title: string;
};

type GlobalContextType = {
  currentData: arr[]; // Replace YourDataType with the actual data type
  darkMode: boolean; // Assuming darkMode is a boolean
};
const Home = () => {
  const { currentData, darkMode } =
    useContext<GlobalContextType>(GlobalContext);
  console.log(currentData);

  return (
    <div
      className={`min-vh-100 d-flex flex-wrap gap-4 justify-content-start flex-column align-items-center ${
        darkMode ? "bg-dark text-light " : "bg-light text-dark"
      }`}
    >
      <CreateList />
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {currentData.length > 0 ? (
          currentData.map((list, index) => {
            return (
              <ListCard
                key={list._id}
                title={list.title}
                description={list.description}
                id={list._id}
                filePath={list.filePath}
              />
            );
          })
        ) : (
          <div>No data found</div>
        )}
      </div>
      {/* <ShowPagesButton /> */}
      {/* <PaginatedItems items={currentData} /> */}
      <PaginationOutlined />
    </div>
  );
};

export default Home;
