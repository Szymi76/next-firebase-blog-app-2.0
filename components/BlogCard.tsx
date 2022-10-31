import React from "react";
import { Blog } from "../ts/BlogTypes";
// import Image from 'next';
import { CalendarIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthUser } from "../firebase/auth-hooks";

interface CardProps {
  blog: Blog;
  size: "small" | "large";
}

const Card = ({ blog, size }: CardProps) => {
  const user = useAuthUser();

  const handleLikesUpdate = async () => {
    const blogRef = doc(db, "blogs", blog.linkName);
    const likes = blog.likes.includes(user.uid)
      ? blog.likes.filter(l => l != user.uid)
      : [...blog.likes, user.uid];

    await updateDoc(blogRef, {
      likes: likes,
    });
  };

  return (
    <div className={`blog-card ${size == "small" ? "blog-card-small" : ""}`}>
      <img src={blog.image} className="image" />
      <div className="content">
        <div className="info">
          <p>{blog.authorUID.slice(0, 7)}...</p>
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
            <HeartIconSolid
              className="h-6 text-red-500 absolute right-0 cursor-pointer hover:brightness-90"
              onClick={handleLikesUpdate}
            />
          ) : (
            <HeartIcon
              className="h-6 text-gray-400 absolute right-0 cursor-pointer hover:text-red-500"
              onClick={handleLikesUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
