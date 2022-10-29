import { useState, useEffect } from "react";

const useMouseHold = (elementID: string) => {
  const [hold, setHold] = useState<boolean>(false);
  const [event, setEvent] = useState<null | globalThis.MouseEvent>(null);

  const mousedown = (event: globalThis.MouseEvent) => {
    if (event.target instanceof Element) event.target.id == elementID && setHold(true);
  };
  const mouseup = (event: globalThis.MouseEvent) => setHold(false);
  const mousemove = (event: globalThis.MouseEvent) =>
    hold ? setEvent(event) : setEvent(null);

  useEffect(() => {
    window.addEventListener("mousedown", mousedown);
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("mousemove", mousemove);

    return () => {
      window.removeEventListener("mousedown", mousedown);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("mousemove", mousemove);
    };
  });

  return [hold, event] as const;
};

export { useMouseHold };
