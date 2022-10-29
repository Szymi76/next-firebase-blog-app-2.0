import React, { useState, useEffect, useContext } from "react";
import * as Nav from "../components/Nav";
import { useMouseHold } from "../ts/useMouseHold";
import { ActionTypes, BlogContext } from "../ts/blogReducer";
import { PencilIcon } from "@heroicons/react/24/outline";
import * as Button from "../components/Button";
import Blog from "../components/Blog";

const Edytor = () => {
  const [hold, event] = useMouseHold("resizer");
  const [width, setWidth] = useState(50);

  const { blog, dispatch } = useContext(BlogContext);

  useEffect(() => {
    if (!event) return;
    setWidth(widthCorrection(event));
  }, [event]);

  console.log(blog);

  return (
    <>
      <Nav.Dev />
      <main id="editor-wrapper">
        <div id="editor">
          <section id="editor-title">
            <h1>{blog.title}</h1>
            <PencilIcon className="h-6" />
          </section>
          <section id="options">
            <div>
              <Button.Solid className="editor-button" children="Editor max" />
              <Button.Solid className="editor-button" children="Editor min" />
            </div>
            <div>
              <Button.Solid className="editor-button" children="Zapisz" />
              <Button.Solid className="editor-button" children="Wyślij" />
            </div>
          </section>
          <section id="container" className="resizer">
            <div id="form" style={{ width: `${width}%` }}></div>
            <div id="resizer"></div>
            <div id="blog-editor" style={{ width: `${100 - width}%` }}>
              <Blog blog={blog} />
            </div>
          </section>
        </div>
      </main>
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
