import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Request() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Movies");
  const [year, setYear] = useState("");
  const [imdb, setImdb] = useState("");

  const addRequest = async (e) => {
    if (name === "" && category === "") {
      toast.error("Please fill all fields correctly");
      return;
    } else if (!user) {
      toast.error("Please login first");
    } else {
      const { data, error } = await supabase
        .from("requests")
        .insert([{ name: name, category: category, year: year, imdb: imdb }]);

      if (data) {
        setName("");
        setYear("");
        setImdb("");
        setCategory("");
        toast.success("Request added successfully");
        router.push("/requested");
      } else if (error) {
        console.log(error);
        toast.error("Error adding request, try again later");
      }
    }
  };

  const supabaseClient = useSupabaseClient();
  const user = useUser();

  return (
    <div className="isolate bg-black h-screen px-6 py-24 -z-10 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-10 top-[110rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      ></div>
      <div className="mx-auto max-w-2xl text-center">
        <Toaster />
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl py-2 ">
          Request a Movie or Series
        </h2>
      </div>
      <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold leading-6 text-white"
            >
              Name of the Movie or Series<span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="country" className="sr-only">
                  Category
                </label>
                <select
                  id="country"
                  name="country"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option>Movie</option>
                  <option>Serie</option>
                </select>
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-32 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-white"
            >
              Release Year <span className="text-gray-400">(optional)</span>
            </label>
            <div className="mt-2.5">
              <input
                type="number"
                value={year}
                required
                onChange={(e) => setYear(e.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-white"
            >
              IMDB Link / ID <span className="text-gray-400">(optional)</span>
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                value={imdb}
                onChange={(e) => setImdb(e.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div
            onClick={addRequest}
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            REQUEST
          </div>
        </div>
        <div className="text-white text-lg flex justify-center items-center mt-10 flex-col sm:flex-row">
          <div>Check if already requested? &nbsp;</div>
          <Link
            href="/requested"
            className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
          >
            REQUESTED ↗
          </Link>
        </div>
      </form>
    </div>
  );
}
