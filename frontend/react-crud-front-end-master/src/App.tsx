import "./App.css";
import {
  GlobalContext,
  GlobalContextProvider,
  GlobalContextType,
} from "./GloblaCotext.tsx";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import NavbarComp from "./components/Navabar";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route, Form } from "react-router-dom";
import Home from "./Home.tsx";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Loader from "./Loader";

import { auth } from "./firebase";
import { signInWithCustomToken } from "firebase/auth";
import Resetpassword from "./components/resetpassword/Resetpassword";
import UsersList from "./components/users/UserList";
type ListData = {
  _id: string;
  title: string;
  description: string;
  filePath: string;
  UserId: string;
  email: string;
  __v: number;
};
function App() {
  type userType = [
    {
      title: string;
      description: string;
      image: string;
      email: string;
    } | null, // The user object can be null if the user is not authenticated
    boolean
  ];

  // Then, in your component where you declare the state:
  const [currentData, setCurrentData] = useState<ListData[]>([]);

  const [user, load] = useAuthState(auth);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allData, setAllData] = useState([]);

  const [totalItems, setTotaItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [key, setKey] = useState<number | null>(null);
  //creating a list
  //when we create a list we will update the alldata and currentdata

  const createList = (title: string, description: string, file: File) => {
    //creating a form data
    console.log(file);
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", file);

    if (user && user.email) {
      formData.append("email", user.email);
    }

    if (user?.uid) {
      fetch(`${process.env.REACT_APP_SERVER}/create/${user.uid}`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((json) => {
          setLoading(false);
          if (json.success) {
            if (!allData) {
              setAllData(json.data);
            } else {
              setAllData((prev: any): any => {
                return [json.data, ...prev];
              });
            }
            toast.success("List created");
          } else {
            alert(json.message);
          }
          setKey(Math.random());
          getAllData();
        })
        .catch((err) => {
          setLoading(false);
          getAllData();
          toast.error("An error occured");
        });
    }
  };
  //getting the data from json api
  const getAllData = (page = 1) => {
    console.log(pageSize, "get all data");
    if (user) {
      setLoading(true);
      const encodedUserId = encodeURIComponent(user.uid);
      fetch(
        `${process.env.REACT_APP_SERVER}/read/${encodedUserId}?page=${page}&pageSize=${pageSize}`
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            console.log(json);
            setLoading(false);
            setTotalPages(json.totalPages);
            setCurrentData(json.data);
            setCurrentPage(json.page);
          } else {
            setLoading(false);
            setTotalPages(0);
            setCurrentData([]);
            setCurrentPage(1);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          setCurrentData([]);
        });
    }
  };

  //updating the list

  const updateList = async (
    id: string,
    title: string,
    description: string,
    file: File
  ) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", file);

      const res = await fetch(`${process.env.REACT_APP_SERVER}/update/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      toast.success("List updated");
      const newData = currentData.map((list, index) => {
        if (data.data._id === list._id) {
          list.title = title;
          list.description = description;
          list.filePath = data.data.filePath;
        }
        return list;
      });

      setCurrentData(newData);
      setLoading(false);
      setKey(Math.random());
    } catch (error) {
      toast.error("An error occured");
      setLoading(false);
    }
  };

  //deleting a list

  const deleteList = async (id: string) => {
    try {
      setLoading(true);
      await fetch(`${process.env.REACT_APP_SERVER}/delete/${id}`, {
        method: "DELETE",
      });
      setLoading(false);
      const newData = currentData.filter((list, index) => {
        return list._id !== id;
      });

      setCurrentData(newData);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, [pageSize, user]);

  const contextValues: GlobalContextType = {
    setKey,
    totalItems,
    currentPage,
    setCurrentPage,
    createList,
    updateList,
    deleteList,
    totalPages,
    getAllData,
    pageSize,
    setPageSize,
    currentData,
    loading,
    setLoading,
    userId,
    setUserId,
    user,
    load,
    darkMode,
  };
  return (
    <BrowserRouter>
      <GlobalContextProvider initialContextValues={contextValues}>
        <NavbarComp user={user} setDarkMode={setDarkMode} />
        <Loader />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />

          <Route path="/login" element={user ? <Home /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/auth/resetpassword"
            element={user ? <Home /> : <Resetpassword />}
          />
          <Route path="/users" element={<UsersList />} />
        </Routes>
      </GlobalContextProvider>
    </BrowserRouter>
  );
}

export default App;
