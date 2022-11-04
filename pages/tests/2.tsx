import { REACT_LOADABLE_MANIFEST } from "next/dist/shared/lib/constants";

import React from "react";
import { useAnimateOnShow } from "../../ts/useAnimateOnShow";

const Scroll = () => {
  useAnimateOnShow("test-card", "test-card-animation");

  return (
    <div className="test-card w-full flex flex-col jutify-center items-center gap-2">
      <div className="h-[1300px] w-[200px] bg-gray-300">
        <h1>Title</h1>
        <p>Desription...</p>
      </div>
      <div className="test-card h-screen w-[200px] bg-gray-300">
        <h1>Title</h1>
        <p>Desription...</p>
      </div>
      <div className="test-card h-screen w-[200px] bg-gray-300">
        <h1>Title</h1>
        <p>Desription...</p>
      </div>
    </div>
  );
};

export default Scroll;
