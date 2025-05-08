// import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { MdCreate } from "react-icons/md";
import { RiWordpressLine } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const cachedData = queryClient.getQueryData(["AuthUser"]);

	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await axios.post("/api/v1/user/logout",{},{withCredentials: true});
				const data = res;
				console.log(data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("logout Successfull");
			queryClient.invalidateQueries({ queryKey: ["AuthUser"] });
			queryClient.removeQueries(["AuthUser"]);
			
		},
		onError: (error) => {
			toast.error("Logout failed");
			console.error(error);
			
		},
	});

	
	if(!cachedData){
		return null;
	}
	
	const authUser = cachedData.data;

	const data = {
		fullName: "Guest User",
		username: "guestaccount",
	};

	return (
		<div className='max-w-6xl h-20 flex justify-between px-4 border border-gray-700'>
			<Link to='/' className='flex items-center justify-center'>
				<RiWordpressLine className="w-8 h-8"/>
			</Link>
			<ul className='flex items-centers gap-3 mt-4'>
				<li className='flex justify-center items-center'>
					<Link
						to='/'
						className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-2xl duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
					>
						<MdHomeFilled className='w-8 h-8 hidden md:block' />
						<span className='text-lg hidden md:block'>Home</span>
					</Link>
				</li>
				<li className='flex justify-center items-center'>
					<Link
						to='/notifications'
						className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-2xl duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
					>
						<IoNotifications className='w-6 h-6' />
						<span className='text-lg hidden md:block'>Notifications</span>
					</Link>
				</li>
				<li className='flex justify-center items-center'>
					<Link
						to='/create'
						className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-2xl duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
					>
						<MdCreate className='w-8 h-8'/>
						<span className='text-lg hidden md:block'>Create</span>
					</Link>
				</li>
			</ul>
			{data && (
				<Link
					to={`/profile/${authUser?.username|| data.username}`}
					className='sticky right-0 flex gap-2 items-center  transition-all duration-300 hover:bg-stone-900 py-2 px-4 rounded-2xl'
				>
					<div className='avatar hidden md:inline-flex'>
						<div className='w-8 h-8  rounded-full'>
							<img src={authUser?.profilepic || "/avatar-placeholder.png"} />
						</div>
					</div>
					<div className='flex justify-center flex-1'>
						<div className='hidden md:block'>
							<p className='text-white font-bold text-sm w-20 truncate'>{authUser?.fullname|| data.fullName}</p>
							<p className='text-slate-500 text-sm'>@{authUser?.username||data.username}</p>
						</div>
						<BiLogOut 
							className='w-5 h-5 cursor-pointer' 
							onClick={(e)=>{
								e.preventDefault();
								logout();
							}}
						/>
					</div>
				</Link>
			)}
		</div>
		
	);
};
export default Navbar;