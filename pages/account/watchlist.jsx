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
      {user && movie && serie ? (
        <div className="py-10 z-50">
          <h1 className="text-white text-2xl ml-6 font-bold">Movies</h1>
          {movie.length !== 0 ? (
            <div className="text-white">
              <main className="container mx-auto my-10 px-3 md:px-0">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                  {movie.map((mov) => (
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
            <div className="w-screen h-20 flex items-end px-20 text-md lg:text-xl xl:text-2xl text-gray-500">
              Nothing to see here
            </div>
          )}
          <br />
          <br />
          <h1 className="text-white text-2xl ml-6 font-bold">Series</h1>
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
            <div className="w-screen h-20 flex items-end px-20 text-md lg:text-xl xl:text-2xl text-gray-500">
              Nothing to see here
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
