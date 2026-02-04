import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const createProductReview = async (
  client: SupabaseClient<Database>,
  {
    productId,
    review,
    rating,
    userId,
  }: { productId: string; review: string; rating: number; userId: string }
) => {
  const { error } = await client.from("reviews").insert({
    product_id: +productId,
    review,
    rating,
    profile_id: userId,
  });
  if (error) {
    throw error;
  }
};

export const createProduct = async (
    client: SupabaseClient<Database>,
    {
      name,
      tagline,
      description,
      howItWorks,
      url,
      iconUrl,
      categoryId,
      userId,
    }: {
      name: string;
      tagline: string;
      description: string;
      howItWorks: string;
      url: string;
      iconUrl: string;
      categoryId: number;
      userId: string;
    }
  ) => {
    const { data, error } = await client
      .from("products")
      .insert({
        name,
        tagline,
        description,
        how_it_works: howItWorks,
        url,
        icon: iconUrl,
        category_id: categoryId,
        profile_id: userId,
      })
      .select("product_id")
      .single();
    if (error) throw error;
    return data.product_id;
  };

export const toggleProductUpvote = async (
  client: SupabaseClient<Database>,
  { productId, userId }: { productId: string; userId: string }
) => {
  const productIdNumber = Number(productId);
  const { count, error: countError } = await client
    .from("product_upvotes")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productIdNumber)
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    const { error } = await client.from("product_upvotes").insert({
      product_id: productIdNumber,
      profile_id: userId,
    });
    if (error) throw error;
  } else {
    const { error } = await client
      .from("product_upvotes")
      .delete()
      .eq("product_id", productIdNumber)
      .eq("profile_id", userId);
    if (error) throw error;
  }
};
