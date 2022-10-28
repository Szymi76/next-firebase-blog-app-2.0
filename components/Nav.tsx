import React, { useState, useEffect } from "react";
import { useAuthUser } from "../firebase/auth-hooks";
import {
  ComputerDesktopIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface NormalProps {
  transparent?: boolean;
}

export const Normal = ({ transparent = false }: NormalProps) => {
  const user = useAuthUser();

  const [toggled, setToggled] = useState(false);
  const [shouldTransparent, setShouldTransparent] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 0 ? setShouldTransparent(false) : setShouldTransparent(true);
    };

    window.addEventListener("scroll", handleScroll);

    return () => removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`nav-normal ${shouldTransparent && transparent ? "transparent" : ""}`}
    >
      {/* logo */}
      <Link href={"/1"}>
        <div className="logo">
          <ComputerDesktopIcon className="h-7" />
          <h1>Szybki blog</h1>
        </div>
      </Link>
      {/* links */}
      <ul className={`links ${toggled ? "toggled" : ""}`}>
        <li>
          <Link href={"/"}>Stwórz blog</Link>
        </li>
        <li>
          <Link href={"/"}>Blogi</Link>
        </li>
        <li>
          <Link href={"/"}>Inspiracje</Link>
        </li>
      </ul>
      {/* right side */}
      {user ? (
        <div className="right-side">
          <MagnifyingGlassIcon className="h-8 cursor-pointer" />
          <img src={user.photoURL} alt="profile-image" />
          <Bars3Icon
            className="h-9 cursor-pointer  min-[900px]:hidden"
            onClick={() => setToggled(toggled => !toggled)}
          />
        </div>
      ) : (
        <button className="flex items-center gap-3">
          <Link href={"/login"}>Zaloguj się</Link>
          <Bars3Icon
            className="h-9 cursor-pointer  min-[900px]:hidden"
            onClick={() => setToggled(toggled => !toggled)}
          />
        </button>
      )}
    </nav>
  );
};
