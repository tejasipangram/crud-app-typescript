import React, { useContext } from "react";
import CreateList from "./components/List/Modal";
import ListCard from "./components/List/ListCards";
import { GlobalContext, GlobalContextType } from "./GloblaCotext.tsx";
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

const Home = () => {
  const contextValue = useContext<GlobalContextType | null>(GlobalContext);

  if (contextValue === null) {
    return <div>Loading...</div>;
  } else {
    const { currentData, darkMode } = contextValue;

    return (
      <div
        className={`min-vh-100 d-flex flex-wrap gap-4 justify-content-start flex-column align-items-center ${
          darkMode ? "bg-dark text-light " : "bg-light text-dark"
        }`}
      >
        <CreateList />
        <div className="d-flex flex-wrap gap-4 justify-content-center">
          {currentData.length > 0 ? (
            currentData.map((list) => {
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
  }
};

export default Home;
