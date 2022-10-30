import React, { useState, useContext } from "react";
import { ActionTypes, BlogContext } from "../ts/blogReducer";
import Introduction from "./Introduction";
import SelectionBar from "./SelectionBar";

const Form = () => {
  const [currSect, setCurrSect] = useState(0); // current section

  const { blog, dispatch } = useContext(BlogContext);

  return (
    <>
      <SelectionBar currSect={currSect} setCurrSect={setCurrSect} />
      <main>{currSect == -1 ? <Introduction /> : <>Section {currSect}</>}</main>
    </>
  );
};

export default Form;
