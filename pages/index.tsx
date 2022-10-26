import React, { useReducer } from "react";
import { initialState, blogReducer, ActionTypes } from "../ts/blogReducer";

const Home = () => {
  const [blog, dispatch] = useReducer(blogReducer, initialState);

  return (
    <div>
      <p>{blog.content[0].articles[0].text}</p>
      <button
        onClick={() =>
          dispatch({
            type: ActionTypes.ARTICLE,
            payload: { i: 0, j: 0, newValue: { text: "123", type: "text" } },
          })
        }
      >
        CHANGE
      </button>
    </div>
  );
};

export default Home;
