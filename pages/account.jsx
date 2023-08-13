/* eslint-disable react-hooks/exhaustive-deps */
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Head from "next/head";

const Home = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    getProfile();
  }, [user]);

  async function getProfile() {
    if (!user) {
      return;
    } else {
      console.log(user); //

      try {
        let {data, error} = await supabase.from('profiles').select('teacher').eq("id", user.id).single();

        if (data) {
          console.log("Teacher: " + data)
        } else if (error) {
          console.log('Error' + eror);
        } else {
          console.log('hit the else')
        }
      } catch {
        console.log("Can't fetch data")
      }
      
      try {
        setLoading(true);
        let { data, error } = await supabase
          .from("profiles")
          .select(`username`)
          .eq("id", user.id)
          .single();

        if (data) {
          setUsername(data.username);
        } else if (error) {
          console.log(error);
          toast.error("Error fetching profile, try again later");
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const updateProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .update({ username: newUsername })
      .eq("id", user.id)
      .single();

    setNewUsername("");

    if (error) {
      console.log(error);
      toast.error("Error updating profile, try again later");
    } else {
      console.log(data);
      toast.success("Profile updated successfully");
    }

    getProfile();
    setLoading(false);
  };

  return (
    <div className="bg-black h-screen w-screen text-white py-2">
      <Head>
        <title>OCTULUS | Account</title>
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
      <Toaster />
      {!user ? (
        <div className="mx-10 sm:mx-36 md:mx-44 lg:mx-80 xl:mx-96 2xl:mx-96">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            socialLayout="horizontal"
            providers={["google", "github"]}
            theme="dark"
            socialColors={true}
            redirectTo="/account"
            darkMode={true}
            magicLink={true}
            magicLinkAttempts={3}
            view="sign_up"
            passwordless={true}
            passwordlessAutoSubmit={true}
          />
        </div>
      ) : (
        <div className="gap-2 flex flex-col justify-center items-center mx-2 sm:mx-8 md:mx-20 lg:mx-36 xl:mx-64 2xl:mx-80 ">
          {user.user_metadata.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <></>
          )}

          {loading ? (
            <>Loading...</>
          ) : (
            <>
              <div className="underline">
                {username ? <>{username}</> : <>{user.email}</>}
              </div>
              <br />
              {username ? (
                <>{user.email}</>
              ) : (
                <div className="flex flex-col gap-2 px-0.5 items-center">
                  Please enter a username
                  <input
                    type="text"
                    placeholder="username"
                    value={newUsername}
                    className="rounded-full px-4 w-72 ring-1 ring-white py-1 text-black"
                    onChange={(e) => {
                      setNewUsername(e.target.value);
                    }}
                  />
                  <button
                    className="bg-emerald-500 w-fit rounded-full px-7 py-2 mt-10"
                    onClick={updateProfile}
                  >
                    Update
                  </button>
                </div>
              )}
            </>
          )}
          <br />
          <Link
            href="/account/watchlist"
            className="text-white mt-20 mb-10 rounded-full "
          >
            <div className="rounded-full font-bold px-12 py-2 bg-gradient-to-r from-indigo-600 from-10% via-sky-600 via-30% to-emerald-600 to-90%">
              My Watchlist
            </div>
          </Link>
          <br />
          <button
            className="bg-red-500 rounded-full px-16 py-2 font-bold"
            onClick={() => supabase.auth.signOut()}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
