/* eslint-disable @next/next/no-html-link-for-pages */
import { Dialog, Popover } from "@headlessui/react";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";


export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const user = useUser();

  return (
    <header className="bg-black relative overflow-hidden z-50">
      <nav
        className="flex justify-between lg:px-0 mx-2 md:mx-11 my-4 overflow-hidden"
        aria-label="Global"
      >
        <Link href="/" className="overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-extralight text-white py-1">
            The <span className="font-extrabold">OCTULUS</span>
          </h1>
        </Link>
        <div className="flex lg:hidden">
          <button
            type="button"
            className=" inline-flex items-center justify-center rounded-md text-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12"></Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center space-x-6 ">
          <Link href="/search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`text-lg font-semibold w-6 h-6 rounded-sm ${
                router.pathname === "/search"
                  ? "text-emerald-400 "
                  : "text-white z-50"
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
            className={`text-lg font-semibold text-gray-100 hover:text-white hover:border-b-4 hover:border-emerald-400 rounded-sm ${
              router.pathname === "/"
                ? "border-b-4 border-white"
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
          </Link>
          <Link
            href="/series"
            className={`text-lg font-semibold text-gray-100 hover:text-white active:border-emerald-400 rounded-sm ${
              router.pathname === "/series"
                ? "border-b-4 border-white"
                : "hover:border-b-4 border-emerald-400"
            }`}
          >
            TV SHOWS
          </Link> */}
          <Link
            href="/request"
            className={`text-lg font-semibold bg-clip-text text-white hover:text-white hover:border-b-4 active:border-emerald-400 rounded-sm ${
              router.pathname === "/request"
                ? "border-b-4 border-white hover:text-transparent"
                : "hover:border-b-4 border-emerald-400"
            }`}
          >
            REQUEST
          </Link>
          <Link
            href="/login"
            className={`text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500 hover:text-white hover:border-b-4 active:border-emerald-400 rounded-sm ${
              router.pathname === "/login" || router.pathname === "/signup"
                ? "border-b-4 border-white hover:text-transparent"
                : "hover:border-b-4 border-emerald-400"
            }`}
          >
            LOG IN
          </Link>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-black px-4 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="">
              <Link href="/" className="">
                <h1 className="text-3xl font-extralight text-white py-1">
                  The <span className="font-extrabold">OCTULUS</span>
                </h1>
              </Link>
            </a>
            <button
              type="button"
              className="rounded-md text-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className=" divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a href="/search">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`text-lg font-semibold w-6 h-6 rounded-sm ${
                      router.pathname === "/search"
                        ? "text-emerald-400 "
                        : "text-white z-50"
                    }}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </a>
                <a
                  href="/"
                  className="-mx-3 block rounded-lg py-2 px-3 font-bold text-xl text-gray-200 "
                >
                  <div className="w-fit border-b-2">HOME</div>
                </a>
                {/* <a
                  href="/movies"
                  className="-mx-3 block rounded-lg py-2 px-3 font-bold text-xl text-gray-200 "
                >
                  <div className="border-b-2 w-fit">MOVIES</div>
                </a>
                <a
                  href="/series"
                  className="-mx-3 block rounded-lg py-2 px-3 font-bold text-xl text-gray-200 "
                >
                  <div className="border-b-2 w-fit">SERIES</div>
                </a> */}
                <a
                  href="/request"
                  className="-mx-3 block rounded-lg py-2 px-3 font-bold text-xl "
                >
                  <div className="bg-clip-text text-white w-fit border-b-2">
                    REQUEST
                  </div>
                </a>
                <a
                  href="/login"
                  className="-mx-3 block rounded-lg py-2 px-3 font-bold text-xl "
                >
                  <div className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500 w-fit border-b-2">
                    LOG IN
                  </div>
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
