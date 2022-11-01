import React, { useState, useEffect } from "react";
import Blog from "../../components/Blog";
import { Blog as BlogType } from "../../ts/BlogTypes";
import { useAuthUser } from "../../firebase/auth-hooks";
import { useRouter } from "next/router";
import { getDoc, doc } from "firebase/firestore";
import { ExampleBlog } from "../../ts/staticData";
import * as Nav from "../../components/Nav";
import { Oval } from "react-loader-spinner";
import { db } from "../../firebase/firebase";

const BlogPage = () => {
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [exists, setExists] = useState(true);

  const user = useAuthUser();

  const router = useRouter();

  const { blogName } = router.query;

  useEffect(() => {
    if (!blogName) return;

    if (Array.isArray(blogName)) {
      setExists(false);
      return;
    }

    const blogRef = doc(db, "blogs", blogName);
    getDoc(blogRef).then(snapshot => {
      if (!snapshot.exists()) {
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
          <section id="blog-footer">
            <pre>
              <span>Szybki blog</span> - wszystkie prawa zastrzeżone
            </pre>
          </section>
        </>
      ) : (
        <div className="w-full h-[50vh] grid place-content-center">
          <Oval color="#7f56d9" secondaryColor="#7f56d9" strokeWidth={3} height={75} />
        </div>
      )}
    </>
  );
};

export default BlogPage;
