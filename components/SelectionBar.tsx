import React, { useContext } from "react";
import * as Button from "../components/Button";
import { ActionTypes, BlogContext, DEFAULT_SECTION } from "../ts/blogReducer";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface SelectionBarProps {
  currSect: number;
  setCurrSect: React.Dispatch<React.SetStateAction<number>>;
}

const SelectionBar = ({ currSect, setCurrSect }: SelectionBarProps) => {
  const { blog, dispatch } = useContext(BlogContext);

  const buttonLabelConverter = (index: number) => {
    const titleLen = blog.content[index].title.length;
    if (titleLen < 4) return `Sekcja ${index}`;
    else if (titleLen < 12) return blog.content[index].title;
    else return blog.content[index].title.slice(0, 10) + "...";
  };

  const handleAddSection = () => {
    dispatch({
      type: ActionTypes.ALL_SECTIONS,
      payload: [...blog.content, DEFAULT_SECTION],
    });
    setCurrSect(currSect => blog.content.length);
  };

  const handleSectionRemove = (index: number) => {
    console.log(blog.content.length);
    if (blog.content.length == 1) return;
    const filteredContent = blog.content.filter((s, i) => i != index);
    dispatch({ type: ActionTypes.ALL_SECTIONS, payload: filteredContent });
    setCurrSect(currSect =>
      currSect > blog.content.length - 2 ? blog.content.length - 2 : currSect
    );
  };

  return (
    <div id="selection-bar">
      <Button.Outlined
        children={"Wstęp"}
        color={currSect == -1 ? "blue" : "gray"}
        onClick={() => setCurrSect(-1)}
      />
      {blog.content.map((section, i) => {
        return (
          <Button.Outlined
            key={"selection-button" + i}
            onClick={e =>
              // @ts-ignore
              e.target.classList.contains("button-outlined") && setCurrSect(i)
            }
            color={currSect == i ? "blue" : "gray"}
          >
            {buttonLabelConverter(i)}
            <XMarkIcon
              className={` h-5  ${
                blog.content.length == 1
                  ? "text-gray-400"
                  : "text-black hover:text-red-500"
              }`}
              onClick={() => handleSectionRemove(i)}
            />
          </Button.Outlined>
        );
      })}
      <Button.Outlined
        children={<PlusIcon className="text-green-500 h-5" />}
        color="green"
        onClick={handleAddSection}
      />
    </div>
  );
};

export default SelectionBar;
