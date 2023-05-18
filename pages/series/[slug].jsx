import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { Tab } from "@headlessui/react";

export default function Post({ series }) {
  let [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [tmdb, setTmdb] = useState("");
  const user = useUser();
  const [select, setSelect] = useState("1");
  const [selectedEpisode, setSelectedEpisode] = useState("1");
  let s = 1;

  useEffect(() => {
    console.log("Series: ",series);
    if (series.tmdb) {
      setTmdb(series.tmdb);
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${tmdb}?api_key=9a6cc794e0d32ccd83dc9b5bebda750b`
          );
          if (response.ok) {
            const jsonData = await response.json();
            setData(jsonData);
            console.log(jsonData);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [series, tmdb, user]);
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="text-xl flex justify-center items-center">Loading...</div>
    );
  }

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedEpi(selectedValue);
    console.log("Selected value: ", selectedValue);
  };

  return (
    <div className={styles.main}>
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
        <meta property="og:url" content="https://riddles-mocha.vercel.app/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/w1280/${data.backdrop_path}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "fit",
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
              src={`https://image.tmdb.org/t/p/w300/${series.mainImage}`}
              loading="lazy"
              width={150}
              height={100}
            />
          </div>
          <div className="backdrop-blur-sm">
            <h1 className="pl-5 text-4xl mr-2 h-fit text-white font-bold bg-transparent backdrop-blur-sm">
              {series.name}
              <br />
            </h1>
            <p className="text-white pl-5 backdrop-blur-sm italic">
              {`"` + data.tagline + `"`}
            </p>

            <div className=" rounded-3xl text-white bg-transparent relative">
              <div className="mb-6 pl-4 pr-4 ">
                <br />
                <p className="font-medium text-md">{data.overview}</p>
                <div className="flex md:flex-row flex-col mb-7 mt-5">
                  <div className="flex flex-row space-x-5">
                    <p className="font-medium text-md">{data.first_air_date}</p>
                    <p className="font-medium text-md">
                      {data.episode_run_time}m
                    </p>
                  </div>
                  <div className="md:mx-5 mt-2 md:mt-0">
                    {data &&
                      data?.spoken_languages?.map((genre, index) => {
                        return (
                          <span className="font-medium text-md" key={genre.id}>
                            {genre.name}
                            {index !== data.spoken_languages.length - 1 && (
                              <span>, &nbsp;</span>
                            )}
                          </span>
                        );
                      })}
                  </div>
                  <div className="md:mx-5 mt-2 md:mt-0">
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
                <div>
                  Select season &nbsp;
                  <select
                    value={select}
                    onChange={(e) => setSelect(e.target.value)}
                  >
                    {series.dataArray.map((_, index) => (
                      <option key={index}>{index + 1}</option>
                    ))}
                  </select>
                  {select && (
                    <div>
                      Select episode &nbsp;
                      <select
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

                {/* Watch Now button */}
                <div className="flex flex-col md:flex-row gap-5">
                  <div
                    onClick={() => setIsOpen(true)}
                    className="flex justify-center items-center w-fit p-0.5 rounded-full border border-white cursor-pointer"
                  >
                    <div className="flex flex-row bg-lime-600 w-fit px-6 py-2 rounded-full ">
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
                      &nbsp; Watch Now
                    </div>
                  </div>
                </div>
                <Dialog
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  className="relative z-50 "
                >
                  <div
                    className="fixed inset-0 bg-black/80"
                    aria-hidden="true"
                  />
                  <div className="fixed inset-0 flex items-center justify-center p-2">
                    <Dialog.Panel className="lg:w-5/6 lg:h-5/6 w-screen h-2/6 md:w-5/6 md:h-3/6 rounded bg-white">
                      <iframe
                        src={`https://2embed.org/embed/series?tmdb=${series.tmdb}&s=${select}&e=${selectedEpisode}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </Dialog.Panel>
                  </div>
                </Dialog>
              </div>
            </div>
          </div>
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
