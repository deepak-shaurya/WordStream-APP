import { useState } from "react";
import Articles from "../components/Common/Articles";

const Home = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='w-full mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-x border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>
				{/* POSTS */}
				{feedType === "following" && (
					<div>Currently not available</div>
				)}
				<Articles feedType={"forYou"}/>
			</div>
		</>
	);
};

export default Home