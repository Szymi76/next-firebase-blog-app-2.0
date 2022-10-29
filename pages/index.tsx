import React, { useEffect, useReducer, useRef, useState } from "react";
import { initialState, blogReducer, ActionTypes } from "../ts/blogReducer";
import * as Nav from "../components/Nav";
import homeImage from "../public/home-image.jpg";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Card from "../components/BlogCard";
import { ExampleBlog } from "../ts/staticData";
import Link from "next/link";

const Home = () => {
  const [blog, dispatch] = useReducer(blogReducer, initialState);

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
            <button>
              <span>Stwórz</span>
              <ArrowRightIcon className="h-6" />
            </button>
          </div>
        </section>
        <section className="second-section">
          <h1 className="title">Popularne</h1>
          <Card blog={ExampleBlog} size="large" />
          <div className="small-cards">
            <Card blog={ExampleBlog} size="small" />
            <Card blog={ExampleBlog} size="small" />
            <Card blog={ExampleBlog} size="small" />
            <Link href={"/"}>
              <button>
                <span>Zobacz wszystkie</span>
                <ArrowRightIcon className="h-5" />
              </button>
            </Link>
          </div>
        </section>
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
