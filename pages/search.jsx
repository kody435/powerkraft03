import Image from "next/image";
import { supabase } from "./../lib/supabaseClient";
import Link from "next/link";
import { useState } from "react";

function Page() {
  let [searchQuery, setSearchQuery] = useState("");
  let [searchData, setSearchData] = useState([]);
  let [error, setError] = useState(false);
  let [searchType, setSearchType] = useState("movies");

  // async function searchMovies() {
  //   searchQuery = searchQuery.split(" ").join("|");
  //   const modifiedQuery = searchQuery
  //     .replace(/[^a-zA-Z0-9\s]/g, "")
  //     .replace(/\s/g, "");

  //   Promise.all([
  //     await supabase
  //       .from("movies")
  //       .select(`mainImage, slug, name, slugType`)
  //       .textSearch("name", modifiedQuery),
  //     await supabase
  //       .from("series")
  //       .select(`mainImage, slug, name, slugType`)
  //       .textSearch("name", modifiedQuery),
  //   ])
  //     .then((data) => {
  //       setSearchData(data);
  //     })
  //     .catch((err) => {
  //       setError(err);
  //     });
  // }

  async function searchResults() {
    searchQuery = searchQuery.split(" ").join("|");
    const modifiedQuery = searchQuery
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s/g, "");

    const { data, error } = await supabase
      .from(searchType)
      .select(`mainImage, slug, name, slugType`)
      .textSearch("name", modifiedQuery);
    console.log(data);
    setSearchData(data);
  }

  return (
    <div className="flex flex-col bg-black ">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mx-10 my-2 rounded-full px-5 py-2 text-black border "
          placeholder="Search"
        />

        <div className="flex flex-row justify-center gap-5 ">
          <select
            className="text-center px-5 rounded-full"
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
            }}
          >
            <option value="movies">Movie</option>
            <option value="series">Series</option>
          </select>

          <div
            onClick={searchResults}
            className="text-black bg-white rounded-full w-fit px-5 py-2 flex flex-row justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`text-lg text-black z-50 bg-white font-bold w-4 h-4 flex items-center rounded-sm `}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            &nbsp; Search
          </div>
        </div>
      </div>
      <div className="container mx-auto my-10 px-4">
        {searchData &&
          searchData.map((movie, idx) => {
            return (
              <div key={idx}>
                {movie.slugType === "movie" && (
                  <div
                    className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6"
                    key={movie.id}
                  >
                    <Link
                      href={`/${movie.slugType}/${movie.slug}`}
                      className="shadow-lg rounded-lg"
                      key={movie.id}
                    >
                      <div className="text-center">
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
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Page;
