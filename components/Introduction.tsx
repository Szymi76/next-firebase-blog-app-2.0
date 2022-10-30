import React, { useContext } from "react";
import { ActionTypes, BlogContext } from "../ts/blogReducer";
import * as Input from "../components/Input";
import * as Button from "../components/Button";

const Introduction = () => {
  const { blog, dispatch } = useContext(BlogContext);

  return (
    <div id="introduction">
      {/* tytył */}
      <div className="form-container">
        <label>Tytuł</label>
        <textarea
          className="textarea text-lg"
          value={blog.title}
          onChange={e =>
            dispatch({ type: ActionTypes.BLOG_TITLE, payload: e.target.value })
          }
        />
      </div>
      {/* opis */}
      <div className="form-container">
        <label>Opis</label>
        <textarea
          className="textarea"
          value={blog.description}
          onChange={e =>
            dispatch({ type: ActionTypes.BLOG_DESCRIPTION, payload: e.target.value })
          }
        />
      </div>
      <div className="form-container grid place-content-center">
        <Input.File
          onChange={e =>
            dispatch({ type: ActionTypes.BLOG_IMAGE, payload: e.target.files[0] })
          }
        >
          <p>
            <b className="text-violet-500 font-semibold">Kliknij aby dodać</b> albo
            przeciągnij i upuść zdjęcie. PNG, JPG
          </p>
        </Input.File>
      </div>
    </div>
  );
};

export default Introduction;
