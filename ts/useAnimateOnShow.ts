import { useState, useEffect } from "react";

const useAnimateOnShow = (elementClass: string, animationClass: string) => {
  useEffect(() => {
    window.addEventListener("scroll", event => {
      const elements = document.querySelectorAll(`.${elementClass}`);

      elements.forEach(e => {
        //   @ts-ignore
        // const offsetY = e.offsetTop;
        // const height = e.clientHeight;
        // const scrollY = window.scrollY;
        // const windowHeight = window.innerHeight;
        // const topOffset = e.getBoundingClientRect().top;
        // // @ts-ignore
        // const dif = topOffset - window.innerHeight;
        // console.log(scrollY > dif + e.clientHeight);

        const offsetTop = e.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const scrollY = window.screenY;
        const elementHeight = e.clientHeight;

        if (scrollY > offsetTop - windowHeight) e.classList.add(animationClass);
      });
    });
  }, []);
};

export { useAnimateOnShow };
