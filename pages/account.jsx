/* eslint-disable react-hooks/exhaustive-deps */
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

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
      try {
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
    <div className="bg-black h-screen w-screen text-white">
      <Toaster />
      {!user ? (
        <div className="mx-2 sm:mx-8 md:mx-20 lg:mx-36 xl:mx-64 2xl:mx-80">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            socialLayout="horizontal"
            providers={["google", "github"]}
            theme="dark"
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
              <div className="underline">{username ? <>{username}</> : <>{user.email}</>}</div>
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
                    className="rounded-full px-4 w-72 ring-1 ring-white py-1"
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
          <button
            className="bg-red-500 rounded-full px-16 py-2"
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
