import React, { useState, useContext } from "react";
import { ActionTypes, BlogContext, DEFAULT_ARTICLE } from "../ts/blogReducer";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Introduction from "./Introduction";
import SelectionBar from "./SelectionBar";
import * as Input from "../components/Input";
import * as Button from "../components/Button";

const Form = () => {
  const [currSect, setCurrSect] = useState(0); // current section

  const { blog, dispatch } = useContext(BlogContext);

  // dodawanie kolejnego artykułu do sekcji
  const addArticle = () => {
    const newArticles = [...blog.content[currSect].articles, DEFAULT_ARTICLE];
    dispatch({
      type: ActionTypes.ALL_ACRTICLES,
      payload: { newValue: newArticles, i: currSect },
    });
  };

  // zmiana aktualnego wybranego artykułu
  const changeArticle = (e: any, j: number) => {
    dispatch({
      type: ActionTypes.ARTICLE,
      payload: {
        newValue: { text: e.target.value, type: "text" },
        i: currSect,
        j: j,
      },
    });
  };

  // zmiana zdjęcia sekcji
  const changeImage = (e: any) => {
    dispatch({
      type: ActionTypes.IMAGE,
      payload: { newValue: e.target.files[0], i: currSect },
    });
  };

  // zmiana tytyłu sekcji
  const changeTitle = (e: any) => {
    dispatch({
      type: ActionTypes.TITLE,
      payload: { newValue: e.target.value, i: currSect },
    });
  };

  // usuwanie wybranego artykułu
  const removeArticle = (j: number) => {
    const filteredArticles = blog.content[currSect].articles.filter((e, i) => i != j);
    dispatch({
      type: ActionTypes.ALL_ACRTICLES,
      payload: { newValue: filteredArticles, i: currSect },
    });
  };

  return (
    <>
      <SelectionBar currSect={currSect} setCurrSect={setCurrSect} />
      {currSect != -1 ? (
        <main id="editor-form">
          {/* tytuł sekcji */}
          <div className="form-container">
            <label>Tytuł sekcji</label>
            <textarea
              className="textarea text-lg"
              value={blog.content[currSect]?.title}
              onChange={e => changeTitle(e)}
            />
          </div>
          {/* artykuły sekcji */}
          {blog.content[currSect]?.articles.map((article, i) => {
            return (
              <div key={"artykul" + i} className="form-container">
                <div className="flex justify-between items-center">
                  <label>Artykuł {i + 1}</label>
                  <XMarkIcon
                    className="h-7 hover:text-red-500 duration-100 cursor-pointer"
                    onClick={() => removeArticle(i)}
                  />
                </div>
                <textarea
                  className="textarea h-32"
                  value={article.text}
                  onChange={e => changeArticle(e, i)}
                />
              </div>
            );
          })}
          {/* Dodaj artykuł */}
          <div className="form-container">
            <Button.Outlined
              children={"Dodaj artykuł"}
              color="green"
              onClick={addArticle}
            />
          </div>
          {/* zdjęcie sekcji */}
          <div className="form-container grid place-content-center">
            <Input.File onChange={e => changeImage(e)}>
              <p>
                <b className="text-violet-500 font-semibold">Kliknij aby dodać</b> albo
                przeciągnij i upuść zdjęcie. PNG, JPG
              </p>
            </Input.File>
          </div>
        </main>
      ) : (
        <Introduction />
      )}
    </>
  );
};

export default Form;
