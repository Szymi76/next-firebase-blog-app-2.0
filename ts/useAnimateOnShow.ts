import { useState, useEffect } from "react";

const useAnimateOnShow = (elementClass: string, animationClass: string) => {
  useEffect(() => {
    window.addEventListener("scroll", (event) => {
      const elements = document.querySelectorAll(`.${elementClass}`);

      elements.forEach((e) => {
        //   @ts-ignore
        const offsetY = e.offsetTop;
        const height = e.clientHeight;
        const scrollY = window.scrollY;

        if (scrollY + height > offsetY) e.classList.add(animationClass);
      });
    });
  }, []);
};

export { useAnimateOnShow };
