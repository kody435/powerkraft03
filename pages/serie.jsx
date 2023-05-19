import Image from "next/image";
import { supabase } from "./../lib/supabaseClient";
import Link from "next/link";
import Head from "next/head";

function Page({ movies }) {
  return (
    <div className="flex flex-col bg-black h-screen">
      <Head>
        <title>OCTULUS</title>
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
      <main className="container mx-auto my-10 px-3 md:px-0">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {movies.map((movie) => (
            <Link
              href={`/serie/${movie.slug}`}
              className="shadow-lg rounded-lg flex flex-col items-center"
              key={movie.id}
            >
              <Image
                alt=""
                className="rounded-lg hover:opacity-75 opacity-100"
                src={`https://image.tmdb.org/t/p/w300/${movie.mainImage}`}
                loading="lazy"
                width={150}
                height={100}
              />
              <h3 className="text-white font-bolder text-md text-center ">
                {movie.name}
              </h3>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  let { data } = await supabase.from("series").select(`mainImage, name, slug`).range(0, 56);
  return {
    props: {
      movies: data,
    },
  };
}

export default Page;
