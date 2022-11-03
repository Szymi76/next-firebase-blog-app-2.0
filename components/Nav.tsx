import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { useAuthUser } from "../firebase/auth-hooks";
import { useRouter } from "next/router";
import {
  ComputerDesktopIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Search from "./Search";

interface NormalProps {
  transparent?: boolean;
}

export const Normal = ({ transparent = false }: NormalProps) => {
  const user = useAuthUser();

  const [toggled, setToggled] = useState(false);
  const [shouldTransparent, setShouldTransparent] = useState(true);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState(false);

  const router = useRouter();

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
      <Link href={"/"}>
        <div className="logo">
          <ComputerDesktopIcon className="h-7" />
          <h1>Szybki blog</h1>
        </div>
      </Link>
      {/* links */}
      <ul className={`links ${toggled ? "toggled" : ""}`}>
        <li>
          <Link href={"/edytor"}>Stwórz blog</Link>
        </li>
        <li>
          <Link href={"/blogi"}>Blogi</Link>
        </li>
        <li>
          <Link href={"/"}>Inspiracje</Link>
        </li>
      </ul>
      {/* right side */}
      <div className="right-side">
        <MagnifyingGlassIcon
          className="h-8 cursor-pointer"
          onClick={() => setSearch(search => !search)}
        />
        {user ? (
          <Image
            src={user?.photoURL}
            onClick={() => setShow(show => !show)}
            alt="profile-image"
            height={40}
            width={40}
          />
        ) : (
          <p className="my-auto">
            <Link href={"/zaloguj-sie"}>Zaloguj się</Link>
          </p>
        )}

        {/* user menu */}
        {show && user && (
          <div className="user-menu">
            <div className="text-slate-800">
              <p>{user?.displayName}</p>
              <p>{user?.email}</p>
            </div>
            <div className="menu-links">
              <Link href={"/"}>Dashboard</Link>
              <Link href={"/"}>Ustawienia</Link>
            </div>
            <p
              onClick={async () => await signOut(auth)}
              className="text-black text-center cursor-pointer"
            >
              Wyloguj się
            </p>
          </div>
        )}
        {search && <Search />}
        <button className="flex items-center gap-3">
          {!toggled ? (
            <Bars3Icon
              className="h-9 cursor-pointer  min-[900px]:hidden"
              onClick={() => setToggled(toggled => !toggled)}
            />
          ) : (
            <XMarkIcon
              className="h-9 cursor-pointer  min-[900px]:hidden"
              onClick={() => setToggled(toggled => !toggled)}
            />
          )}
        </button>
      </div>
      {/* menu toggle */}
      {/* )} */}
    </nav>
  );
};

export const Dev = () => {
  const user = useAuthUser();

  const [show, setShow] = useState(false);

  const router = useRouter();

  return (
    <nav className="nav-dev">
      {/* logo */}
      <Link href={"/"}>
        <div className="logo">
          <ComputerDesktopIcon className="h-8" />
          <h1>Szybki blog</h1>
          <span>Dev</span>
        </div>
      </Link>

      {/* right side */}
      <div className="right-side">
        {user && (
          <Image
            src={user.photoURL}
            onClick={() => setShow(show => !show)}
            alt="profile-image"
            height={40}
            width={40}
          />
        )}

        {/* user menu */}
        {show && user && (
          <div className="user-menu">
            <div className="text-slate-800">
              <p>{user.displayName}</p>
              <p>{user.email}</p>
            </div>
            <div className="menu-links">
              <Link href={"/"}>Dashboard</Link>
              <Link href={"/"}>Ustawienia</Link>
            </div>
            <p
              onClick={async () => await signOut(auth)}
              className="text-black text-center cursor-pointer"
            >
              Wyloguj się
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};
