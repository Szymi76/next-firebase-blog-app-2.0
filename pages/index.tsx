import React, { useEffect, useReducer, useRef, useState } from "react";
import { initialState, blogReducer, ActionTypes } from "../ts/blogReducer";
import * as Input from "../components/Input";
import * as Button from "../components/Button";

const Home = () => {
  const [blog, dispatch] = useReducer(blogReducer, initialState);

  const [username, setUsername] = useState("");

  useEffect(() => console.log(username), [username]);

  return (
    <div>
      {blog.content[0].articles.map(e => {
        return <p>{e.text}</p>;
      })}
      <button
        onClick={() =>
          dispatch({
            type: ActionTypes.ALL_ACRTICLES,
            payload: { i: 0, newValue: [] },
          })
        }
      >
        CHANGE
      </button>
      <br></br>
      <Input.Normal
        type="text"
        placeholder="Nickname"
        onChange={e => setUsername(e.target.value)}
        value={username}
      />
      {/* <br></br> */}
      <Button.Solid>Przycisk</Button.Solid>
      <Input.File onChange={e => console.log(e.target.files)}>
        <p className="text-gray-600">
          <b className="text-violet-500">Kliknij aby zmienić</b> albo przeciagnij i upuść
          zdjęcie. PNG, JPG
        </p>
      </Input.File>
      <Button.Outlined children={"+"} color="green" />
    </div>
  );
};

export default Home;
