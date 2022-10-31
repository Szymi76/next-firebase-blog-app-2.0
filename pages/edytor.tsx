import React, { useState, useEffect, useContext } from "react";
import * as Nav from "../components/Nav";
import { useMouseHold } from "../ts/useMouseHold";
import { ActionTypes, BlogContext } from "../ts/blogReducer";
import { PencilIcon } from "@heroicons/react/24/outline";
import * as Button from "../components/Button";
import Blog from "../components/Blog";
import Form from "../components/Form";
import { useAuthUser } from "../firebase/auth-hooks";
import { Oval } from "react-loader-spinner";
import { useRouter } from "next/router";
import Modal from "../components/Modal";

const Edytor = () => {
  const [hold, event] = useMouseHold("resizer");
  const [width, setWidth] = useState(50);
  const [showModal, setShowModal] = useState(false);

  const { blog, dispatch } = useContext(BlogContext);

  const user = useAuthUser();

  const router = useRouter();

  useEffect(() => {
    if (!event) return;
    setWidth(widthCorrection(event));
  }, [event]);

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user]);

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
                <Button.Solid className="editor-button" children="Zapisz" />
                <Button.Solid
                  className="editor-button"
                  children="Prześlj"
                  onClick={() => setShowModal(true)}
                />
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

const widthCorrection = (event: globalThis.MouseEvent) => {
  let width = Math.floor((event.pageX / document.documentElement.clientWidth) * 100);
  if (width < 10) width = 0;
  if (width > 90) width = 100;
  return width;
};
