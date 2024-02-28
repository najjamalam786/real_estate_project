import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import About from "./pages/About";
import Header from './components/Header';
import PrivateRout from './components/PrivateRout';
import CreateListing from './pages/CreateListing';



export default function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/create-listing" element={<CreateListing/>}/>

        {/* after signOut, can't access profile by using "/profile" */}
        <Route element={<PrivateRout />}>

          <Route path="/profile" element={<Profile />} />
          

        </Route>

      </Routes>
    </BrowserRouter>


  )
}
