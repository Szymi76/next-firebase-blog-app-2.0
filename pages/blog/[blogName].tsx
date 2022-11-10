import React, { useState, useEffect, useRef } from "react";
import Blog from "../../components/Blog";
import { Blog as BlogType, BlogComment } from "../../ts/BlogTypes";
import { useAuthUser } from "../../firebase/auth-hooks";
import { useRouter } from "next/router";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import * as Nav from "../../components/Nav";
import { Oval } from "react-loader-spinner";
import { db } from "../../firebase/firebase";
import {
  Square2StackIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import TimeAgo from "javascript-time-ago";
import pl from "javascript-time-ago/locale/pl";

const BlogPage = () => {
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [exists, setExists] = useState(true);

  const user = useAuthUser();
  const router = useRouter();

  const { blogName } = router.query;

  const commentInputRef = useRef<HTMLTextAreaElement>();

  console.log("RE-RENDER");

  // sprawdzanie czy blog istnieje, jest opublokowany i nie jest ukryty.
  useEffect(() => {
    if (!blogName) return;

    if (Array.isArray(blogName)) {
      setExists(false);
      return;
    }

    const blogRef = doc(db, "blogs", blogName);
    getDoc(blogRef).then(async snapshot => {
      if (!snapshot.exists() || !snapshot.data()?.public || snapshot.data()?.hidden) {
        setExists(false);
        return;
      }
      // @ts-ignore
      setBlog(() => {
        // @ts-ignore
        const freshBlog: BlogType = snapshot.data();
        const coms = freshBlog.comments
          .sort(
            (a, b) =>
              a.upvotes.length -
              a.downvotes.length -
              b.upvotes.length -
              b.downvotes.length
          )
          .reverse();
        return {
          ...freshBlog,
          comments: coms,
        };
      });
    });
  }, [blogName]);

  useEffect(() => {
    if (!user || !blog || !blogName || Array.isArray(blogName)) return;

    const blogRef = doc(db, "blogs", blogName);
    const views = blog.views.map(s => s.uid);
    if (!views.includes(user.uid)) {
      updateDoc(blogRef, {
        views: [...blog.views, { uid: user.uid, timestamp: +new Date() }],
      });
    }
  }, [user, blogName, blog]);

  // dodawanie komentarza
  const handleAddComment = async () => {
    const text = commentInputRef.current.value;
    if (!text || Array.isArray(blogName)) return;

    const commentObj: BlogComment = {
      authorUID: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      value: text,
      upvotes: [],
      downvotes: [],
      timestamp: +new Date(),
    };

    const docRef = doc(db, "blogs", blogName);
    updateDoc(docRef, {
      comments: [...blog.comments, commentObj],
    })
      .then(() => {
        console.log("Komentarz został dodany");
        commentInputRef.current.value = "";
        setBlog(blog => {
          return {
            ...blog,
            comments: [...blog.comments, commentObj],
          };
        });
      })
      .catch(err => console.error("Błąd podczas przesyłania komentarza"));
  };

  interface CommentProps {
    comment: BlogComment;
    index: number;
  }

  // komentarz
  const Comment = ({ comment, index }: CommentProps) => {
    TimeAgo.addLocale(pl);
    const timeAgo = new TimeAgo("pl");

    // @ts-ignore
    const docRef = doc(db, "blogs", blogName);

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
      <div className="comment">
        <div className="flex gap-2">
          <Image src={comment.photoURL} height={50} width={50} className="rounded-full" />
          <h4 className="font-semibold">{comment.displayName}</h4>
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
    );
  };

  return (
    <>
      <Nav.Normal />
      {blog ? (
        <>
          <Blog blog={blog} />
          <div id="blog-actions">
            <button
              id="copy-button"
              onClick={() => navigator.clipboard.writeText(location.href)}
            >
              <Square2StackIcon className="h-5" />
              Kopiuj link
            </button>
          </div>
          <section id="comment-section">
            <textarea
              ref={commentInputRef}
              className="textarea"
              placeholder="Napisz komentarz..."
            />
            <button className="button-solid float-right" onClick={handleAddComment}>
              Wyślij
            </button>
            {blog.comments.map((comment, i) => (
              <Comment key={"comment" + i} comment={comment} index={i} />
            ))}
          </section>
          <section id="blog-footer">
            <pre>
              <span>Szybki blog</span> - wszystkie prawa zastrzeżone
            </pre>
          </section>
        </>
      ) : (
        <>
          {exists ? (
            <div className="w-full h-[50vh] grid place-content-center">
              <Oval
                color="#7f56d9"
                secondaryColor="#7f56d9"
                strokeWidth={3}
                height={75}
              />
            </div>
          ) : (
            <div className="w-full h-[50vh] grid place-content-center">
              <h1 className="text-4xl font-semibold text-center">404</h1>
              <p className="text-gray-600">
                Blog nie istnieje lub nazwa została wpisana z błędem.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default BlogPage;
