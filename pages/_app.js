import React from "react";

import "../styles/global.css";
import "../styles/input.css";
import "../styles/button.css";
import "../styles/nav.css";
import "../styles/home.css";
import "../styles/blog.css";
import "../styles/editor.css";

import { BlogContext, initialState, blogReducer } from "../ts/blogReducer";
import { useReducer } from "react";

function MyApp({ Component, pageProps }) {
  const [blog, dispatch] = useReducer(blogReducer, initialState);

  return (
    <React.StrictMode>
      <BlogContext.Provider value={{ blog, dispatch }}>
        <Component {...pageProps} />
      </BlogContext.Provider>
    </React.StrictMode>
  );
}

export default MyApp;
