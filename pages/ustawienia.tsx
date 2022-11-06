import React, { useState, useRef } from "react";
import Image from "next/image";
import { userAgent } from "next/server";
import SettingsWrapper from "../components/SettingsWrapper";
import { useAuthUser } from "../firebase/auth-hooks";
import * as Input from "../components/Input";
import {
  sendEmailVerification,
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { uploadFile } from "../firebase/functions";
import Alert from "../components/Alert";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Settings = () => {
  const user = useAuthUser();

  const [sent, setSent] = useState(false);
  const [image, setImage] = useState<null | File>(null);
  const [alertLabel, setAlertLabel] = useState<string | null>(null);
  const [authorize, setAuthorize] = useState(false);

  const nickRef = useRef<HTMLInputElement>();
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  // aktualizacja nicku
  const handleNickChange = () => {
    const nick = nickRef.current.value;
    if (nick.length < 4) return;
    updateProfile(user, {
      displayName: nick,
    }).then(() => {
      setAlertLabel("Nick został zaktualizowany");
    });
  };

  // zmiana adresu email
  const handleEmailChange = async e => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (email.length < 3) return;

    try {
      const freshCredential = EmailAuthProvider.credential(user.email, password);
      const reauthenticate = await reauthenticateWithCredential(user, freshCredential);

      updateEmail(reauthenticate.user, email)
        .then(() => setAlertLabel("Email został zmieniony"))
        .catch(err => console.log(err));
    } catch {
      console.error("Błędne hasło");
    } finally {
      setAuthorize(false);
    }
  };

  // weryfikacja emaila
  const handleEmailVerification = () => {
    sendEmailVerification(user).then(() => {
      setAlertLabel(`Wysłano email weryfikacyjny na adres ${user.email}`);
      setSent(true);
    });
  };

  // aktualizacja zdjęcia profilowego
  const handleProfileImageChange = async () => {
    if (!image) return;

    const url = await uploadFile(image, `${user.uid}_photoURL`);
    updateProfile(user, {
      photoURL: url,
    }).then(() => setAlertLabel("Zaktualizowano zdjęcie profilowe"));
  };

  return (
    <SettingsWrapper>
      <h1 className="text-3xl font-semibold">Ustawienia</h1>
      <hr className="mb-14" />
      <h3 className="font-semibold">Dane użytkownika</h3>
      <p className="text-sm text-gray-600">Zaktualizuj swoje informacje tutaj.</p>
      <hr />
      {/* nick */}
      <div className="input-wrapper">
        <p>Nick</p>
        <input
          ref={nickRef}
          type="text"
          className="input input-normal max-w-[300px]"
          defaultValue={user?.displayName}
        />
        <button className="button-solid" onClick={handleNickChange}>
          Zapisz
        </button>
      </div>
      <hr />
      {/* email */}
      <div className="input-wrapper">
        <p>Adres email</p>
        <input
          ref={emailRef}
          type="email"
          className="input input-normal max-w-[350px]"
          defaultValue={user?.email}
        />
        <button className="button-solid" onClick={() => setAuthorize(true)}>
          Zapisz
        </button>
      </div>
      <hr />
      {/* weryfikacja */}
      <div className="input-wrapper">
        <p>Weryfikacja</p>
        <h4>
          {user?.emailVerified
            ? "Adres email zweryfikowany"
            : "Adres email nie został zweryfikowany"}
        </h4>
        {!user?.emailVerified && (
          <button className="button-solid" onClick={handleEmailVerification}>
            {sent ? "Wyślij ponownie" : "Wyślij"}
          </button>
        )}
      </div>
      <hr />
      {/* profile image */}
      <div className="input-wrapper">
        <p>Zdjęcie profilowe</p>
        <img src={image ? URL.createObjectURL(image) : user?.photoURL} />
        <Input.File onChange={e => setImage(e.target.files[0])}>
          <h6 className="">
            <b className="text-violet-500 font-semibold">Kliknij aby dodać</b> lub
            przeciągnij i upuść zdjęcie. PNG, JPG
          </h6>
        </Input.File>
        <button className="button-solid" onClick={handleProfileImageChange}>
          Zapisz
        </button>
      </div>
      {/* alert informujący o aktualizacji danych */}
      <Alert label={alertLabel} restore={() => setAlertLabel(null)} />
      {/* ponowne wpisanie hasła */}
      {authorize && (
        <div id="authorize-wrapper">
          <div id="authorize-container">
            <form id="authorize" onSubmit={handleEmailChange}>
              <span className="flex justify-between">
                <p className="text-gray-500">Hasło</p>
                <XMarkIcon
                  className="h-7 text-red-500 cursor-pointer"
                  onClick={() => setAuthorize(false)}
                />
              </span>
              <input
                ref={passwordRef}
                type="password"
                className="input input-normal"
                autoFocus
              />
              <button className="button-solid max-w-[125px]">Dalej</button>
            </form>
          </div>
        </div>
      )}
    </SettingsWrapper>
  );
};

export default Settings;
