import React, { useState, useEffect } from "react";
import Blog from "../../components/Blog";
import { Blog as BlogType } from "../../ts/BlogTypes";
import { useAuthUser } from "../../firebase/auth-hooks";
import { useRouter } from "next/router";
import { getDoc, doc } from "firebase/firestore";
import * as Nav from "../../components/Nav";
import { Oval } from "react-loader-spinner";
import { db } from "../../firebase/firebase";
import { Square2StackIcon } from "@heroicons/react/24/outline";

const BlogPage = () => {
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [exists, setExists] = useState(true);

  const user = useAuthUser();
  const router = useRouter();

  const { blogName } = router.query;

  // sprawdzanie czy blog istnieje, jest opublokowany i nie jest ukryty.
  useEffect(() => {
    if (!blogName) return;

    if (Array.isArray(blogName)) {
      setExists(false);
      return;
    }

    const blogRef = doc(db, "blogs", blogName);
    getDoc(blogRef).then(snapshot => {
      if (!snapshot.exists() || !snapshot.data()?.public || snapshot.data()?.hidden) {
        setExists(false);
        return;
      }
      // @ts-ignore
      setBlog(snapshot.data());
    });
  }, [blogName]);

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
