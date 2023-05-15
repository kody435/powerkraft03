import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";

export default function Request() {
  const [name, setName] = useState("");
  const [tmdb, setTmdb] = useState("");
  const [mainImage, setImage] = useState("");
  let [slug, setSlug] = useState("");

  const addRequest = async (e) => {
    if (name === "" && tmdb === "" && image === "") {
      toast.error("Please fill all fields correctly");
      return;
    }
    slug = name.split(" ").join("-").toLowerCase();
    const { data, error } = await supabase
      .from("movies")
      .insert([{ name: name, slug: slug, tmdb: tmdb, mainImage: mainImage }]);
    setImage("");
    setName("");
    setTmdb("");
  };

  return (
    <>
      <Toaster />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  TMDB ID
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="tmdb"
                  type="text"
                  value={tmdb}
                  onChange={(e) => setTmdb(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image text
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="image"
                  type="text"
                  value={mainImage}
                  onChange={(e) => setImage(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div
                onClick={addRequest}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
