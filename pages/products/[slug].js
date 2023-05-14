/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";

export default function Post({ post }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {post.images.map((img) => (
        <Image key="" src={img} alt={post.name} width={300} height={300} />
      ))}
    </div>
  );
}

export async function getStaticPaths() {
  const { data } = await supabase.from("products").select("slug");
  const paths = data.map((post) => ({
    params: { slug: post.slug },
  }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { data } = await supabase
    .from("products")
    .select()
    .filter("slug", "eq", slug)
    .single();
  return {
    props: {
      post: data
    },
  };
}