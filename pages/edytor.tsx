import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthUser } from "../firebase/auth-hooks";
import { uploadContentImages, uploadFile } from "../firebase/functions";
import { useMouseHold } from "../ts/useMouseHold";
import { ActionTypes, BlogContext } from "../ts/blogReducer";
import { Blog as BlogType } from "../ts/BlogTypes";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Oval } from "react-loader-spinner";
import Blog from "../components/Blog";
import Form from "../components/Form";
import Modal from "../components/Modal";
import * as Button from "../components/Button";
import * as Nav from "../components/Nav";

const Edytor = () => {
  const [hold, event] = useMouseHold("resizer");
  const [width, setWidth] = useState(50);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const { blog, dispatch } = useContext(BlogContext);

  const user = useAuthUser();
  const router = useRouter();

  // ustawianie % długości podczas ruszaniem resizerem
  useEffect(() => {
    if (!event) return;
    setWidth(widthCorrection(event));
  }, [event]);

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

  // upload bloga do firebase
  const handleBlogSave = async () => {
    const linkName =
      blog.linkName.length > 0 ? blog.linkName : `${user.uid}-${Math.random()}`;

    // dane potrzebne do zapisania bloga
    const filesArr = blog.content.map(e => e.image);
    const urls = await uploadContentImages(linkName, filesArr);
    const titleImage = await uploadFile(blog.image, linkName + "_main");
    const blogRef = doc(db, "blogs", `${linkName}`);

    // objekt bloga
    const blogObj: BlogType = {
      ...blog,
      content: blog.content.map((s, i) => {
        return { ...s, image: urls[i] };
      }),
      image: titleImage,
      authorUID: user.uid,
      timestamp: +new Date(),
      linkName: linkName,
    };

    // upload zapisanego bloga
    await setDoc(blogRef, blogObj)
      .then(() => {
        console.log("Blog został zapisany");
      })
      .catch(err => {});
  };

  return (
    <>
      <Nav.Dev />
      {user ? (
        <main id="editor-wrapper">
          <div id="editor">
            <section id="editor-title">
              <h1>{blog.title}</h1>
              <PencilIcon className="h-6" />
            </section>
            <section id="options">
              <div>
                <Button.Solid
                  className="editor-button"
                  children="Editor max"
                  onClick={() => setWidth(100)}
                />
                <Button.Solid
                  className="editor-button"
                  children="50 / 50"
                  onClick={() => setWidth(50)}
                />
                <Button.Solid
                  className="editor-button"
                  children="Editor min"
                  onClick={() => setWidth(0)}
                />
              </div>
              <div>
                <button className="editor-button button-solid" onClick={handleBlogSave}>
                  Zapisz
                </button>
                <button
                  className="editor-button button-solid disabled:brightness-[80%]"
                  onClick={() => setShowModal(true)}
                  disabled={blog.public}
                >
                  Prześlj
                </button>
              </div>
            </section>
            <section id="container" className="resizer">
              <div id="form" style={{ width: `${width}%` }}>
                <Form />
              </div>
              <div id="resizer"></div>
              <div id="blog-editor" style={{ width: `${100 - width}%` }}>
                <Blog blog={blog} />
              </div>
            </section>
          </div>
        </main>
      ) : (
        <div className="w-full h-[50vh] grid place-content-center">
          <Oval color="#7f56d9" secondaryColor="#7f56d9" strokeWidth={3} height={75} />
        </div>
      )}
      <Modal
        label={
          <p className="font-semibold pb-3 text-lg">
            Czy na pewno chcesz przejść do podsumowania?
          </p>
        }
        show={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={() => router.push("/podsumowanie")}
      />
    </>
  );
};

export default Edytor;

// korekcja szerokości w edytorze
const widthCorrection = (event: globalThis.MouseEvent) => {
  let width = Math.floor((event.pageX / document.documentElement.clientWidth) * 100);
  if (width < 10) width = 0;
  if (width > 90) width = 100;
  return width;
};
