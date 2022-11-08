import React, { useEffect, useState } from "react";
import { Blog } from "../ts/BlogTypes";
// import Image from 'next';
import { CalendarIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthUser } from "../firebase/auth-hooks";
import { useRouter } from "next/router";

interface CardProps {
  blog: Blog;
  size: "small" | "large";
  className?: string;
}

const Card = ({ blog, size, className = "" }: CardProps) => {
  const user = useAuthUser();
  const [liked, setLiked] = useState(false);

  const router = useRouter();

  const handleLikesUpdate = async () => {
    if (!user) return;

    const blogRef = doc(db, "blogs", blog.linkName);
    const likes = liked
      ? blog.likes.filter(l => l.uid != user.uid)
      : [...blog.likes, { uid: user.uid, timestamp: +new Date() }];

    await updateDoc(blogRef, {
      likes: likes,
    }).then(() => setLiked(likes.map(e => e.uid).includes(user.uid)));
  };

  useEffect(() => {
    setLiked(blog.likes.map(e => e.uid).includes(user?.uid));
  }, [user, blog]);

  return (
    <div className={`blog-card ${className} ${size == "small" ? "blog-card-small" : ""}`}>
      <img
        src={blog.image}
        className="image"
        onClick={() => router.push(`/blog/${blog.linkName}`)}
      />
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
          {liked ? (
            <HeartIconSolid
              className="h-6 text-red-500 absolute bottom-6 right-6 cursor-pointer hover:brightness-90"
              onClick={handleLikesUpdate}
            />
          ) : (
            <HeartIconSolid
              className="h-6 text-gray-400 absolute bottom-6 right-6 cursor-pointer hover:text-red-500"
              onClick={handleLikesUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
