// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Navigate } from "react-router-dom";

// export const query = (route, Body, Params) => {
//     switch (route){
//         case "login":
//             Login(Body)
//     }

// }

// const queryClient = useQueryClient()

//   const {mutate: Login, isError, isPending, error} = useMutation({
//     mutationFn: async ({email, password})=>{
//       try {
//         const res = await axios.post(
//           '/api/v1/user/login',
//           { email, password },
//           { 
//             "withCredentials": true ,
//             "Content-Type":"application/json"
//           }
//         );
//         const data = res;
//         return data

//       } catch (error) {
//         console.log(error)
//       }
//     },
//     onSuccess: () =>{
//       toast.success("Login process Successfull");
//       queryClient.invalidateQueries({ queryKey: ["AuthUser"] });
//       Navigate('/');
//     }
//   })