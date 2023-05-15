import Image from "next/image";
import { supabase } from "./../lib/supabaseClient";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

function Page({ movies }) {
  return (
    <div className={styles.main}>
      <Head>
        <title>OCTULUS | Movies</title>
        <meta
          name="description"
          content="WebApp made by Param Patel, to watch Movies, Series and Animes"
        />
        <meta property="og:title" content="Watch Movies, Series and Animes" />
        <meta
          property="og:description"
          content="Only go-to site for watching Movies, Series and Animes"
        />
        <meta property="og:url" content="https://riddles-mocha.vercel.app/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container px-auto py-10 px-4 bg-black w-screen">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {movies.map((movie) => (
            <Link
              href={`/movie/${movie.slug}`}
              className="shadow-lg rounded-lg"
              key=""
            >
              <div className="text-center flex flex-col items-center justify-center">
                <Image
                  alt=""
                  className="rounded-lg hover:opacity-75 opacity-100"
                  src={`https://image.tmdb.org/t/p/w300/${movie.mainImage}`}
                  loading="lazy"
                  width={150}
                  height={100}
                />
                <h3 className="text-white font-bolder text-md  ">
                  {movie.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  // let { data } = await supabase
  //   .from("products")
  //   .select("*").match({Category: "alu"});

  let { data } = await supabase.from("movies").select();

  return {
    props: {
      movies: data,
    },
  };
}

export default Page;
