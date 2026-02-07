import {
    createBrowserClient,
    createServerClient,
    parseCookieHeader,
    serializeCookieHeader,
  } from "@supabase/ssr";
import type { MergeDeep, SetNonNullable, SetFieldType } from "type-fest";
import type { Database as SupabaseDatabase} from "database.types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type Database = MergeDeep<
	SupabaseDatabase,
    {
        public: {
            Views: {
                messages_view: {
                  Row: SetNonNullable<
                    SupabaseDatabase["public"]["Views"]["messages_view"]["Row"]
                  >;
                };
                community_post_list_view: {
                    Row: SetFieldType<SetNonNullable<
                        SupabaseDatabase["public"]["Views"]["community_post_list_view"]["Row"]
                    >,
                    "author_avatar",
                    string | null>;
                };
                product_overview_view: {
                    Row: SetNonNullable<
                      SupabaseDatabase["public"]["Views"]["product_overview_view"]["Row"]
                    >;
                  };
                community_post_detail: {
                    Row: SetNonNullable<
                      SupabaseDatabase["public"]["Views"]["community_post_detail"]["Row"]
                    >;
                };
                gpt_ideas_view: {
                    Row: SetNonNullable<
                      SupabaseDatabase["public"]["Views"]["gpt_ideas_view"]["Row"]
                    >;
                };
            };
        };
    }
>;

export const browserClient = createBrowserClient<Database>(
    supabaseUrl!,
    supabaseAnonKey!
);

export const makeSSRClient = (request: Request) => {
    const headers = new Headers();
    const serverSideClient = createServerClient<Database>(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        cookies: {
          getAll() {
            const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "");
            return cookies
              .filter((cookie): cookie is { name: string; value: string } => cookie.value !== undefined)
              .map(({ name, value }) => ({ name, value }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              headers.append(
                "Set-Cookie",
                serializeCookieHeader(name, value, options)
              );
            });
          },
        },
      }
    );
  
    return {
      client: serverSideClient,
      headers,
    };
  };

  export const adminClient = createClient<Database>(
    supabaseUrl!,
    supabaseServiceRoleKey!
  );
