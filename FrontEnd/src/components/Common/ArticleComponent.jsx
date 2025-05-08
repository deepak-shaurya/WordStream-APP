import React from 'react';
import { Link } from 'react-router-dom';

function ArticleComponent({ Article }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-4 transition-transform hover:scale-[1.01]">
      <Link to={`/article/${Article._id}`}>
        <h2 className="text-lg md:text-xl font-semibold text-blue-700 dark:text-blue-400 hover:underline">
          {Article?.Title}
        </h2>
      </Link>
      <p className="text-sm md:text-md text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
        {Article?.content}
      </p>
      <div className="mt-3">
        <Link
          to={`/article/${Article._id}`}
          className="text-sm font-semibold text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}

export default ArticleComponent;
