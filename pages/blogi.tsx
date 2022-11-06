import React, { useState, useEffect, useMemo, useRef } from "react";
import { query, orderBy, limit, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Card from "../components/BlogCard";
import * as Nav from "../components/Nav";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  XMarkIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Blog } from "../ts/BlogTypes";
import CardRow from "../components/BlogCardRow";

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
  const [view, setView] = useState<"normal" | "row">("normal");

  const tagInputRef = useRef<HTMLInputElement>();

  // aktualizacja filtrowanych blogów podczas zmiany filtrów
  const filteredBlogs = useMemo(() => {
    const b1 = blogs.filter(b =>
      b.title.toLocaleLowerCase().includes(filters.query.toLocaleLowerCase())
    );
    const b2 = b1.filter(b => filters.tags.every(t => b.tags.includes(t)));
    const b3 =
      filters.likesASC !== null
        ? filters.likesASC
          ? b2.sort((a, b) => a.likes.length - b.likes.length)
          : b2.sort((a, b) => b.likes.length - a.likes.length)
        : b2;

    return filters.latestASC !== null
      ? filters.latestASC
        ? b2.sort((a, b) => a.timestamp - b.timestamp)
        : b2.sort((a, b) => b.timestamp - a.timestamp)
      : b2;
  }, [filters, blogs]);

  // pobieranie blogów z bazy danych
  useEffect(() => {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, orderBy("likes", "desc"));
    getDocs(q).then(snapshot => {
      const arr = [];
      snapshot.forEach(doc => arr.push(doc.data()));
      setBlogs(arr);
    });
  }, []);

  // zmiana aktualnego wyszukiwania
  const handleQueryChange = e => {
    setFilters(filters => {
      return { ...filters, query: e.target.value };
    });
  };

  // usuwanie tagów
  const handleTagRemove = (e, i) => {
    setFilters(filters => {
      return {
        ...filters,
        tags: filters.tags.filter((t, j) => i != j),
      };
    });
  };

  // zmiana filtrowanie po polubieniach
  const handleLikesChange = () => {
    setFilters(filters => {
      return { ...filters, likesASC: !filters.likesASC, latestASC: null };
    });
  };

  // zmiana sortowania po najwcześniej utworzonych
  const handleLeatestChange = () => {
    setFilters(filters => {
      return { ...filters, latestASC: !filters.latestASC, likesASC: null };
    });
  };

  // dodawanie tagów
  const handleTagAdd = () => {
    if (filters.tags.length == 3) return;
    setFilters(filters => {
      return {
        ...filters,
        tags: [...filters.tags, tagInputRef.current.value],
      };
    });
  };

  const toggleView = () => {
    setView(view => (view == "normal" ? "row" : "normal"));
  };

  return (
    <>
      <Nav.Normal />
      <main className="p-3 flex flex-col flex-wrap mt-12 gap-3">
        <div id="blogs-options">
          <div>
            <span className="input-with-icon relative">
              <MagnifyingGlassIcon className="h-7 text-gray-500" />
              <input type="text" placeholder="Szukaj" onChange={handleQueryChange} />
            </span>
          </div>
          <div>
            <button
              className={`button-solid ${
                filters.likesASC !== null ? "text-white" : "button-white"
              }`}
              onClick={handleLikesChange}
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
              onClick={handleLeatestChange}
            >
              <p>Najnowsze</p>
              {filters.latestASC ? (
                <BarsArrowUpIcon className="h-7" />
              ) : (
                <BarsArrowDownIcon className="h-7" />
              )}
            </button>
          </div>
          <div className="relative">
            <span className="input-with-icon ">
              <MagnifyingGlassIcon className="h-7 text-gray-500" />
              <input type="text" placeholder="Tag" maxLength={15} ref={tagInputRef} />
            </span>
            <button className="button-solid" onClick={handleTagAdd}>
              <p>Dodaj tag</p>
            </button>
            <span className="absolute -bottom-9 left-0">
              {filters.tags.map((tag, i) => (
                <p key={tag + i} className="tag">
                  <span>{tag.length > 8 ? tag.slice(0, 7) + "..." : tag}</span>
                  <XMarkIcon
                    className="h-5 hover:text-red-500 cursor-pointer"
                    onClick={e => handleTagRemove(e, i)}
                  />
                </p>
              ))}
            </span>
          </div>
        </div>

        <div className="flex justify-end w-full max-w-[1400px] mx-auto">
          <Squares2X2Icon className="h-9 cursor-pointer" onClick={toggleView} />
        </div>

        <section className="max-w-[1450px] w-full flex flex-wrap justify-center mx-auto gap-2">
          {filteredBlogs.map((blog, i) => (
            <>
              {view == "normal" ? (
                <Card key={"blog" + i} blog={blog} size="small" />
              ) : (
                <CardRow key={"blog" + i} blog={blog} />
              )}
            </>
          ))}
        </section>
      </main>
    </>
  );
};

export default Blogs;
