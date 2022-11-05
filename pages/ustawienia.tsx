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

const Settings = () => {
  const user = useAuthUser();

  const [sent, setSent] = useState(false);

  const nickRef = useRef<HTMLInputElement>();
  const emailRef = useRef<HTMLInputElement>();

  const handleNickChange = () => {
    const nick = nickRef.current.value;
    if (nick.length < 4) return;
    updateProfile(user, {
      displayName: nick,
    }).then(() => {
      // poprawnie zakualizowano nick
    });
  };

  const handleEmailChange = async () => {
    const email = emailRef.current.value;
    if (email.length < 3) return;

    const freshCredential = EmailAuthProvider.credential(user.email, "1qaz@WSX");

    const reauthenticate = await reauthenticateWithCredential(user, freshCredential);

    updateEmail(reauthenticate.user, email)
      .then(() => {
        console.log("Email zminiony");
      })
      .catch(err => console.log(err));
  };

  // weryfikacja emaila
  const handleEmailVerification = () => {
    sendEmailVerification(user).then(() => {
      setSent(true);
    });
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
        <button className="button-solid" onClick={handleEmailChange}>
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
        <img src={user?.photoURL} />
        <Input.File onChange={() => 1}>
          <h6 className="">
            <b className="text-violet-500 font-semibold">Kliknij aby dodać</b> albo
            przeciągnij i upuść zdjęcie. PNG, JPG
          </h6>
        </Input.File>
        <button className="button-solid">Zapisz</button>
      </div>
    </SettingsWrapper>
  );
};

export default Settings;
