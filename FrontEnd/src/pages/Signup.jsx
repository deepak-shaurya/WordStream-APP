import React from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom'
import toast from "react-hot-toast";
import {useMutation, useQueryClient } from '@tanstack/react-query';


function Signup() {

  const [massage , setmassage ] = React.useState(false)

  const [ Formdata , setFormdata ] = React.useState({
    fullname: '',
    username: '',
    bio : '',
    email: '',
    password: ''
  });
  const queryClient = useQueryClient();
  const Navigate = useNavigate();

  const {mutate , isError, isPending, error} = useMutation({
    mutationFn: async ({fullname, username, bio, email, password})=>{
      try {
        const res = await axios.post(
          '/api/v1/user/register',
          { fullname, username, bio, email, password },
          { 
            "withCredentials": true ,
            "Content-Type":"application/json"
          }
        );

        const data = res.data;
        return data || null;

      } catch (error) {
        console.log(error?.message)
      }
    },
    onSuccess: () =>{
      toast.success("Account created Successfully...");
      queryClient.invalidateQueries({ queryKey: ["AuthUser"] });
      Navigate('/');
    }
  })


  const handlechange = (e) => {
    setFormdata({...Formdata, [e.target.name]: e.target.value})
  } 

  const handlesub = async (e) => {
    e.preventDefault();
    mutate(Formdata)
  }

  


  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
    <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
    <form className="bg-gray-700 p-6 rounded shadow-md w-full max-w-sm">
      <div className="mb-4">
        <label htmlFor="fullname" className="block text-white">FullName:</label>
        <input type="text"  onChange={handlechange} id="fullname" name="fullname" required className="mt-1 p-2 w-full border rounded" />
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="block text-white">Username:</label>
        <input type="text" id="username"  onChange={handlechange} name="username" required className={`mt-1 p-2 w-full border rounded ${massage ? "border-red-500": null}`} />
      
      </div>
      <div className="mb-4">
        <label htmlFor="bio" className="block text-white">Bio:</label>
        <textarea type="text"  onChange={handlechange} id="bio" name="bio" required className="mt-1 p-2 w-full h-30 resize-none border rounded" />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-white">Email:</label>
        <input type="email"  onChange={handlechange} id="email" name="email" required className="mt-1 p-2 w-full border rounded" />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-white">Password:</label>
        <input type="password"  onChange={handlechange} id="password" name="password" required className="mt-1 p-2 w-full border rounded" />
      </div>
      <button type="submit" onClick={handlesub} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">{isPending ? "Loading..." : "Sign up"}</button>
      <div className='min-h-2 max-h-auto w-full'>
        <p className='text-red-500 text-sm'>{isError? error : null}</p>
      </div>
    </form>

    <p className="mt-4">
      Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log In</Link>
    </p>
  </div>
  )
}

export default Signup