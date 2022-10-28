import React from "react";
import { Blog } from "../ts/BlogTypes";
// import Image from 'next';
import { CalendarIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

interface CardProps {
  blog: Blog;
  size: "small" | "large";
}

const Card = ({ blog, size }: CardProps) => {
  return (
    <div className={`blog-card ${size == "small" ? "blog-card-small" : ""}`}>
      <img src={blog.image} className="image" />
      <div className="content">
        <div className="info">
          <p>{blog.authorUID}</p>
          <span className="flex gap-1">
            <CalendarIcon className="h-5" />
            <p>{new Date(blog.timestamp).toISOString().slice(0, 10)}</p>
          </span>
        </div>
        <h1 className="title">{blog.title}</h1>
        <p className="description">{blog.description}</p>
        <div className="tags">
          {blog.tags.map((tag, index) => {
            return <p key={"tag" + blog.authorUID + index}>{tag}</p>;
          })}
          {blog.likes.includes(blog.authorUID) ? (
            <HeartIconSolid className="h-6 text-red-500 absolute right-0" />
          ) : (
            <HeartIcon className="h-6 text-gray-400 absolute right-0" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
