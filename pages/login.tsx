import React, { useState } from "react";
import { useAuthSignIn } from "../firebase/auth-hooks";
import * as Button from "../components/Button";
import * as Input from "../components/Input";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useRouter } from "next/router";

const Login = () => {
  const [signIn, user, loading, error] = useAuthSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async event => {
    event.preventDefault();
    await signIn(email, password);
    if (!error) router.push("/");
  };

  return (
    <div>
      <p>login</p>
      <form onSubmit={handleLogin}>
        <Input.Normal
          placeholder="Email"
          type="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
        <Input.Normal
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
        <Button.Solid children={"Zaloguj sie"} />
      </form>
      <Button.Solid children={"Wyloguj się"} onClick={async () => await signOut(auth)} />
    </div>
  );
};

export default Login;
