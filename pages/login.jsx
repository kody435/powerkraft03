import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";


const LoginPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [data, setData] = useState();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from("test").select("*");
      setData(data);
    }
    // Only run query once user is logged in.
    if (user) loadData();
  }, [user, supabaseClient]);

  if (!user)
    return (
      <div className="mx-5 sm:mx-32 xl:mx-96">
        <Auth
          redirectTo="https://theoctulus.vercel.app"
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={["google", "github", "facebook"]}
          socialLayout="horizontal"
        />
      </div>
    );

  return (
    <div className="mx-10">
      <pre>{JSON.stringify(user.providers, null, 2)}</pre>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <pre>{JSON.stringify(user.email, null, 2)}</pre>
    </div>
  );
};

export default LoginPage;
