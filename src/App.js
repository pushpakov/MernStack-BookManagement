import Header from "./components/Header";
import Blog from "./components/Blog";
import UserBlog from "./components/UserBlog";
import BlogDetail from "./components/BlogDetail";
import AddBlog from "./components/AddBlog";
import Auth from "./components/Auth";
import { useSelector } from 'react-redux'
import React from "react";
import { Route, Routes } from "react-router-dom";

function App() {
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  console.log(isLoggedIn)
  return <React.Fragment>
    <header>
      <Header/>
    </header>
    <main>
      <Routes>
        <Route path="/auth" element={<Auth />}/>
        <Route path="/books" element={<Blog />}/>
        <Route path="/book/userId" element={<UserBlog />}/>
        <Route path="/books/id" element={<BlogDetail />}/>
        <Route path="/books/add" element={<AddBlog />}/>
      </Routes>
    </main>
  </React.Fragment>
}

export default App;
