import React, { useState, useEffect, useMemo, useRef } from "react";
import { query, orderBy, limit, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Card from "../components/BlogCard";
import * as Nav from "../components/Nav";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/24/outline";
import { Blog } from "../ts/BlogTypes";

interface FilterTypes {
  query: string;
  likesASC: boolean | null;
  latestASC: boolean | null;
  tags: string[];
}

const initialFilter: FilterTypes = {
  query: "",
  likesASC: false,
  latestASC: null,
  tags: [],
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filters, setFilters] = useState(initialFilter);

  const tagInputRef = useRef<HTMLInputElement>();

  const filteredBlogs = useMemo(() => {
    const b1 = blogs.filter(b => b.title.includes(filters.query));
    const b2 = b1.filter(b => filters.tags.every(t => b.tags.includes(t)));
    const b3 =
      filters.likesASC !== null
        ? filters.likesASC
          ? b2.sort((a, b) => b.likes.length - a.likes.length)
          : b2.sort((a, b) => a.likes.length - b.likes.length)
        : b2;

    return filters.latestASC !== null
      ? filters.latestASC
        ? b2.sort((a, b) => b.timestamp - a.timestamp)
        : b2.sort((a, b) => a.timestamp - b.timestamp)
      : b2;
  }, [filters, blogs]);

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
        <div id="blogs-options">
          <div>
            <span className="input-with-icon relative">
              <MagnifyingGlassIcon className="h-7 text-gray-500" />
              <input
                type="text"
                placeholder="Szukaj"
                onChange={e =>
                  setFilters(filters => {
                    return { ...filters, query: e.target.value };
                  })
                }
              />
              <span className="absolute -bottom-9 left-0">
                {filters.tags.map((tag, i) => (
                  <p
                    key={tag + i}
                    className="tag"
                    onClick={() =>
                      setFilters(filters => {
                        return {
                          ...filters,
                          tags: filters.tags.filter((t, j) => i != j),
                        };
                      })
                    }
                  >
                    {tag}
                  </p>
                ))}
              </span>
            </span>
            <button
              className={`button-solid ${
                filters.likesASC !== null ? "text-white" : "button-white"
              }`}
              onClick={() =>
                setFilters(filters => {
                  return { ...filters, likesASC: !filters.likesASC, latestASC: null };
                })
              }
            >
              <p>Polubienia</p>
              {filters.likesASC ? (
                <BarsArrowUpIcon className="h-7" />
              ) : (
                <BarsArrowDownIcon className="h-7" />
              )}
            </button>
            <button
              className={`button-solid ${
                filters.latestASC !== null ? "text-white" : "button-white"
              }`}
              onClick={() =>
                setFilters(filters => {
                  return { ...filters, latestASC: !filters.latestASC, likesASC: null };
                })
              }
            >
              <p>Najnowsze</p>
              {filters.latestASC ? (
                <BarsArrowUpIcon className="h-7" />
              ) : (
                <BarsArrowDownIcon className="h-7" />
              )}
            </button>
          </div>
          <div>
            <span className="input-with-icon ">
              <MagnifyingGlassIcon className="h-7 text-gray-500" />
              <input type="text" placeholder="Tag" ref={tagInputRef} />
            </span>
            <button
              className="button-solid"
              onClick={() =>
                setFilters(filters => {
                  return {
                    ...filters,
                    tags: [...filters.tags, tagInputRef.current.value],
                  };
                })
              }
            >
              <p>Dodaj tag</p>
            </button>
          </div>
        </div>

        <section className="max-w-[1450px] w-full flex flex-wrap justify-center mx-auto gap-2">
          {filteredBlogs.map((blog, i) => (
            <Card key={"blog" + i} blog={blog} size="small" />
          ))}
        </section>
      </main>
    </>
  );
};

export default Blogs;
