import React, { useState, useEffect, useRef } from "react";
import Blog from "../../components/Blog";
import { Blog as BlogType, BlogComment as BlogCommentType } from "../../ts/BlogTypes";
import { useAuthUser } from "../../firebase/auth-hooks";
import { useRouter } from "next/router";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import * as Nav from "../../components/Nav";
import { Oval } from "react-loader-spinner";
import { db } from "../../firebase/firebase";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import BlogComment from "../../components/BlogComment";

const BlogPage = () => {
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [exists, setExists] = useState(true);

  const user = useAuthUser();
  const router = useRouter();

  const { blogName } = router.query;
  const commentInputRef = useRef<HTMLTextAreaElement>();

  // sprawdzanie czy blog istnieje, jest opublokowany i nie jest ukryty.
  useEffect(() => {
    if (!blogName) return;

    if (Array.isArray(blogName)) {
      setExists(false);
      return;
    }

    const blogRef = doc(db, "blogs", blogName);
    getDoc(blogRef).then(async snapshot => {
      // zaznaczanie bloga jako nieistniejący
      if (!snapshot.exists() || !snapshot.data()?.public || snapshot.data()?.hidden) {
        setExists(false);
        return;
      }

      // ustawianie bloga wraz ze sortowaniem komentarzy
      setBlog(() => {
        // @ts-ignore
        const freshBlog: BlogType = snapshot.data();
        const comments = sortCommentsByVotes(freshBlog.comments);
        return { ...freshBlog, comments };
      });
    });
  }, [blogName]);

  // aktualizacja zobaczeń aktualnego bloga
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

    // objekt komentarza
    const commentObj: BlogCommentType = {
      authorUID: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      value: text,
      upvotes: [],
      downvotes: [],
      timestamp: +new Date(),
    };

    // dodawanie nowego komentarza do firebase
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
              <BlogComment
                key={"comment" + i}
                comment={comment}
                index={i}
                blog={blog}
                // @ts-ignore
                linkName={blogName}
                user={user}
                setBlog={setBlog}
              />
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

// sortowanie komentarzy po głosach
function sortCommentsByVotes(coms: BlogCommentType[]) {
  return coms
    .sort(
      (a, b) =>
        a.upvotes.length - a.downvotes.length - b.upvotes.length - b.downvotes.length
    )
    .reverse();
}
