import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuthCreateUser } from "../firebase/auth-hooks";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { Oval } from "react-loader-spinner";
import * as Button from "../components/Button";
import * as Input from "../components/Input";
import FormImage from "../public/form2.png";

const imageURL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUrUUiWNFJ1yVTnNtdVFE5ckNSBMivem7lrQ&usqp=CAU";

const Login = () => {
  const [createUser, user, loading, error] = useAuthCreateUser();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleLogin = async event => {
    event.preventDefault();
    await createUser(email, password, username, imageURL);
  };

  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  return (
    <div id="login-wrapper">
      {/* logo */}
      <Link href={"/"}>
        <div id="login-logo">
          <ComputerDesktopIcon className="h-8" />
          <h1 className="text-lg">Szybki blog</h1>
        </div>
      </Link>
      {/* lewa strona */}
      <div id="left-side">
        <div id="left-side-text">
          <div>
            <h1>Twój własny blog już dziś</h1>
            <p>Blogi, edytor, inspiracje i wiele innych atrakcji czeka już za rogiem.</p>
          </div>
        </div>
        <img src={FormImage.src} alt="Form image" id="left-side-form-image" />
      </div>
      {/* prawa strona */}
      <div id="right-side">
        <form onSubmit={handleLogin}>
          <h1>Stwórz konto</h1>
          {error && <p className="text-red-500">Coś poszło nie tak.</p>}
          <div className="flex flex-col">
            <label>Nazwa użytkownika</label>
            <Input.Normal
              placeholder="Nazwa użytkownika"
              type="text"
              onChange={e => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div className="flex flex-col">
            <label>Adres email</label>
            <Input.Normal
              placeholder="Email"
              type="email"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="flex flex-col">
            <label>Hasło</label>
            <Input.Normal
              placeholder="Password"
              type="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="flex flex-col">
            <label>Potwierdź hasło</label>
            <Input.Normal
              placeholder="Password"
              type="password"
              onChange={e => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>
          {!loading ? (
            <Button.Solid children={"Stwórz"} className="w-full" />
          ) : (
            <span className="flex justify-center">
              <Oval
                color="#7f56d9"
                secondaryColor="#7f56d9"
                strokeWidth={3}
                height={35}
              />
            </span>
          )}
          <Link href={"/zaloguj-sie"}>Zaloguj się</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
