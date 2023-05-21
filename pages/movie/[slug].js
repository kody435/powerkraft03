import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useUser } from "@supabase/auth-helpers-react";

export default function Post({ movies }) {
  let [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [tmdb, setTmdb] = useState("");
  const user = useUser();
  const [writer, setWriter] = useState([]);
  const [director, setDirector] = useState([]);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (movies.tmdb) {
      setTmdb(movies.tmdb);
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdb}?api_key=9a6cc794e0d32ccd83dc9b5bebda750b&append_to_response=videos,credits`
          );
          if (response.ok) {
            const jsonData = await response.json();
            setData(jsonData);
            console.log(jsonData);

            // director
            let director = jsonData.credits.crew;
            director = director.filter((crew) => {
              return crew.job === "Director";
            });
            setDirector(director[0].name);

            // writer
            let writer = jsonData.credits.crew;
            writer = writer.filter((crew) => {
              return crew.job === "Writer" || crew.job === "Story";
            });
            setWriter(writer[0].name);

            // cast
            let cast = jsonData.credits.cast;
            cast = cast.filter((cast) => {
              return cast.order < 12;
            });
            setCast(cast);

            // videos
            let videos = jsonData.videos.results;
            videos = videos.filter((video) => {
              return video.type === "Trailer";
            });
            setVideos(videos);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [movies, tmdb, user]);

  let releaseDate = data.release_date;
  releaseDate = releaseDate?.split("-")[0];

  let runtime = data.runtime;
  let hours = Math.floor(runtime / 60);
  let minutes = runtime % 60;
  let runtimeString = `${hours}h ${minutes}m`;

  // async function watchLater() {
  //   const { data, error } = await supabase
  //     .from("watchlist")
  //     .insert([{ user_id: user.id, movie_id: movies.id }]);
  //   if (data) {
  //     return;
  //   } else {
  //     console.log(error);
  //   }
  // }

  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="text-xl text-white bg-black w-screen h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-black">
      <div
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/w1280/${data.backdrop_path}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "fit",
          backgroundPosition: "center",
        }}
        className="bg-cover bg-center flex flex-col justify-end relative backdrop-opacity-30 "
      >
        <div className="flex flex-col gap-6 justify-end items-center w-screen md:items-start backdrop-blur-sm backdrop-brightness-75 ">
          <Image
            alt=""
            className="opacity-100 grid-cols-1 rounded-lg shadow-black shadow-2xl md:ml-10 my-12  md:mt-36 "
            src={`https://image.tmdb.org/t/p/w300/${movies.mainImage}`}
            loading="lazy"
            width={150}
            height={100}
          />

          <div
            className="w-screen px-6"
            style={{
              backgroundImage:
                "linear-gradient(to top, black, black, transparent)",
            }}
          >
            <h1 className="text-4xl h-fit text-white font-bold bg-transparent text-center md:text-left">
              {movies.name}
              <br />
            </h1>
            <div className="text-white text-md font-light italic text-center md:text-left">
              {`"` + data.tagline + `"`}
            </div>

            <div className="flex justify-center flex-row my-3 gap-5 md:justify-start">
              <div className="font-medium text-md text-white">
                {releaseDate}
              </div>
              <div className="font-medium text-md text-white">
                {runtimeString}
              </div>
              {data &&
                data?.spoken_languages?.map((genre, index) => {
                  return (
                    <span className="font-medium text-md" key={index}>
                      {genre.name}
                      {index !== data.spoken_languages.length - 1 && (
                        <span>, &nbsp;</span>
                      )}
                    </span>
                  );
                })}
            </div>
            <div className="flex flex-row justify-center md:justify-start mb-7 mt-4 space-x-2">
              {data.genres?.map((genre) => {
                return (
                  <div
                    key={genre.id}
                    className="flex flex-row rounded-full text-sm font-semibold text-white"
                  >
                    {genre.name}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col justify-end md:py-4 text-white text-center md:text-left">
              {data.overview}
            </div>
            <div className="flex flex-col justify-end text-white my-6 text-center md:text-left">
              {director !== null ? (
                <div className="text-gray-300">
                  Directed by: <span className="text-white">{director}</span>
                </div>
              ) : (
                <div></div>
              )}
              {writer.length > 0 ? (
                <div className="text-gray-300">
                  Written by: <span className="text-white">{writer}</span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:flex-row md:mx-6 mb-16 justify-center md:justify-start">
        <div
          onClick={() => setIsOpen(true)}
          className="flex justify-center items-center w-fit p-0.5 h-fit rounded-full border border-white cursor-pointer"
        >
          <div className="flex flex-row bg-lime-500 w-fit px-6 py-2 rounded-full cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
            &nbsp; Watch Now{" "}
          </div>
        </div>
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 "
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2">
          <Dialog.Panel className="lg:w-5/6 lg:h-5/6 w-screen h-2/6 md:w-5/6 md:h-3/6 rounded bg-white">
            <iframe
              src={`https://vidsrc.me/embed/${movies.tmdb}`}
              className="w-full h-full"
              allowFullScreen
            />
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex flex-col my-7 gap-6 ">
        <div className="text-white flex flex-col mx-2 sm:mx-3 md:mx-5 mb-10">
          {cast.length > 0 ? (
            <>
              <h2 className="text-white font-bold text-xl md:text-2xl">Cast</h2>
              <div className="flex whitespace-nowrap md:space-x-3 overflow-x-scroll scroll-ms-72 h-fit cursor-pointer">
                {cast.map((cast, index) => (
                  <div
                    className="flex flex-col text-center px-3 py-3 md:px-3 gap-2 cursor-pointer justify-center items-center "
                    key={index}
                  >
                    <Image
                      alt=""
                      className="opacity-100 rounded-full border-2 h-28 w-28 cursor-pointer"
                      src={`https://image.tmdb.org/t/p/w300_and_h300_face/${cast.profile_path}`}
                      loading="lazy"
                      width={200}
                      height={200}
                    />
                    <div className="text-white text-sm w-28 overflow-x-hidden text-center">
                      <div className="text-white" title={cast.name}>
                        {cast.name}
                      </div>
                      <div className="text-gray-400" title={cast.character}>
                        {cast.character}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
          <br />
          <br />
          {videos.length > 0 ? (
            <div>
              <h2 className="text-white font-bold text-xl md:text-2xl">
                Videos
              </h2>
              <div className="flex flex-row justify-start overflow-x-scroll gap-3 ">
                {videos.map((video, index) => (
                  <div
                    className="flex flex-col text-center px-1 py-3 md:px-3 gap-0 cursor-pointer justify-center items-start"
                    key={index}
                  >
                    <iframe
                      className="rounded-lg shadow-black shadow-2xl"
                      width="300"
                      height="200"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      allowFullScreen
                    ></iframe>
                    <div className="text-white text-sm font-semibold overflow-x-hidden text-center">
                      <div className="text-white" title={video.name}>
                        {video.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

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
