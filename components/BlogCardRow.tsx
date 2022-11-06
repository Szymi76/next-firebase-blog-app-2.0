import React, { useEffect, useState } from "react";
import { Blog } from "../ts/BlogTypes";
// import Image from 'next';
import { CalendarIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthUser } from "../firebase/auth-hooks";
import { useRouter } from "next/router";

interface CardRowProps {
  blog: Blog;
  className?: string;
}

const CardRow = ({ blog, className = "" }: CardRowProps) => {
  const user = useAuthUser();
  const [liked, setLiked] = useState(false);

  const router = useRouter();

  const handleLikesUpdate = async () => {
    if (!user) return;

    const blogRef = doc(db, "blogs", blog.linkName);
    const likes = liked
      ? blog.likes.filter(l => l != user.uid)
      : [...blog.likes, user.uid];

    await updateDoc(blogRef, {
      likes: likes,
    }).then(() => setLiked(likes.includes(user?.uid)));
  };

  useEffect(() => {
    setLiked(blog.likes.includes(user?.uid));
  }, [user]);

  return (
    <div className={`card-row ${className}`}>
      <h2 onClick={() => router.push(`/${blog.linkName}`)}>
        {blog.title.length > 20 ? `${blog.title.slice(0, 20)}...` : blog.title}
      </h2>
      <h2>
        {blog.authorUID.length > 10
          ? `${blog.authorUID.slice(0, 10)}...`
          : blog.authorUID}
      </h2>
      <h2>{new Date(blog.timestamp).toISOString().slice(0, 10)}</h2>
      <HeartIconSolid
        className={`h-7 ${
          liked ? "text-red-500" : "text-gray-600"
        } cursor-pointer hover:text-red-500`}
        onClick={handleLikesUpdate}
      />
      <span>
        <p>{blog.tags[0]}</p>
        {blog.tags.length > 1 && <p>{blog.tags[1]}</p>}
        {blog.tags.length > 2 && "..."}
      </span>
    </div>
  );
};

export default CardRow;
