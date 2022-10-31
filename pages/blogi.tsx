import React, { useState, useEffect } from "react";
import { query, orderBy, limit, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Card from "../components/BlogCard";
import * as Nav from "../components/Nav";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, orderBy("likes", "desc"));
    getDocs(q).then(snapshot => {
      const arr = [];
      snapshot.forEach(doc => arr.push(doc.data()));
      setBlogs(arr);
    });
  }, []);
  return (
    <>
      <Nav.Normal />
      <main className="p-3 flex flex-wrap mt-12 gap-3">
        {blogs.map((blog, i) => (
          <Card key={"blog" + i} blog={blog} size="small" />
        ))}
      </main>
    </>
  );
};

export default Blogs;
