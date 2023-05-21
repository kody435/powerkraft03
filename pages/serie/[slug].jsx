import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
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
  const [relDate, setRelDate] = useState('N/A');

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
            console.log(jsonData);

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
              return cast.order < 12;
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
                return
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
      setRunTime("N/A");
    } else if (typeof runtime === 'string') {
      let hours = Math.floor(runtime / 60);
      let minutes = runtime % 60;
      let runtimeString = `${hours}h ${minutes}m`;
      setRunTime(runtimeString);
    } else if (Array.isArray(runtime)) {
      setRunTime('N/A')
    }
  }, [series, tmdb, user]);
  const router = useRouter();


  if (router.isFallback) {
    return (
      <div className="text-xl flex justify-center items-center">Loading...</div>
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
            src={`https://image.tmdb.org/t/p/w300/${series.mainImage}`}
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
              {series.name}
              <br />
            </h1>
            <div className="text-white text-md font-light italic text-center md:text-left">
              {`"` + data.tagline + `"`}
            </div>

            <div className="flex justify-center flex-row my-3 gap-5 md:justify-start">
              <div className="font-medium text-md text-white">{relDate}</div>
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
          <h3 className="block text-lg font-semibold text-gray-900 dark:text-white">
            Select season &nbsp;
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
            <h3 className="block text-lg font-semibold text-gray-900 dark:text-white">
              Select episode &nbsp;
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

      <div className="flex md:flex-row md:mx-6 mb-16 justify-center md:justify-start">
        <div
          onClick={() => setIsOpen(true)}
          className="flex justify-center items-center w-fit p-0.5 rounded-full border-2 border-white cursor-pointer"
        >
          <div className="flex flex-row bg-lime-500 w-fit px-6 py-2 rounded-full cursor-pointer ">
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
  // YOUR DB IS WRONG? Why? It is fetching correct data. no it should fetch a serie like this:
  /**
   * serie: {name: "sdfg", url: "https://vidmoly.com/embed/id/1-2"} why it should fetch like that.
   * Idk what you mean, but it is fetching correct data.
   * I don't think you are understanding what's happening here. Let me make it work around for you.
   */
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
