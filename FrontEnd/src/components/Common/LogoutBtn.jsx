import React from 'react'
import {useDispatch} from 'react-redux'
import { LogoutReducer } from '../../Store/authSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";

function LogoutBtn() {
  const Dispatch = useDispatch()
  const Navigate = useNavigate()
  console.log("log out hits");
  
  const logoutHandler = async () => {
    try {
      console.log("log out hits - after");
      const response = await axios.post('/api/v1/user/logout', { withCredentials: true });
      if(response.data.success){
        toast.success( "user Logged out successfully..", { autoClose: 1000 });
        Dispatch(LogoutReducer())
        Navigate('/');
      }else{
        toast.success( "Log-out Failed..", { autoClose: 1000 });
      }
    } catch (error) {
      console.error(error); // Handle error response
    }
  }
  
  return (
    <button
    className='inline-bock w-full px-6 py-2 duration-200 bg-red-500 hover:bg-red-400 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn