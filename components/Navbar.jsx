import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { use, useState } from "react";
import { useRouter } from "next/router";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

function NavList() {
  const router = useRouter();
  const userData = useUser();

  return (
    <ul className="text-lg flex flex-col gap-2 lg:flex-row lg:items-center text-black lg:gap-6 mr-10">
      <Link href="/search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`text-lg font-bold w-6 h-6 rounded-sm hover:text-emerald-500 ${
            router.pathname === "/search"
              ? "text-emerald-400 "
              : "text-white font-bold z-50"
          }}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </Link>

      <Link
        href="/"
        className={`text-lg font-semibold w-fit text-white hover:text-white hover:border-b-4 hover:border-emerald-400 rounded-sm ${
          router.pathname === "/"
            ? "border-b-4 "
            : "hover:border-b-4 border-emerald-400"
        }`}
      >
        HOME
      </Link>
      {/* <Link
            href="/movies"
            className={`text-lg font-semibold text-gray-100 hover:text-white rounded-sm ${
              router.pathname === "/movies"
                ? "border-b-4 border-white"
                : "hover:border-b-4 border-emerald-400 hover:border-emerald-400"
            }}`}
          >
            MOVIES
          </Link> */}
      <Link
        href="/serie"
        className={`text-lg font-semibold w-fit text-white hover:text-white active:border-emerald-400 rounded-sm ${
          router.pathname === "/serie"
            ? "border-b-4 "
            : "hover:border-b-4 border-emerald-400"
        }`}
      >
        TV SHOWS
      </Link>
      {userData && (
        <Link
          href="/account/watchlist"
          className={`text-lg font-semibold w-fit text-white hover:text-white active:border-emerald-400 rounded-sm ${
            router.pathname === "/account/watchlist"
              ? "border-b-4 border-orange-500"
              : "hover:border-b-4 border-emerald-400"
          }`}
        >
          WATCHLIST
        </Link>
      )}
      <Link
        href="/request"
        className={`text-lg font-semibold bg-clip-text w-fit text-white hover:text-white hover:border-b-4 active:border-emerald-400 rounded-sm ${
          router.pathname === "/request"
            ? "border-b-4 border-orange-500 hover:text-transparent"
            : "hover:border-b-4 border-emerald-400"
        }`}
      >
        REQUEST
      </Link>
      <Link
        href="/account"
        className={`text-lg font-semibold w-fit bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500 hover:text-white active:border-emerald-400 ${
          router.pathname === "/login" || router.pathname === "/signup"
            ? ""
            : ""
        }`}
      >
        {userData ? (
          <>
            {userData.user_metadata.picture ? (
              <div className="p-0.5 border-2 border-emerald-400 hover:border-white z-50 rounded-full">
                <Image
                  src={userData.user_metadata.picture}
                  alt="profile"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
            ) : (
              <div className="rounded-none">
                {userData.user_metadata.full_name ? (
                  <>{userData.user_metadata.full_name}</>
                ) : (
                  <>PROFILE</>
                )}
              </div>
            )}
          </>
        ) : (
          <>LOGIN</>
        )}
      </Link>
    </ul>
  );
}

export default function Header() {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <navbar className="bg-transparent sticky inset-0 z-10  backdrop-blur-xl backdrop-brightness-50">
      <div className="flex justify-between inset-0 text-black backdrop-blur-xl backdrop-brightness-50 py-3 md:py-4 pl-3 pr-5">
        <h1 className="text-3xl md:text-4xl font-light text-white py-1 cursor-pointer ">
          The <span className="font-extrabold">OCTULUS</span>
        </h1>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6 text-white" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav} className="">
        <div className="pb-10 pt-5 pl-5">
          <NavList />
        </div>
      </Collapse>
    </navbar>
  );
}
