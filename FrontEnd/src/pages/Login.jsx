import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query';


function Login() {

  const navigate = useNavigate();

  const [ Formdata , setFormdata ] = React.useState({
    email: '',
    password: ''
  });

  const queryClient =useQueryClient()

  const {mutate , isError, isPending, error} = useMutation({
    mutationFn: async ({email, password})=>{
      try {
        const res = await axios.post(
          '/api/v1/user/login',
          { email, password },
          { 
            "withCredentials": true ,
            "Content-Type":"application/json"
          }
        );
        const data = res;
        return data

      } catch (error) {
        console.log(error)
      }
    },
    onSuccess: () =>{
      toast.success("Login Successfull");
      queryClient.invalidateQueries({ queryKey: ["AuthUser"] });
      navigate('/');
    },
    onError:()=>{
      toast.error(error.message)
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

    <div className='flex flex-col w-full items-center justify-center min-h-screen '>
        <h2 className="text-2xl text-center font-bold mb-6">Log in</h2>
        <form className='bg-gray-700 mx-auto p-6 rounded shadow-md w-full max-w-sm'>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">Email:</label>
            <input type="email"  onChange={handlechange} id="email" name="email" required className="mt-1 p-2 w-full border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-white">Password:</label>
            <input type="password"  onChange={handlechange} id="password" name="password" required className="mt-1 p-2 w-full border rounded" />
          </div>
          <div className='flex items-center justify-between'>
            <button onClick={handlesub} className='bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button'>
            {isPending ? "Loading..." : "Log In"}
            </button>
          </div>
          <div className='min-h-2 max-h-auto w-full'>
            <p className='text-red-500 text-sm'>{isError? error : null}</p>
          </div>
        </form>
        <p className="mt-4 text-center">
                Don't have an account?  <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </p>
    </div>
  )
}

export default Login