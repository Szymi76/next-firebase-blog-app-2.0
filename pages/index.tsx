import React, { useEffect, useReducer, useRef, useState } from "react";
import * as Nav from "../components/Nav";
import homeImage from "../public/home-image.jpg";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Card from "../components/BlogCard";
import { ExampleBlog } from "../ts/staticData";
import Link from "next/link";
import { useRouter } from "next/router";
import { query, orderBy, limit, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, orderBy("likes", "desc"), limit(4));
    getDocs(q).then(snapshot => {
      const arr = [];
      snapshot.forEach(doc => arr.push(doc.data()));
      setBlogs(arr);
    });
  }, []);

  return (
    <>
      <Nav.Normal transparent={true} />
      <main id="home">
        <section className="first-section">
          <img
            src={homeImage.src}
            className="h-screen object-cover w-full"
            alt="computer-image"
          />
          <div>
            <h1>Stwórz swój własny blog już dziś.</h1>
            <p>Wspiera cię kadra niezastapionych eksperów we wszystkich dziedzinach</p>
            <button onClick={() => router.push("/edytor")}>
              <span>Stwórz</span>
              <ArrowRightIcon className="h-6" />
            </button>
          </div>
        </section>
        {blogs.length >= 4 ? (
          <section className="second-section">
            <h1 className="title">Popularne</h1>
            <Card blog={blogs[0]} size="large" />
            <div className="small-cards">
              <Card blog={blogs[1]} size="small" />
              <Card blog={blogs[2]} size="small" />
              <Card blog={blogs[3]} size="small" />
              <Link href={"/blogi"}>
                <button>
                  <span>Zobacz wszystkie</span>
                  <ArrowRightIcon className="h-5" />
                </button>
              </Link>
            </div>
          </section>
        ) : (
          <h1>Ladowanie</h1>
        )}
        <section className="third-section">
          <pre>
            <span>Szybki blog</span> - wszystkie prawa zastrzeżone
          </pre>
        </section>
      </main>
    </>
  );
};

export default Home;
