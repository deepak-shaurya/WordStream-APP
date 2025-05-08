import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ArticleComponent from "./ArticleComponent";

const Articles = ({feedType, username}) => {
    const getPostEndpoint = () => {
		// case "following":
		// 		return "/api/v1/article/following"
		switch (feedType) {
			case "All":
				return "/api/v1/article/all";
			case "User":
				return `/api/v1/article/user/${username}`;
			default:
				return "/api/v1/article/all";
		}
	};
    const POST_ENDPOINT = getPostEndpoint();

    const {
		data : articles,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["articles"],
		queryFn: async () => {
			try {
				const res = await axios.get(POST_ENDPOINT);
				const data = res.data;
				// console.log(data, "in query");
				return data;
			} catch (error) {
				throw error;
			}
		},
	});
    useEffect(()=>{
		refetch();
	},[feedType, refetch, username]);
	// console.log(articles, "from Articles");
	
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && articles?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!articles && (
				<div>
					not fund
				</div>
			)}
			{!isLoading && articles && (
 				<div className="flex flex-col gap-4 p-4 h-screen overflow-y-auto border-l border-r border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
    				{articles.map((article) => (
      					<ArticleComponent key={article._id} Article={article} />
    				))}
  				</div>
			)}

		</>
	);
};
export default Articles;