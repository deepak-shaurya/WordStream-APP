import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import e from "cors";
import axios from "axios";

const CreateArticle = () => {
	const navigate = useNavigate();
	const [Title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [img, setImg] = useState(null);

	const imgRef = useRef(null);

	const data = {
		profileImg: "/avatar-placeholder.png",
	};

	const queryClient = useQueryClient();
	const authuser = queryClient.getQueryData(["AuthUser"]);

  const {mutate: CreateArticle , isError, isPending, error} = useMutation({
    mutationFn: async ({Title ,content,img})=>{
      try {
        const res = await axios.post(
          '/api/v1/article/create',
          { Title, content, img },
          { 
            "withCredentials": true ,
            "Content-Type":"application/json"
          }
        );
        const data = res;
		if (res.status < 200 || res.status >= 300){
			throw new Error(data.error || "Something went wrong");
		}
        return data
      } catch (error) {
		throw error;
      }
    },
    onSuccess: () =>{
      toast.success("Post Created Successfull");
      navigate('/');
    }
  })

	useEffect(() => {
		if (isError) {
			toast.error(error?.message || "Something went wrong");
			console.log(error);
			setTitle("");
			setContent("");
			setImg(null);
		}
	}, [isError]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if(!(Title && content)){
			toast.error("You must type somthing...")
		}else{
			CreateArticle({Title,content,img});
		}
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-4 items-start w-full gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authuser?.profilepic || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full'>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}
				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4' onClick={handleSubmit}>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				<textarea
					className={`textarea w-full p-0 text-lg resize-none ${isPending?`disabled`:null} border-none focus:outline-none  border-gray-800`}
					placeholder='What is the title?!'
					value={Title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					className={`textarea w-full h-50 p-0 text-lg resize-none border-none focus:outline-none ${isPending? `disabled`:null}  border-gray-800`}
					placeholder='What is the Content?!'
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				
				{isError && <div className='text-red-500'>Something went wrong</div>}
			</form>
		</div>
	);
};
export default CreateArticle