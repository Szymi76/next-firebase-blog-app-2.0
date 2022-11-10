import { useState, useEffect } from "react";

const useAnimateOnShow = (elementClass: string, animationClass: string) => {
  useEffect(() => {
    const handleAnimateOnShow = event => {
      try {
        const elements = document.querySelectorAll(`.${elementClass}`);

        elements.forEach(e => {
          const offsetTop = e.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          const scrollY = window.screenY;

          if (scrollY > offsetTop - windowHeight) e.classList.add(animationClass);
        });
      } catch {
        console.warn("DOM Content prawdopodobnie nie został załadowany.");
      }
    };

    window.addEventListener("scroll", handleAnimateOnShow);

    return () => window.removeEventListener("scroll", handleAnimateOnShow);
  }, []);
};

export { useAnimateOnShow };
