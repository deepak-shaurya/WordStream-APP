import React from 'react'
import axios from 'axios';
import Login from './pages/Login'
import Home from './pages/Home'
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom'
import ProfilePage from './pages/ProfilePage.jsx';
import CreateArticle from './pages/CreateArticle.jsx';
import Navbar from './components/Common/Navbar/Navbar.jsx';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/Common/LoadingSpinner.jsx';
import toast, { Toaster } from 'react-hot-toast';
import Signup from './pages/Signup.jsx';
import ArticlePage from './pages/ArticlePage.jsx';

function App() {
  const navigate = useNavigate()
  const { data : authUser, isLoading, error} = useQuery({
    queryKey:["AuthUser"],
    queryFn: async ()=>{
      try {
        const res = await axios.get(
          '/api/v1/user/checkauth',
          { withCredentials: true }
        );
        if(res.error) return null;
        const data = res.data;
       
        if(!data.success){
          console.log("something went wrong in chaacking authentication of user...!");
        }
        return data;

      } catch (error) {
        toast.error( error?.message || "You are not Authenticated! Log in Now" );
        navigate("/login")
      }

    },
    onSuccess: ()=>{
      toast.success("you are logged in...");
    },
    retry : false,
  });
 
  if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

  return  (
    <div className='flex flex-col max-w-6xl  mx-auto'>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser? <Home/> : <Navigate to={'/login'}/>}/>
        <Route path='login' element={authUser ? <Navigate to={"/"}/> : <Login /> } />
        <Route path='signup' element={authUser ? <Navigate to='/' /> : <Signup/>} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={'/login'}/>}/>
        <Route path='/create' element={authUser ? <CreateArticle /> : <Navigate to={'/login'}/>}/>
        <Route path='/article/:id' element={authUser? <ArticlePage/>:<Navigate to={'/login'}/>}/>
      </Routes>
      <Toaster/>
    </div>
    

  ) 
}

export default App
