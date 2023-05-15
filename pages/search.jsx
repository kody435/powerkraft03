import Image from "next/image";
import { supabase } from "./../lib/supabaseClient";
import Link from "next/link";
import { useState, useEffect } from "react";

function Page() {
  let [searchQuery, setSearchQuery] = useState("");
  let [searchData, setSearchData] = useState([]);

  async function searchMovies() {
    searchQuery = searchQuery.split(" ").join("|");
    const { data, error } = await supabase
      .from("movies")
      .select()
      .textSearch("name", searchQuery);
    console.log(data, error);
    setSearchData(data);
  }

  return (
    <div className="flex flex-col bg-black h-screen">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mx-5 my-2 w-96 rounded-full px-5 py-2 text-white border "
          placeholder="Search"
        />
        <div
          onClick={searchMovies}
          className="text-black bg-white rounded-full w-fit px-5 py-2 mx-5"
        >
          Search
        </div>
      </div>
      <main className="container mx-auto my-10 px-4 ">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
          {searchData.map((movie) => (
            <Link
              href={`/movie/${movie.slug}`}
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
          ))}
        </div>
      </main>
    </div>
  );
}

export default Page;
