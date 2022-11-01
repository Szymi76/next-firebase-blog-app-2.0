import React, { useContext } from "react";
import { ActionTypes, BlogContext } from "../../ts/blogReducer";
import Card from "../../components/BlogCard";

const TestPage = () => {
  const { blog, dispatch } = useContext(BlogContext);

  return (
    <div className="p-10">
      <Card blog={blog} size="small" />
    </div>
  );
};

export default TestPage;
