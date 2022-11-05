import React, { useState } from "react";
import {
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  PresentationChartLineIcon,
  Cog8ToothIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const SideBar = () => {
  const [toggled, setToggled] = useState(true);

  const pageName = location.pathname.slice(1);

  return (
    <aside id="navigator" className={`${toggled ? "navigator-toggled" : ""}`}>
      {/* wyloguj sie */}
      <button className="" onClick={() => setToggled(toggled => !toggled)}>
        {toggled ? (
          <ArrowLongLeftIcon className="h-8" />
        ) : (
          <ArrowLongRightIcon className="h-8" />
        )}
      </button>
      <div id="navigator-links">
        {/* Panel */}
        <Link href={"/panel"}>
          <button className={`${pageName == "panel" ? "active-link" : ""}`}>
            <HomeIcon className="h-8" />
            Panel
          </button>
        </Link>
        {/* Statystyki */}
        <Link href={"/statystyki"}>
          <button className={`${pageName == "statystyki" ? "active-link" : ""}`}>
            <PresentationChartLineIcon className="h-8" />
            Statystyki
          </button>
        </Link>
        {/* Ustawienia */}
        <Link href={"/ustawienia"}>
          <button className={`${pageName == "ustawienia" ? "active-link" : ""}`}>
            <Cog8ToothIcon className="h-8" />
            Ustawienia
          </button>
        </Link>
      </div>
      {/* wyloguj sie */}
      <button onClick={async () => await signOut(auth)}>
        <ArrowLeftOnRectangleIcon className="h-8" />
        Wyloguj się
      </button>
    </aside>
  );
};

export default SideBar;
