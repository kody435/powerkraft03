import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";

export default function Post({ movies }) {
  const [data, setData] = useState({});
  const [tmdb, setTmdb] = useState('');

  useEffect(() => {
    if (tmdb) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdb}?api_key=9a6cc794e0d32ccd83dc9b5bebda750b`
          );
          if (response.ok) {
            const jsonData = await response.json();
            console.log("Data: ", jsonData);
            setMovie(jsonData);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
      setTmdb(tmdb);
    }
  }, [movies, tmdb]);

  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.main}>
      <Head>
        <title>OCTULUS | {movies.name}</title>
        <meta
          name="description"
          content="Watch Movies, Series and Animes for free"
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
      {/* <iframe
        src={`https://2embed.org/embed/movie?tmdb=${movies.tmdb}`}
        className="w-screen h-screen"
        allowFullScreen
      /> */}
      <h1 className="pl-5 text-3xl pt-8 w-screen mr-2 text-white">
        {movies.name}
        <br />
      </h1>

      <div className="bg-zinc-800 m-5 rounded-3xl text-white">
        <p className="pt-6 pb-6 pl-4 pr-4 ">
          <span className="font-extrabold">The Storyline</span> :{" "}
          {data.overview}
          <br></br>
          <br></br>
          <span className="font-extrabold">Release Year</span> :{" "}
          {data.release_date}
        </p>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const { data } = await supabase.from("movies").select("slug");
  const paths = data.map((post) => ({
    params: { slug: post.slug },
  }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { data } = await supabase
    .from("movies")
    .select()
    .filter("slug", "eq", slug)
    .single();
  return {
    props: {
      movies: data,
    },
  };
}
