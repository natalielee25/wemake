import type { Route } from "./+types/my-profile-page";
import { redirect } from "react-router";
import { makeSSRClient } from "~/supa-client";
import { ensureUserProfile } from "../queries";

//export const meta: Route.MetaFunction = () => [{ title: "My Profile | wemake" }];

export async function loader({ request }: Route.LoaderArgs) {
     const { client } = makeSSRClient(request);
     const {
       data: { user },
     } = await client.auth.getUser();
     if (user) {
       const profile = await ensureUserProfile(client, { id: user.id });
       console.log(profile, "profile");
       return redirect(`/users/${encodeURIComponent(profile.username)}`);
     }
     return redirect("/auth/login");
   }
