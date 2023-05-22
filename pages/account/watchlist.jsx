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

  const fetchWatchlist = useCallback(async () => {
    if (user) {
      const { data, error } = await supabase
        .from(`movies`)
        .select("*, watchlist!inner(*), profiles(*)")
        .eq("watchlist.user_id", "b3a78a0c-1760-443e-acbe-7d69b3db7e97");
      if (data) {
        setMovie(data);
        console.log(data.map(($) => $.name)); //
      } else {
        console.log(error);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [router, user, fetchWatchlist]);

  return (
    <div className="bg-black text-white h-screen">
      <Toaster />
      {user && movie ? (
        <>
          <h1>Watchlist</h1>
          <div className="text-white">
            {movie?.map((mov, idx) => (
              <div key={idx}>
                <Image
                  alt=""
                  className="opacity-100 grid-cols-1 rounded-lg shadow-black shadow-2xl md:ml-10 my-12  md:mt-36 "
                  src={`https://image.tmdb.org/t/p/w300/${mov.mainImage}`}
                  loading="lazy"
                  width={150}
                  height={100}
                />
                {mov.name}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center w-screen h-screen bg-black text-white flex items-center justify-center text-md md:text-lg xl:text-xl 2xl:text-2xl">
          Please&nbsp;
          <Link href="/account" className="text-red-500">
            sign in
          </Link>
          &nbsp;first to see your Watchlist
        </div>
      )}
    </div>
  );
}
