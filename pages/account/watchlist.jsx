import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";

export default function Watchlist() {
  const router = useRouter();
  const user = useUser();
  const [movie, setMovie] = useState("");
  const [serie, setSerie] = useState("");

  const fetchMWatchlist = useCallback(async () => {
    if (user) {
      const { data, error } = await supabase
        .from(`movies`)
        .select("*, mwatchlist!inner(*), profiles(*)")
        .eq("mwatchlist.user_id", `${user.id}`);
      if (data) {
        setMovie(data);
      } else {
        console.log(error);
      }
    } else {
      return;
    }
  }, [user]);

  const fetchSWatchlist = useCallback(async () => {
    if (user) {
      const { data, error } = await supabase
        .from(`series`)
        .select("*, swatchlist!inner(*), profiles(*)")
        .eq("swatchlist.user_id", `${user.id}`);
      if (data) {
        setSerie(data);
      } else {
        console.log(error);
      }
    } else {
      return;
    }
  }, [user]);

  useEffect(() => {
    fetchMWatchlist();
    fetchSWatchlist();
  }, [router, user, fetchMWatchlist, fetchSWatchlist]);

  return (
    <div className="bg-black text-white h-screen">
      <Toaster />
      {user ? (
        <div className="">
          <h1 className="text-white text-2xl ml-3 font-bold">Movies</h1>
          {movie.length !== 0 ? (
            <div className="text-white">
              <main className="container mx-auto my-10 px-3 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                  {movie.map((mov) => (
                    <div
                      className="shadow-lg rounded-lg flex flex-row items-center "
                      key={mov.id}
                    >
                      <Link href={`/movie/${mov.slug}`}>
                        <Image
                          alt=""
                          className="hover:opacity-75 opacity-100"
                          src={`https://image.tmdb.org/t/p/w300/${mov.mainImage}`}
                          loading="lazy"
                          width={150}
                          height={100}
                        />
                      </Link>
                      <div className="w-full flex flex-col items-center gap-4">
                        <h3 className="text-white font-semibold text-lg text-center ">
                          {mov.name}
                        </h3>
                        <button
                          className="h-10 items-center w-10 bg-red-500 flex justify-center mx-3 rounded-lg border-2"
                          onClick={async() => {
                            const { data, error } = await supabase.from("mwatchlist").delete().eq("user_id", user.id).eq("movie_id", mov.id);
                            console.log(user.id, mov.id)
                            if (data) {
                              console.log(data);
                              fetchMWatchlist();
                            } else {
                              console.log(error);
                              fetchMWatchlist();
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          ) : (
            <div className="w-screen h-20 flex items-end px-6 text-md lg:text-xl xl:text-2xl text-gray-400">
              Nothing to see here
            </div>
          )}
          <br />
          <br />
          <h1 className="text-white text-2xl px-6 font-bold">Series</h1>
          {serie.length !== 0 ? (
            <div className="text-white">
              <main className="container mx-auto my-10 px-3 md:px-0">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                  {serie.map((mov) => (
                    <Link
                      href={`/movie/${mov.slug}`}
                      className="shadow-lg rounded-lg flex flex-col items-center"
                      key={mov.id}
                    >
                      <Image
                        alt=""
                        className="rounded-lg hover:opacity-75 opacity-100"
                        src={`https://image.tmdb.org/t/p/w300/${mov.mainImage}`}
                        loading="lazy"
                        width={150}
                        height={100}
                      />
                      <h3 className="text-white font-bolder text-md text-center ">
                        {mov.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </main>
            </div>
          ) : (
            <div className="w-screen mt-10 flex items-center px-6 text-md lg:text-xl xl:text-2xl text-gray-400 pb-20 bg-black">
              add to see series here
            </div>
          )}
        </div>
      ) : (
        <div className="text-center w-screen h-screen bg-black text-white flex items-center justify-center text-md md:text-lg xl:text-xl 2xl:text-2xl">
          Please&nbsp;
          <Link href="/account" className="text-red-500 text-bold">
            sign in
          </Link>
          &nbsp;first to see your Watchlist
        </div>
      )}
    </div>
  );
}
