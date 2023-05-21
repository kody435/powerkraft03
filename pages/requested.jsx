import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Requests(requests) {
  return (
    <div className="bg-black h-screen">
      <h1 className="mx-2 md:mx-4 pt-6 mb-9 w-fit text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-sky-400 to-emerald-400 py-1 ">
        Requested Films and Series
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {requests.requests.map((request) => (
          <div
            key={request.id}
            className="relative rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 m-2 md:m-4"
          >
            <div className="flex flex-col">
              <div>
                <h3 className="text-xl font-bold text-gray-100 sm:text-lg">
                  {request.name}
                </h3>

                <p className="mt-1 text-xs font-medium text-gray-400">
                  {request.category}
                </p>
              </div>
              {request.year && (
                <dl className="mt-6 flex flex-col sm:gap-6">
                  <div className="flex flex-col">
                    <dt className="text-md font-medium text-gray-300">
                      Release Year: {request.year}
                    </dt>
                  </div>
                </dl>
              )}
            </div>
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  let { data } = await supabase.from("requests").select();
  return {
    props: {
      requests: data,
    },
  };
}
