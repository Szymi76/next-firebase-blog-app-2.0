import React, { useReducer } from "react";
import { BlogContext, initialState, blogReducer } from "../ts/blogReducer";

import "../styles/global.css";
import "../styles/input.css";
import "../styles/button.css";
import "../styles/nav.css";
import "../styles/home.css";
import "../styles/blog.css";
import "../styles/editor.css";
import "../styles/selection-bar.css";
import "../styles/form.css";
import "../styles/summary.css";
import "../styles/tests.css";
import "../styles/auth.css";
import "../styles/blogs.css";

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
