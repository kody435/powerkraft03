import React from "react";
import Image from "next/image";
import Carousel from "nuka-carousel";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Slider({ slider }) {
    console.log(slider)
    return (
        <>{"hello" + slider }</>
    )
}

export async function getServerSideProps() {
  // let { data } = await supabase
  //   .from("products")
  //   .select("*").match({Category: "alu"});

    let { data } = await supabase.from("slider").select();
    console.log(data)

  return {
    props: {
      slider: data,
    },
  };
}

export default Slider;
