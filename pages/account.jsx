import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

const Home = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const router = useRouter();

  console.log(user);

  useEffect(() => {
    getProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateProfile = async () => {
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
  };

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
          console.log(data);
        } else if (error) {
          console.log(error);
          toast.error("Error fetching profile, try again later");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <Toaster />
      {!user ? (
        <div className="mx-2 sm:mx-8 md:mx-20 lg:mx-36 xl:mx-64 2xl:mx-72">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
          />
        </div>
      ) : (
        <div className="gap-10 flex flex-col px-5">
          {/* <Image
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full"
          /> */}
            
            {user.user_metadata.avatar_url ? (
              <Image
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full"
              />
            ) : (
              <></>)
            }

          Logged in as {username ? <>{username}</> : <>{user.email}</>}
          <br />
          {username ? (
            <>Email: {user.email}</>
          ) : (
            <div className="flex flex-col gap-2 px-0.5">
              Please enter a username
              <input
                type="text"
                placeholder="USERNAME"
                value={newUsername}
                className="rounded-full px-4 w-72"
                onChange={(e) => {
                  setNewUsername(e.target.value);
                }}
              />
              <button
                className="bg-emerald-500 w-fit rounded-full"
                onClick={updateProfile}
              >
                Update
              </button>
            </div>
          )}
          <br />
          <button
            className="bg-red-500"
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
