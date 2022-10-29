import React, { useEffect, useState } from "react";
import { Blog } from "../ts/BlogTypes";
import { ExampleBlog } from "../ts/staticData";
import * as Nav from "../components/Nav";
import Image from "next/image";
import { CalendarIcon, HeartIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAuthUser } from "../firebase/auth-hooks";
import { initialState } from "../ts/blogReducer";

interface BlogProps {
  blog: Blog;
}

const Blog = ({ blog }: BlogProps) => {
  const user = useAuthUser();

  return (
    <main id="blog">
      <h1 id="title">{blog.title}</h1>
      <p id="description">{blog.description}</p>
      <div className="relative grid place-items-center h-full overflow-hidden max-h-[400px]">
        <img src={blog.image} className="absolute top-0 left-0 w-full -z-10 blur-lg " />
        <img src={blog.image} className="max-h-[400px]" />
      </div>
      <div id="bottom-info">
        <div>
          {blog.tags.map((tag, i) => (
            <p key={"tag" + i}>{tag}</p>
          ))}
        </div>
        <div>
          {user && blog.likes.includes(user.uid) ? (
            <HeartIconSolid className="h-6 text-red-500 mr-3" />
          ) : (
            <HeartIcon className="h-6 mr-3" />
          )}
          <span>
            <CalendarIcon className="h-6" />
            <pre>{new Date(blog.timestamp).toISOString().slice(0, 10)}</pre>
          </span>
        </div>
      </div>
      {blog.content.map((section, i) => {
        return (
          <section key={"section" + i} className="section">
            <h3>{section.title}</h3>
            {section.articles.map((article, j) => {
              return <p key={section.title + j}>{article.text}</p>;
            })}
            {section.image && (
              <img
                src={
                  typeof section.image == "string"
                    ? section.image
                    : URL.createObjectURL(section.image)
                }
                alt="blog-section-image"
              />
            )}
          </section>
        );
      })}
    </main>
  );
};

export default Blog;
