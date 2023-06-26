/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useUser } from "@supabase/auth-helpers-react";

export default function Post({ series }) {
  let [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [tmdb, setTmdb] = useState("");
  const user = useUser();
  const [select, setSelect] = useState("1");
  const [selectedEpisode, setSelectedEpisode] = useState("1");
  const [writer, setWriter] = useState([]);
  const [director, setDirector] = useState([]);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [runTime, setRunTime] = useState("");
  const [relDate, setRelDate] = useState("");

  useEffect(() => {
    if (series.tmdb) {
      setTmdb(series.tmdb);
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${tmdb}?api_key=9a6cc794e0d32ccd83dc9b5bebda750b&append_to_response=videos,credits`
          );
          if (response.ok) {
            const jsonData = await response.json();
            setData(jsonData);

            // director
            let director = jsonData.credits.crew;
            director = director.filter((crew) => {
              return crew.job === "Director";
            });

            // writer
            let writer = jsonData.credits.crew;
            writer = writer.filter((crew) => {
              return crew.job === "Writer" || crew.job === "Story";
            });

            // cast
            let cast = jsonData.credits.cast;
            cast = cast.filter((cast) => {
              return cast.order < 30;
            });
            setCast(cast);

            // videos
            let videos = jsonData.videos.results;
            videos = videos.filter((video) => {
              return video;
            });
            setVideos(videos);

            if (jsonData.credits !== undefined) {
              if (director[0].name !== undefined) {
                setDirector(director[0].name);
              } else if (writer[0].name !== undefined) {
                setWriter(writer[0].name);
              } else {
                return;
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
    let releaseDate = data.first_air_date;
    releaseDate = releaseDate?.split("-")[0];
    setRelDate(releaseDate);

    let runtime = data.episode_run_time;
    if (runtime === undefined) {
      setRunTime("");
    } else if (typeof runtime === "string") {
      let hours = Math.floor(runtime / 60);
      let minutes = runtime % 60;
      let runtimeString = `${hours}h ${minutes}m`;
      setRunTime(runtimeString);
    } else if (Array.isArray(runtime)) {
      setRunTime("");
    }
  }, [series, tmdb, user]);
  const router = useRouter();
  async function watchLater() {
    const { data, error } = await supabase
      .from("swatchlist")
      .insert({ user_id: `${user.id}`, serie_id: `${series.id}` });
    if (data) {
      // ! not pushing here cuz of error
      router.push("/account/watchlist");
      return;
    } else {
      console.log(error);
    }
  }

  if (router.isFallback) {
    return (
      <div className="text-xl flex justify-center items-center">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col bg-black">
      <Head>
        <title>OCTULUS | {series.name}</title>
        <meta
          name="description"
          content="Watch Movies, Series and Animes for free"
        />
        <meta property="og:title" content="Watch Movies, Series and Animes" />
        <meta
          property="og:description"
          content="Only go-to site for watching Movies, Series and Animes"
        />
        <meta property="og:url" content="https://theoctulus.vercel.app/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
          {series && (
            <Image
              alt=""
              className="opacity-100 grid-cols-1 rounded-lg shadow-black shadow-2xl md:ml-10 my-12  md:mt-36 "
              src={`https://image.tmdb.org/t/p/w300/${series.mainImage}`}
              loading="lazy"
              width={150}
              height={100} // i need to go now, wait build. i ll check, then you can go
            />
          )}

          <div
            className="w-screen px-6"
            style={{
              backgroundImage:
                "linear-gradient(to top, black, black, transparent)",
            }}
          >
            <h1 className="text-4xl h-fit text-white font-bold bg-transparent text-center md:text-left">
              {series.name}
              <br />
            </h1>
            {data.tagline && (
              <div className="text-white text-md font-light italic text-center md:text-left">
              {`"` + data.tagline + `"`}
              </div>
            )}

            <div className="flex justify-center flex-row my-3 gap-5 md:justify-start">
              {relDate === null && (
                <div className="font-medium text-md text-white">{relDate}</div>
              )}
              {runTime === null ? (
                <></>
              ) : (
                <div className="font-medium text-md text-white">{runTime}</div>
              )}
            </div>
            <div className="flex text-white justify-center md:justify-start">
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

            <div className="flex flex-col justify-end md:py-2 text-white text-center md:text-left">
              {data.overview}
            </div>
            <div className="flex flex-col justify-end text-white my-6 text-center md:text-left">
              {director > 0 ? (
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

      <div className="mb-8 md:mb-5 mx-6 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-5 lg:gap-8">
        <div className="flex flex-row items-center w-fit h-fit">
          <h3 className="block text-lg font-semibold text-white">
            Season &nbsp;
          </h3>
          <select
            value={select}
            onChange={(e) => setSelect(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit h-fit p-1 dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {series.dataArray.map((_, index) => (
              <option key={index}>{index + 1}</option>
            ))}
          </select>
        </div>
        {select && (
          <div className="flex flex-row items-center w-fit h-fit">
            <h3 className="block text-lg font-semibold text-white">
              Episode &nbsp;
            </h3>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit h-fit p-1 dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedEpisode}
              onChange={(e) => setSelectedEpisode(e.target.value)}
            >
              {[...Array(series.dataArray[select - 1].maxEpisodes)].map(
                (_, index) => (
                  <option key={index}>{index + 1}</option>
                )
              )}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-5 md:mx-6 mt-4 mb-14 items-center md:justify-start">
        <button
          className="p-0.5 border-2 h-fit w-fit rounded-full cursor-pointer"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <div className="bg-green-400 flex flex-row rounded-full py-2.5 px-7 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 cursor-pointer"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="cursor-pointer font-bold">&nbsp; Watch Now </h3>
          </div>
        </button>

        {user ? (
          <button
            className="p-0.5 border-2 h-fit w-fit rounded-full cursor-pointer"
            onClick={watchLater}
          >
            <div className="bg-blue-500 flex flex-row rounded-full py-2.5 px-7 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <h3 className="cursor-pointer font-bold">&nbsp; Watch Later </h3>
            </div>
          </button>
        ) : (
          <></>
        )}
      </div>
      {/* le me ask sth. Why i cant see "delete" button at watchlist, or should i see even without anything on watchlist. Cuz because of i cant see that button, i cant test its functionality. */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 "
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2">
          <Dialog.Panel className="lg:w-5/6 lg:h-5/6 w-screen h-2/6 md:w-5/6 md:h-3/6 rounded bg-white">
            {series.provider == 1 && (
              <iframe
                src={`https://vidsrc.me/embed/${series.tmdb}/${select}-${selectedEpisode}`}
                className="w-full h-full"
                allowFullScreen
              />
            )}
            {series.provider == 2 && (
              <iframe
                src={`https://2embed.org/embed/series?tmdb=${series.tmdb}&s=${select}&e=${selectedEpisode}`}
                className="w-full h-full"
                allowFullScreen
              />
            )}
            {series.provider == "" && (
              <iframe
                src={`https://v2.vidsrc.me/embed/${series.tmdb}/${select}-${selectedEpisode}`}
                className="w-full h-full"
                allowFullScreen
              />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex flex-col mb-7 gap-6 ">
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
                        {video.name.length > 42 ? (
                          <div>{video.name.substring(0, 42)}...</div>
                        ) : (
                          <div>{video.name.substring(0, 42)}</div>
                        )}
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
  const { data: movies } = await supabase.from("series").select("slug");
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
  const { data: series } = await supabase
    .from("series")
    .select()
    .filter("slug", "eq", slug)
    .single();

  return {
    props: {
      series,
    },
  };
}
