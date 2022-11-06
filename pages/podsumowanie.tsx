import React, { useState, useEffect, useContext, useRef } from "react";
import * as Nav from "../components/Nav";
import { useMouseHold } from "../ts/useMouseHold";
import { ActionTypes, BlogContext } from "../ts/blogReducer";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import * as Button from "../components/Button";
import Blog from "../components/Blog";
import Form from "../components/Form";
import { useAuthUser } from "../firebase/auth-hooks";
import { Oval } from "react-loader-spinner";
import { useRouter } from "next/router";
import Modal from "../components/Modal";
import { uploadContentImages, uploadFile } from "../firebase/functions";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { Blog as BlogType } from "../ts/BlogTypes";

const Summary = () => {
  const { blog, dispatch } = useContext(BlogContext);

  const [loading, setLoading] = useState(false);

  const user = useAuthUser();

  const router = useRouter();

  const tagInputRef = useRef<HTMLInputElement>();
  const linkNameInputRef = useRef<HTMLInputElement>();

  // przekierowanie niezalogowanego użytkownika
  useEffect(() => {
    if (user === null) router.replace("/zaloguj-sie");
  }, [user]);

  // zapobieganie przed odświeżeniem strony
  useEffect(() => {
    const handleBeforeunload = e => {
      e.preventDefault();
      return (e.returnValue = "");
    };

    window.addEventListener("beforeunload", handleBeforeunload);
    return () => window.removeEventListener("beforeunload", handleBeforeunload);
  }, []);

  // usuwanie taga
  const handleTagRemove = (index: number) => {
    if (blog.tags.length == 1) return;
    const newTags = blog.tags.filter((e, i) => i != index);
    dispatch({ type: ActionTypes.TAGS, payload: newTags });
  };

  // dodawanie taga
  const handleAddTag = () => {
    const tag = tagInputRef.current.value;
    if (tag.length < 4 || blog.tags.length >= 5) return;
    const newTags = [...blog.tags, tag];
    dispatch({ type: ActionTypes.TAGS, payload: newTags });
  };

  // upload bloga do firebase
  const uploadBlog = async () => {
    const linkName = linkNameInputRef.current.value;
    if (linkName.length < 4) return;
    setLoading(true);
    const filesArr = blog.content.map(e => e.image);
    const urls = await uploadContentImages(linkName, filesArr);
    const titleImage = await uploadFile(blog.image, linkName + "_main");
    const blogRef = doc(db, "blogs", linkName);

    // dispatch({ type: ActionTypes.BLOG_IMAGE, payload: titleImage });

    // blog.content.forEach((section, i) => {
    //   dispatch({ type: ActionTypes.IMAGE, payload: { newValue: urls[i], i: i } });
    // });

    // dispatch({
    //   type: ActionTypes.FINAL_DATA,
    //   payload: { authorUID: user.uid, tags: blog.tags, timestamp: +new Date() },
    // });

    const blogObj: BlogType = {
      ...blog,
      content: blog.content.map((s, i) => {
        return { ...s, image: urls[i] };
      }),
      image: titleImage,
      authorUID: user.uid,
      timestamp: +new Date(),
      linkName: linkName,
      public: true,
    };

    // DEBUG
    console.log(blogObj);

    await setDoc(blogRef, blogObj)
      .then(() => {
        setLoading(false);
        router.push("/");
      })
      .catch(err => {
        setLoading(false);
      });
  };

  return (
    <>
      <Nav.Dev />
      {user ? (
        <div id="summary-wrapper">
          <main id="summary">
            <div id="summary-title">Podsumowanie</div>
            <div id="summary-content">
              {/* wstęp */}
              <div className="summary-row">
                <p className="font-semibold">Ostatnie dane do przesłania bloga</p>
                <p className="text-sm text-gray-500">
                  Tutaj wypełniasz wszystkie ostatnie wymagane dane do przesłania bloga do
                  bazy danych.
                </p>
              </div>
              {/* link */}
              <div className="summary-row flex ">
                <p className="text-gray-500 min-w-[25%]">Nazwa widoczna w linku</p>
                <div className="input-with-label max-w-2xl h-min">
                  <p>{`${location.origin}/blog/`}</p>
                  {/* <p>{`http://localhost:3000/blog/`}</p> */}
                  <input type="text" ref={linkNameInputRef} />
                </div>
              </div>
              {/* tagi */}
              <div className="summary-row flex">
                <p className="text-gray-500 min-w-[25%]">Tagi</p>
                <div className="flex flex-col">
                  <div className="flex">
                    <input className="input-normal" ref={tagInputRef} />
                    <Button.Solid
                      children={"Dodaj"}
                      className="ml-2"
                      onClick={handleAddTag}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-3">
                    {blog.tags.map((tag, i) => (
                      <span key={"tag" + i} className="summary-tag">
                        <p>{tag}</p>
                        <XMarkIcon
                          className="h-5 hover:text-red-500"
                          onClick={() => handleTagRemove(i)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* przyciski */}
              <div className="absolute w-full p-10 bottom-0 left-0 flex justify-between">
                <div className="flex gap-2">
                  <Button.Solid
                    children={"Wróć do edycji"}
                    onClick={() => router.back()}
                  />
                  <Button.Solid children={"Podgląd w nowej karcie"} />
                </div>
                {loading ? (
                  <Oval
                    color="#7f56d9"
                    secondaryColor="#7f56d9"
                    strokeWidth={3}
                    height={35}
                  />
                ) : (
                  <Button.Solid children={"Prześlij"} onClick={uploadBlog} />
                )}
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="w-full h-[50vh] grid place-content-center">
          <Oval color="#7f56d9" secondaryColor="#7f56d9" strokeWidth={3} height={75} />
        </div>
      )}
    </>
  );
};

export default Summary;
