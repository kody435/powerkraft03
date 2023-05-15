import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

export default function Post({ movies }) {
  let [isOpen, setIsOpen] = useState(false);
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
    return <div className="text-xl flex justify-center items-center">Loading...</div>;
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

      <div
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/w1280/${data.backdrop_path}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: "1"
        }}
        className="h-screen bg-cover bg-center flex flex-col justify-end relative"
      >
        <div
          style={{
            backgroundImage: "linear-gradient(to top, black, transparent)",
          }}
          className="flex flex-col justify-end"
        >
          <div className="text-center flex flex-col justify-end items-start w-screen ml-5 pb-5">
            <Image
              alt=""
              className="opacity-100"
              src={movies.mainImage}
              loading="lazy"
              width={150}
              height={100}
            />
          </div>
          <div className="backdrop-blur-sm">
            <h1 className="pl-5 text-4xl mr-2 text-white font-bold bg-transparent backdrop-blur-sm">
              {movies.name}
              <br />
            </h1>
            <p className="text-white pl-5 backdrop-blur-sm">
              {`"` + data.tagline + `"`}
            </p>

            <div className=" rounded-3xl text-white bg-transparent relative pt-2">
              <div className=" pb-6 pl-4 pr-4 ">
                {/* <button onClick={() => setIsOpen(true)}>Watch Now</button>
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
              </Dialog> */}

                <br />
                <p className="font-medium text-md">{data.overview}</p>
                <br />
                <div className="flex lg:flex-row flex-col mt-2 md:mt-5 lg:mt-2">
                  <div className="flex flex-row space-x-5">
                    <p className="font-medium text-md">{data.release_date}</p>
                    <p className="font-medium text-md">{data.runtime}m</p>
                    {data &&
                      data?.spoken_languages?.map((genre, index) => {
                        return (
                            <span
                              className="font-medium text-md"
                              key={genre.id}
                            >
                              {genre.name}
                              {index !== data.spoken_languages.length - 1 && (
                                <span>, &nbsp;</span>
                              )}
                            </span>
                        );
                      })}
                  </div>
                  <div className="lg:mx-5">
                    {data &&
                      data?.genres?.map((genre, index) => {
                        return (
                          <span
                            className="font-medium text-md space-x-0"
                            key={genre.id}
                          >
                            {genre.name}
                            {index !== data.genres.length - 1 && (
                              <span>,&nbsp;</span>
                            )}
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
