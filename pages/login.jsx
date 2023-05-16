import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";


const LoginPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [data, setData] = useState();

  if (!user)
    return (
      <div className="mx-5 sm:mx-32 xl:mx-96">
        <Auth
          redirectTo="https://theoctulus.vercel.app"
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={["google", "github"]}
          socialLayout="horizontal"
        />
      </div>
    );

  return (
    <div className="mx-10">
      <h2>Email: {user.email}</h2>
      <h2>Login method: {user.app_metadata.provider}</h2>
      <h2>{user.role}</h2>
      <button
        onClick={() => supabaseClient.auth.signOut()}
        className="bg-black text-white px-7 py-2 rounded-full"
      >
        Sign out
      </button>
    </div>
  );
};

export default LoginPage;