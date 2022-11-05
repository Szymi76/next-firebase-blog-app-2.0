import React, { useEffect } from "react";
import { Oval } from "react-loader-spinner";
import * as Nav from "../components/Nav";
import SideBar from "../components/SideBar";
import { useAuthUser } from "../firebase/auth-hooks";
import { useRouter } from "next/router";

interface SettingsWrapperProps {
  children: React.ReactNode;
}

const SettingsWrapper = ({ children }: SettingsWrapperProps) => {
  const user = useAuthUser();

  const router = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/");
  }, [user]);

  return (
    <>
      <Nav.Normal />
      {user ? (
        <>
          <SideBar />
          <main id="settings-wrapper">{children}</main>
        </>
      ) : (
        <div className="w-full h-[50vh] grid place-content-center">
          <Oval color="#7f56d9" secondaryColor="#7f56d9" strokeWidth={3} height={75} />
        </div>
      )}
    </>
  );
};

export default SettingsWrapper;
