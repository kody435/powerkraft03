import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function Watchlist() {
  const router = useRouter();
  const user = useUser();
  const [data, setData] = useState({});

  useEffect(() => {
    fetchWatchlist();
  }, [router, user]);

  async function fetchWatchlist() {
    if (user) {
      try {
        const { data, error } = await supabase
          .from("movies")
          .select("watchlist.user_id, movies.*")
          .join("watchlist", { "movies.id": "watchlist.movie_id" })
          .join("profiles", { "profiles.id": "watchlist.user_id" })
          .eq("profiles.id", "a6a61765-c2a2-406a-a465-695b8ee10b80");

        if (data) {
          console.log(data);
          setData(data);
        } else if (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  }

  return (
    <div>
      <Toaster />
      {user && data ? (
        <>
          <h1>Watchlist</h1>
          <p>{data.movie_id}</p>
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
