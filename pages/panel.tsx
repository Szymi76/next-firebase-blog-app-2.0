import React, { useEffect, useState, useContext } from "react";
import SettingsWrapper from "../components/SettingsWrapper";
import {
  Squares2X2Icon,
  TrashIcon,
  RocketLaunchIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthUser } from "../firebase/auth-hooks";
import Card from "../components/BlogCard";
import CardRow from "../components/BlogCardRow";
import { ActionTypes, BlogContext } from "../ts/blogReducer";
import { Blog } from "../ts/BlogTypes";

const Panel = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [view, setView] = useState<"normal" | "row">("normal");

  const { blog, dispatch } = useContext(BlogContext);

  const user = useAuthUser();

  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("authorUID", "==", user.uid));
    getDocs(q).then(snapshot => {
      const arr = [];
      snapshot.forEach(doc => arr.push(doc.data()));
      console.log(arr);
      setBlogs(arr);
    });
  }, [user]);

  const handleEdit = (index: number) => {
    dispatch({ type: ActionTypes.BLOG, payload: blogs[index] });
    router.push("/edytor", undefined, { shallow: true });
  };
  const handlePublish = (index: number) => {
    dispatch({ type: ActionTypes.BLOG, payload: blogs[index] });
    router.push("/podsumowanie", undefined, { shallow: true });
  };
  const handleRemove = async (index: number) => {
    const blogRef = doc(db, "blogs", blogs[index].linkName);
    await deleteDoc(blogRef);
  };

  const toggleView = () => {
    setView(view => (view == "normal" ? "row" : "normal"));
  };

  useEffect(() => {
    console.log(blog);
  }, [blog]);

  return (
    <SettingsWrapper>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <hr />
      <div className="flex justify-between max-w-[1300px]">
        <div>
          <h3 className="font-semibold">Utworzone blogi</h3>
          <p className="text-sm text-gray-600">
            Tutuaj możesz edytować i publikować swoje blogi.
          </p>
        </div>
        <Squares2X2Icon className="h-9" onClick={toggleView} />
      </div>
      <main className="max-w-[1300px] w-full flex flex-wrap justify-center mt-7 gap-2">
        {blogs.map((blog, i) => (
          <div
            className={`relative flex min-w-[350px] mb-14 bg-white ${
              view == "row" ? "w-full" : ""
            }`}
          >
            {view == "normal" ? (
              <Card key={"blog" + i} blog={blog} size="small" />
            ) : (
              <CardRow key={"blog" + i} blog={blog} />
            )}
            <span className="absolute -bottom-7 right-0">
              <PencilSquareIcon
                className="h-6 hover:brightness-90 cursor-pointer"
                onClick={() => handleEdit(i)}
                title="Edytuj"
              />
              <RocketLaunchIcon
                className="h-6 text-blue-500 hover:brightness-90 cursor-pointer"
                onClick={() => handlePublish(i)}
                title="Publikuj"
              />
              <TrashIcon
                className="h-6 text-red-500 hover:brightness-90 cursor-pointer"
                onClick={() => handleRemove(i)}
                title="Usuń"
              />
              {/* <p>{blog.public ? "PUBLICZNY" : "NIEPUBLICZNY"}</p> */}
            </span>
          </div>
        ))}
      </main>
    </SettingsWrapper>
  );
};

export default Panel;
