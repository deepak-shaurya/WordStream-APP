import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {formatPostDate} from "../utils/date/index.js"
import axios from "axios";
import LoadingSpinner from "../components/Common/LoadingSpinner.jsx";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";

const ArticlePage = () => {
	const {id} = useParams()
	const navigate = useNavigate()
	const [comment, setComment] = useState("");
	const queryClient = useQueryClient();
	const cachedData = queryClient.getQueryData(["AuthUser"]);
	if(!cachedData){
		queryClient.invalidateQueries({ queryKey: ["AuthUser"] })
	}
	const authUser = cachedData.data;
	const {
		data : article,
		isLoading,
		isError,
		error} = useQuery({
		queryKey: ["article"],
		queryFn: async () => {
			try {
				const res = await axios.get(`/api/v1/article/get/${id}`);
				const data = res.data;
				return data;
			} catch (error) {
				throw error;
			}
		},
	});
	const articleOwner = article?.user;
	const isLiked = article?.likes.includes(authUser?._id);

	const isMyArticle = authUser?._id === articleOwner?._id;

	const formattedDate = formatPostDate(article?.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await axios.delete(`/api/v1/article/${article._id}`);
				console.log(res, "deleted article...")
				if (res.status >= 200 && res.status < 300) {
					return res.data;
				}else {
					throw new Error(res.data?.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error.message || "delete failed...");
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			navigate('/');
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete post");
		},
	});

	const {mutate: likeArticle , isPending : isLiking}= useMutation({
		mutationFn: async () => {
			try {
				const res = await axios.post(`/api/v1/article/like/${article._id}`);
				const data = res.data;
				if (res.status < 200 || res.status >= 300)
				{
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (updatedLikes) => {
			queryClient.setQueryData(["article"], (oldData) => ({
				...oldData,
				likes: updatedLikes,
			}));
			  
		},
		onError: (error) => {
			toast.error(error.message);
		},
	})

	const { mutate: commentArticle, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await axios.post(`/api/v1/article/comment/${article._id}`,{content: comment},{"Content-Type": "application/json"})
				const data = res;
				if (res.status < 200 || res.status >= 300) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["article"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost();
	};

	const EditHandler = () => {
		alert("feature is not available...")
	}

	const handlePostComment = (e) => {
		e.preventDefault();
		if(isCommenting) return;
		commentArticle();
	};

	const handleLikeArticle = () => {
		if(isLiking) return;
		likeArticle();
	};
	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}
	if(isError){
		toast.error(error.message);
		return;
	}
	if (isDeleting) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		)
	}
	return (
		<>
			<div className='flex flex-col w-full gap-3 items-start p-4 border-b border-gray-700'>
				{/* avatar of article owner */}
				<div className="flex h-auto w-full gap-2">
					<div className='avatar w-15'>
						<Link to={`/profile/${articleOwner?.username}`} className='w-15 rounded-full overflow-hidden'>
							<img src={articleOwner?.profilepic|| "/avatar-placeholder.png"} />
						</Link>
					</div>
					{/* info */}
					<div className='flex gap-2 w-full justify-between items-center'>
						<div>
							<Link to={`/profile/${articleOwner?.username}`} className='font-bold'>
								{articleOwner?.fullname}
							</Link>
							<span className='text-gray-700 flex gap-1 text-sm'>
								<Link to={`/profile/${articleOwner?.username}`}>@{articleOwner?.username}</Link>
								<span>·</span>
								<span>{formattedDate}</span>
							</span>
						</div>
						<div className="flex items-center gap-1">
							{/* add three dots */}
							<div className="dropdown dropdown-end">
								<div tabIndex="0" role="button" className="btn bg-transparent rounded-full border-none shadow-none hover:bg-gray-900 m-1"><BsThreeDotsVertical /></div>
								<ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
									{ isMyArticle && (
										<li><div className="text-red-500 hover:text-red-700 font-medium hover:font-bold" onClick={handleDeletePost}>Delete</div></li>
									)}
									<li><div className="text-blue-500 hover:text-blue-700 font-medium hover:font-bold" onClick={EditHandler}>Edit</div></li>
								</ul>
							</div>
							{/* follow botton */}
							
						</div>
						
					</div>
				</div>
					
				
				{/* article and info of article owner  */}
				<div className='flex flex-col flex-1 w-full'>
						{/* article */}
					<div className='flex flex-col gap-2 w-full overflow-hidden'>
						{article?.image && (
							<div className="flex items-center justify-center rounded-lg w-full p-5 h-90 border-b border-gray-700">
								<img
								src={article?.image}
								className='h-auto w-auto md:w-80% md:h-80% object-contain rounded-lg border border-gray-700'
								alt=''
							/>
							</div>
						)}
						<span className="text-md md:text-xl mt-2 border-b p-4 border-gray-700">{article?.Title}</span>
						<span className="text-sm md-text-md min-h-60 md:min-h-100 p-2">{article?.content}</span>
					</div>
						{/* options of article */}
					<div className='flex justify-centre mt-3'>
						<div className='flex gap-4 items-center mx-10 w-full justify-between'>
							{/* Comment icon */}
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + article?._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{article?.Comment.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${article?._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{article?.Comment.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{article?.Comment.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profilepic || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.Content}</div>
												</div>
											</div>
										))}
									</div>
									{/* comment form */}
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							{/* like */}
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikeArticle}>
								{!isLiked && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm text-slate-500 group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : ""
									}`}
								>
									{article?.likes.length}
								</span>
							</div>
							{/* Bookmark icon */}
							<div className='flex gap-1 items-center group cursor-pointer'
								onClick={()=>{
									toast.message("The Bookmark feature is Coming Soon..")
								}}>
								<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
							</div>
						</div>

					</div>
				</div>
			</div>
		</>
	);
};
export default ArticlePage;