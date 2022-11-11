import TimeAgo from "javascript-time-ago";
import React, { useEffect, useState } from "react";
import { Blog, BlogComment } from "../ts/BlogTypes";
import { User } from "firebase/auth";
import pl from "javascript-time-ago/locale/pl";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface CommentProps {
  comment: BlogComment;
  index: number;
  linkName: string;
  user: User;
  blog: Blog;
  setBlog: any;
}

interface AuhorData {
  uid: string;
  displayName: string;
  photoURL: string;
}

const BlogComment = ({ comment, index, linkName, user, blog, setBlog }: CommentProps) => {
  const [author, setAuthor] = useState<AuhorData | null>(null);

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", comment.authorUID);
    // @ts-ignore
    getDoc(userDocRef).then(snap => setAuthor(snap.data()));
  }, [user]);

  TimeAgo.addLocale(pl);
  const timeAgo = new TimeAgo("pl");

  // @ts-ignore
  const docRef = doc(db, "blogs", linkName);

  const handleVoteChange = (type: "upvotes" | "downvotes") => {
    if (!user) return;
    const votes = comment[type];
    // komentarz do aktualizacji
    const updatedComment = {
      ...comment,
      [type]: votes.includes(user.uid)
        ? votes.filter(uid => uid != user.uid)
        : [...votes, user.uid],
    };

    // wszystkie komentarze bloga
    const comments = blog.comments.map((c, i) => {
      return i == index ? updatedComment : c;
    });

    // aktualizacja do firebase
    updateDoc(docRef, {
      comments: comments,
    })
      .then(() => {
        setBlog(blog => {
          return {
            ...blog,
            comments: comments,
          };
        });
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      {author ? (
        <div className="comment">
          <div className="flex gap-2">
            <Image
              src={author.photoURL}
              height={50}
              width={50}
              className="rounded-full"
            />
            <h4 className="font-semibold">{author.displayName}</h4>
          </div>
          <pre>{comment.value}</pre>
          <div className="flex gap-1 justify-between">
            <div className="flex gap-2">
              <span>
                <ChevronUpIcon
                  className={`h-6 cursor-pointer hover:text-purple-600 ${
                    comment.upvotes.includes(user?.uid) ? "text-purple-600" : ""
                  }`}
                  onClick={() => handleVoteChange("upvotes")}
                />
                <p>{comment.upvotes.length}</p>
              </span>
              <span>
                <ChevronDownIcon
                  className={`h-6 cursor-pointer hover:text-purple-600 ${
                    comment.downvotes.includes(user?.uid) ? "text-purple-600" : ""
                  }`}
                  onClick={() => handleVoteChange("downvotes")}
                />
                <p>{comment.downvotes.length}</p>
              </span>
            </div>
            <p className="text-gray-600">{timeAgo.format(comment.timestamp)}</p>
          </div>
        </div>
      ) : (
        <h1>Ladowanie...</h1>
      )}
    </>
  );
};

export default BlogComment;
