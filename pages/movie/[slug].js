import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

export default function Post({ movies }) {
  // const {tmdb, name} = movies
  let [isOpen, setIsOpen] = useState(true);
  const [data, setData] = useState({});
  const [tmdb, setTmdb] = useState("");

  useEffect(() => {
    if (movies.tmdb) {
      setTmdb(movies.tmdb);
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdb}?api_key=9a6cc794e0d32ccd83dc9b5bebda750b`
          );
          if (response.ok) {
            const jsonData = await response.json();
            console.log("Data: ", jsonData);
            setData(jsonData);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [movies, tmdb]);

  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // ok ?

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
        className="w-full h-full"
        allowFullScreen
      /> */}

      <h1 className="pl-5 text-3xl pt-8 w-screen mr-2 text-white">
        {movies.name}
        <br />
      </h1>

      <div className="bg-zinc-800 m-5 rounded-3xl text-white">
        <p className="pt-6 pb-6 pl-4 pr-4 ">
          <button onClick={() => setIsOpen(true)}>Watch Now</button>
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50 "
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-5/6 h-5/6 rounded bg-white">
                <iframe
                  src={`https://2embed.org/embed/movie?tmdb=${movies.tmdb}`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </Dialog.Panel>
            </div>
          </Dialog>
          <br />
          <br />
          <span className="font-bold">The Storyline</span> : {data.overview}
          <br></br>
          <br></br>
          <span className="font-bold">Duration</span> : {data.runtime}m<br></br>
          <br></br>
          <span className="font-bold">Release Year</span> : {data.release_date}
          <br></br>
          <br></br>
          <span className="font-bold">Genre</span> :{" "}
          {data &&
            data?.genres?.map((genre, index) => {
              return (
                <>
                  <span className="" key={genre.id}>
                    {genre.name}
                    {index !== data.genres.length - 1 && <span>, &nbsp;</span>}
                  </span>
                </>
              );
            })}
          <br></br>
          <br></br>
          <span className="font-bold">Spoken Language</span> :{" "}
          {data &&
            data?.spoken_languages?.map((genre, index) => {
              return (
                <>
                  <span className="" key={genre.id}>
                    {genre.name}
                    {index !== data.spoken_languages.length - 1 && (
                      <span>, &nbsp;</span>
                    )}
                  </span>
                </>
              );
            })}
        </p>
      </div>
    </div>
  );
}

// SO, did you redo all the changes ? those I undid, dont remember which. Can you check discord,
/**
 * so, is that question ? Yep, embed a video into modal. Nope. How to make a modal? I have no idea.
 *  https://headlessui.com/react/dialog, yea yea. i am on to it
 */

// ! Here only works at build time !
export async function getStaticPaths() {
  const { data: movies } = await supabase.from("movies").select("slug");
  const paths = movies.map(({ slug }) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: true,
  };
}
// ! Here only works at build time !
export async function getStaticProps({ params }) {
  const { slug } = params;
  const { data: movies } = await supabase
    .from("movies")
    .select()
    .filter("slug", "eq", slug)
    .single();

  return {
    props: {
      movies,
    },
  };
}
