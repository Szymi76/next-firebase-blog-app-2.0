import React, { useState, useEffect, useContext } from "react";
import * as Nav from "../components/Nav";
import { useMouseHold } from "../ts/useMouseHold";
import { ActionTypes, BlogContext } from "../ts/blogReducer";
import { PencilIcon } from "@heroicons/react/24/outline";
import * as Button from "../components/Button";
import Blog from "../components/Blog";
import Form from "../components/Form";
import { useAuthUser } from "../firebase/auth-hooks";
import { Oval } from "react-loader-spinner";
import { useRouter } from "next/router";
import Modal from "../components/Modal";

const Summary = () => {
  const { blog, dispatch } = useContext(BlogContext);

  const user = useAuthUser();

  const router = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user]);

  return (
    <>
      <Nav.Dev />
      <div id="summary-wrapper">
        <main id="summary">
          <div id="summary-title">Podsumowanie</div>
          <div id="summary-content">
            {/* wstęp */}
            <div className="summary-row">
              <p className="font-semibold">Ostatnie dane do przesłania bloga</p>
              <p className="text-sm text-gray-500">
                Tutaj wypełniasz wszystkie ostatnie wymagane dane do przesłania bloga do
                bazy danych.
              </p>
            </div>
            {/* link */}
            <div className="summary-row flex">
              <p className="text-gray-500 w-1/5">Nazwa widoczna linku</p>
              <div className="input-with-label max-w-2xl">
                <p>{`${location.protocol}//${location.host}/blog/`}</p>
                <input type="text" />
              </div>
            </div>
            {/* tagi */}
            <div className="summary-row flex">
              <p className="text-gray-500 w-1/5">Tagi</p>
              <input className="input-normal" />
              <Button.Solid children={"Dodaj"} className="ml-2" />
            </div>
            {/* przyciski */}
            <div className="absolute w-full p-10 bottom-0 left-0 flex justify-between">
              <div className="flex gap-2">
                <Button.Solid children={"Wróć do edycji"} />
                <Button.Solid children={"Podgląd w nowej karcie"} />
              </div>
              <Button.Solid children={"Prześlj"} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Summary;
