import React from "react";
import { Blog } from "../ts/BlogTypes";
import Image from "next/image";
import { CalendarIcon, HeartIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAuthUser } from "../firebase/auth-hooks";

const placeholderImageURL =
  "https://cdn.corporate.walmart.com/dims4/WMT/572511c/2147483647/strip/true/crop/1920x1066+0+7/resize/980x544!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2F7b%2F66%2F142c151b4cd3a19c13e1ca65f193%2Fbusinessfornature-banner.png";

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
        <img
          src={
            typeof blog.image == "string" ? blog.image : URL.createObjectURL(blog.image)
          }
          className="absolute top-0 left-0 w-full -z-10 blur-lg"
        />
        {/* <Image
          src={blog.image}
          height={400}
          width={900}
          className="absolute top-0 left-0 w-full -z-10 blur-lg"
          objectFit={"cover"}
          loading="lazy"
          placeholder="blur"
          blurDataURL={placeholderImageURL}
          layout="responsive"
        /> */}
        <img
          src={
            typeof blog.image == "string" ? blog.image : URL.createObjectURL(blog.image)
          }
          className="max-h-[400px]"
        />
        {/* <Image
          src={blog.image}
          height={350}
          width={350}
          className="max-h-[400px]"
          objectFit={"cover"}
          loading="lazy"
          placeholder="blur"
          blurDataURL={placeholderImageURL}
          layout="responsive"
        /> */}
      </div>
      <div id="bottom-info">
        <div>
          {blog.tags.map((tag, i) => (
            <p key={"tag" + i}>{tag}</p>
          ))}
        </div>
        <div>
          {user && blog.likes.map(l => l.uid).includes(user.uid) ? (
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
