import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


function AuthBtns() {
    const queryClient = useQueryClient()
    const cachedData = queryClient.getQueryData(["AuthUser"]);
	const authUser = cachedData.data;
    const [islogggedin, setIsLoggedIn ]=useState()

    useEffect(() => {
        if(!authUser){
            setIsLoggedIn(false)
        } else {
            setIsLoggedIn(true)  
        }
    },[authUser])

    return(
        <>
            {islogggedin?
                (null) 
                :
                (<div >
                    <Link className='px-4 py-2  rounded-l bg-yellow-500 hover:bg-yellow-700' to='/signup'> Signup</Link>
                    <Link className='px-4 py-2 rounded-r  bg-yellow-500 hover:bg-yellow-700' to='/login'> Login</Link>
                </div>
            )}
        </>   
    )
    
}

export default AuthBtns