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
  const [loading, setLoading] = useState(false);

  const fetchMWatchlist = useCallback(async () => {
    setLoading(true);
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

    setLoading(false);
  }, [user]);

  const fetchSWatchlist = useCallback(async () => {
    if (user) {
      setLoading(true);
      const { data, error } = await supabase
        .from(`series`)
        .select("*, swatchlist!inner(*), profiles(*)")
        .eq("swatchlist.user_id", `${user.id}`);
      if (data) {
        setSerie(data);
      } else {
        console.log(error);
      }

      setLoading(false);
    } else {
      return;
    }
  }, [user]);

  useEffect(() => {
    fetchMWatchlist();
    fetchSWatchlist();
  }, [router, user, fetchMWatchlist, fetchSWatchlist]);

  return (
    <div className="bg-black text-white md-screen">
      <Toaster />
      {user ? (
        <div className="bg-black text">
          <h1 className="text-white text-3xl font-bold ml-2 mb-14">
            Your Watchlist
          </h1>
          {!loading ? (
            <>
              <h1 className="text-white text-2xl ml-3 font-bold">Movies</h1>
              {movie.length !== 0 ? (
                <div className="text-white">
                  <main className="container mx-auto my-10 pb-14">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mx-5">
                      {movie &&
                        movie.map((mov) => (
                          <div
                            className="flex flex-row items-center gap-5"
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
                            <div className="w-full flex flex-col items-start gap-4">
                              <h3 className="text-white font-semibold text-lg ">
                                {mov.name}
                              </h3>
                              <button
                                className="h-8 items-center w-12 bg-red-500 flex justify-center rounded-lg border-2"
                                onClick={async () => {
                                  const { data, error } = await supabase
                                    .from("mwatchlist")
                                    .delete()
                                    .eq("user_id", `${user.id}`)
                                    .eq("movie_id", mov.id);
                                  fetchMWatchlist();
                                  if (data) {
                                    console.log(data);
                                  } else {
                                    console.log(error);
                                  }
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5 h-5"
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
              <h1 className="text-white text-2xl ml-3 font-bold">Series</h1>
              {serie.length !== 0 ? (
                <div className="text-white">
                  <main className="container mx-auto mt-10 pb-14">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mx-5">
                      {serie &&
                        serie.map((mov) => (
                          <div
                            className="shadow-lg rounded-lg flex flex-row items-center gap-5"
                            key={mov.id}
                          >
                            <Link href={`/serie/${mov.slug}`}>
                              <Image
                                alt=""
                                className="hover:opacity-75 opacity-100"
                                src={`https://image.tmdb.org/t/p/w300/${mov.mainImage}`}
                                loading="lazy"
                                width={150}
                                height={100}
                              />
                            </Link>
                            <div className="w-full flex flex-col items-start gap-4">
                              <h3 className="text-white font-semibold text-lg text-center ">
                                {mov.name}
                              </h3>
                              <button
                                className="h-10 items-center w-10 bg-red-500 flex justify-center rounded-lg border-2"
                                onClick={async () => {
                                  const { data, error } = await supabase
                                    .from("swatchlist")
                                    .delete()
                                    .eq("user_id", `${user.id}`)
                                    .eq("serie_id", mov.id);
                                  fetchSWatchlist();
                                  if (data) {
                                    console.log(data);
                                  } else {
                                    console.log(error);
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
                <div>
                  <div className="w-screen h-20 flex items-center px-6 text-md lg:text-xl xl:text-2xl text-gray-400">
                    Nothing to see here
                  </div>
                  <div className="bg-black pb-[60vh]"></div>
                </div>
              )}
            </>
          ) : (
            <div className="h-screen bg-black flex justify-center items-center">
              Loading...
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
