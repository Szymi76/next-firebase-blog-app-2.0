import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { db } from "../firebase/firebase";
import { query, orderBy, limit, collection, getDocs, where } from "firebase/firestore";
import { useAnimateOnShow } from "../ts/useAnimateOnShow";
import Card from "../components/BlogCard";
import * as Nav from "../components/Nav";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import homeImage from "../public/home-image.jpg";
import firebaseLogo from "../public/logos/firebaselogo.svg";
import nextjsLogo from "../public/logos/nextjslogo.svg";
import reactLogo from "../public/logos/reactlogo.svg";
import tailwindcssLogo from "../public/logos/tailwindcsslogo.svg";
import githubLogo from "../public/logos/githublogo.svg";
import figmaLogo from "../public/logos/figmalogo.svg";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  const router = useRouter();

  useAnimateOnShow("home-card", "card-animation");
  useAnimateOnShow("tech-logo", "card-animation");

  // pobieranie czterech najbardziej polubianych blogów
  useEffect(() => {
    const blogsRef = collection(db, "blogs");
    const q = query(
      blogsRef,
      // where("hidden", "==", false),
      orderBy("likes", "desc"),
      limit(3)
    );
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
          <div id="text">
            <h1>Stwórz swój własny blog już dziś.</h1>
            <p>Wspiera cię kadra niezastapionych eksperów we wszystkich dziedzinach</p>
            <button onClick={() => router.push("/edytor")}>
              <span>Stwórz</span>
              <ArrowRightIcon className="h-6" />
            </button>
          </div>
        </section>
        {blogs.length >= 3 ? (
          <section className="second-section">
            <h1 className="title">Popularne</h1>
            {/* <Card blog={blogs[0]} size="large" className="home-card" /> */}
            <div className="small-cards">
              <Card blog={blogs[0]} size="small" className="home-card" />
              <Card blog={blogs[1]} size="small" className="home-card" />
              <Card blog={blogs[2]} size="small" className="home-card" />
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
          <h1>Technologie</h1>
          <div className="flex flex-wrap">
            <figure className="tech-logo">
              <a href="https://firebase.google.com" target={"_blank"}>
                <Image src={firebaseLogo} height={200} width={200} />
              </a>
            </figure>
            <figure className="tech-logo">
              <a href="https://nextjs.org" target={"_blank"}>
                <Image src={nextjsLogo} height={200} width={200} />
              </a>
            </figure>
            <figure className="tech-logo">
              <a href="https://reactjs.org" target={"_blank"}>
                <Image src={reactLogo} height={200} width={200} />
              </a>
            </figure>
            <figure className="tech-logo">
              <a href="https://tailwindcss.com/" target={"_blank"}>
                <Image src={tailwindcssLogo} height={200} width={200} />
              </a>
            </figure>
          </div>
        </section>
        {/* stopka */}
        <footer>
          <pre>
            <span>Szybki blog</span> - wszystkie prawa zastrzeżone
          </pre>
          <div className="flex gap-3 mt-5">
            <a
              href="https://github.com/Szymi76/next-firebase-blog-app-2.0"
              target={"_blank"}
            >
              <span>
                <Image src={githubLogo} height={30} width={30} />
                <p>Projekt</p>
              </span>
            </a>
            <a
              href="https://www.figma.com/file/X9BCsYwF8PsSw5iva4lYC4/Blog?node-id=0%3A1"
              target={"_blank"}
            >
              <span>
                <Image src={figmaLogo} height={30} width={30} />
                <p>Design</p>
              </span>
            </a>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
