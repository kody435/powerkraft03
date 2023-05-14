import { Dialog, Popover } from "@headlessui/react";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b-2 ">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="m-2">
            <span className="sr-only">POWERKRAFT</span>
            <Image
              className="h-16 w-auto "
              width={1000}
              height={300}
              src="https://firebasestorage.googleapis.com/v0/b/powerkraft-02.appspot.com/o/other%20images%2FLogo.webp?alt=media&token=faab2682-7787-465a-9a5f-82ec66ace27b"
              alt=""
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12"></Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-6">
          <Link
            href="/"
            className="text-sm font-semibold leading-6 text-gray-500 hover:text-black"
          >
            ABOUT
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold leading-6 text-gray-500 hover:text-black"
          >
            CONTACT
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
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="">
              <span className="sr-only">POWERKRAFT</span>
              <Image
                className="h-16 w-auto"
                width={1000}
                height={300}
                src="https://firebasestorage.googleapis.com/v0/b/powerkraft-02.appspot.com/o/other%20images%2FLogo.webp?alt=media&token=faab2682-7787-465a-9a5f-82ec66ace27b"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  href="/"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-600 hover:text-white"
                >
                  ABOUT
                </Link>
                <Link
                  href="/"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-600 hover:text-white"
                >
                  CONTACT
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
