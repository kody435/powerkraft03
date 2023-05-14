import Image from "next/image";
import { supabase } from "./../lib/supabaseClient";
import Link from "next/link";
import Slider from "../components/Slider";

function Page({ products }) {
  
  return (
    <div>
      <ul className="bg-white text-black grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 p-2 gap-2 md:gap-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`products/${product.slug}`}
            className="border h-48 flex flex-col justify-center items-center"
          >
            <Image
              src={product.MainImage}
              className="flex flex-row items-start"
              alt={product.name}
              width={200}
              height={200}
            />

            <h3 className="flex items-end">{product.name}</h3>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  // let { data } = await supabase
  //   .from("products")
  //   .select("*").match({Category: "alu"});

  let { data } = await supabase
    .from("products")
    .select("*");

  return {
    props: {
      products: data,
    },
  };
}

export default Page;