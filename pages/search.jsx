import Image from "next/image";
import { supabase } from "./../lib/supabaseClient";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

function Page({ movies }) {

    const [searchQuery, setSearchQuery] = useState("");

    async function searchMovies() {
        const { data, error } = await supabase
          .from("movies")
          .select()
          .textSearch("name", "fast");
        console.log(data, error);
    }

  return (
    <div className="flex flex-col bg-black h-screen">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-lg shadow-lg p-2 text-white" placeholder="Search" />
          <div onClick={searchMovies} className="text-black bg-white rounded-2xl">Submit</div>
    </div>
  );
}

export default Page;