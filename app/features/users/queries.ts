import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import { productListSelect } from "../products/queries";
import { redirect } from "react-router";

export const getUserProfile = async (
    client: SupabaseClient<Database>,
    { username }: { username: string }
  ) => {
  const { data, error } = await client
    .from("profiles")
    .select(
      `
        profile_id,
        name,
        username,
        avatar,
        role,
        headline,
        bio
        `
    )
    .eq("username", username)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const getUserById = async (
    client: SupabaseClient<Database>,
    { id }: { id: string }
  ) => {
    const { data, error } = await client
      .from("profiles")
      .select(
        `
          profile_id,
          name,
          username,
          avatar,
          headline,
          bio,
          role 
          `
      )
      .eq("profile_id", id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  };

export const getFollowCounts = async (
  client: SupabaseClient<Database>,
  { profileId }: { profileId: string }
) => {
  const { count: followers, error: followersError } = await client
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profileId);
  if (followersError) {
    throw followersError;
  }

  const { count: following, error: followingError } = await client
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profileId);
  if (followingError) {
    throw followingError;
  }

  return {
    followers: followers ?? 0,
    following: following ?? 0,
  };
};

export const ensureUserProfile = async (
  client: SupabaseClient<Database>,
  { id }: { id: string }
) => {
  try {
    return await getUserById(client, { id });
  } catch (error) {
    const pgError = error as { code?: string };
    if (pgError.code !== "PGRST116") {
      throw error;
    }
  }

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();
  if (authError || !user || user.id !== id) {
    throw authError ?? new Error("Unable to initialize profile");
  }

  const metadata = user.user_metadata ?? {};
  const rawUsername =
    metadata.preferred_username ??
    metadata.user_name ??
    metadata.username ??
    user.email?.split("@")[0] ??
    "user";
  const usernameBase =
    String(rawUsername)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 16) || "user";
  const name = metadata.name ?? metadata.full_name ?? "Anonymous";
  const avatar = metadata.avatar_url ?? null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = Math.random().toString(36).slice(2, 7);
    const username = `${usernameBase}${suffix}`;
    const { data, error } = await client
      .from("profiles")
      .insert({
        profile_id: id,
        name,
        username,
        avatar,
        role: "developer",
      })
      .select(
        `
          profile_id,
          name,
          username,
          avatar,
          headline,
          bio,
          role
        `
      )
      .single();
    if (!error) {
      return data;
    }
    if (error.code !== "23505") {
      throw error;
    }
  }

  throw new Error("Unable to create a unique username");
};

export const getUserProducts = async (
    client: SupabaseClient<Database>,
    { username }: { username: string }
  ) => {
  const { data, error } = await client
    .from("products")
    .select(
      `
        ${productListSelect},
        profiles!products_to_profiles!inner (
            profile_id
        )
    `
    )
    .eq("profiles.username", username);
  if (error) {
    throw error;
  }
  return data;
};

export const getUserPosts = async (
    client: SupabaseClient<Database>,
    { username }: { username: string }
  ) => {
  const { data, error } = await client
    .from("community_post_list_view")
    .select("*")
    .eq("author_username", username);
  if (error) {
    throw error;
  }
  return data
};

export const getLoggedInUserId = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) {
    throw redirect("/auth/login");
  }
  return data.user.id;
};

export const getProductsByUserId = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("products")
    .select(`name, product_id`)
    .eq("profile_id", userId);
  if (error) {
    throw error;
  }
  return data;
};

export const getNotifications = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("notifications")
    .select(
      `
      notification_id,
      type,
      source:profiles!source_id(
        profile_id,
        name,
        avatar
      ),
      product:products!product_id(
        product_id,
        name
      ),
      post:posts!post_id(
        post_id,
        title
      ),
      seen,
      created_at
      `
    )
    .eq("target_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const countNotifications = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { count, error } = await client
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("seen", false)
    .eq("target_id", userId);
  if (error) {
    throw error;
  }
  return count ?? 0;
};

export const getMessages = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("messages_view")
    .select("*")
    .eq("profile_id", userId)
    .neq("other_profile_id", userId);
  if (error) {
    throw error;
  }
  return data;
};

export const getMessagesByMessagesRoomId = async (
  client: SupabaseClient<Database>,
  { messageRoomId, userId }: { messageRoomId: string; userId: string }
) => {
  const { count, error: countError } = await client
    .from("message_room_members")
    .select("*", { count: "exact", head: true })
    .eq("message_room_id", Number(messageRoomId))
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    throw new Error("Message room not found");
  }
  const { data, error } = await client
    .from("messages")
    .select(
      `*`
    )
    .eq("message_room_id", Number(messageRoomId))
    .order("created_at", { ascending: true });
  if (error) {
    throw error;
  }
  return data;
};

export const getRoomsParticipant = async (
  client: SupabaseClient<Database>,
  { messageRoomId, userId }: { messageRoomId: string; userId: string }
) => {
  const { count, error: countError } = await client
    .from("message_room_members")
    .select("*", { count: "exact", head: true })
    .eq("message_room_id", Number(messageRoomId))
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    throw new Error("Message room not found");
  }
  const { data, error } = await client
    .from("message_room_members")
    .select(
      `
      profile:profiles!profile_id!inner(
        name,
        profile_id,
        avatar
      )
      `
    )
    .eq("message_room_id", Number(messageRoomId))
    .neq("profile_id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const sendMessageToRoom = async (
  client: SupabaseClient<Database>,
  {
    messageRoomId,
    message,
    userId,
  }: { messageRoomId: string; message: string; userId: string }
) => {
  const { count, error: countError } = await client
    .from("message_room_members")
    .select("*", { count: "exact", head: true })
    .eq("message_room_id", Number(messageRoomId))
    .eq("profile_id", userId);
  if (countError) {
    throw countError;
  }
  if (count === 0) {
    throw new Error("Message room not found");
  }
  const { error } = await client.from("messages").insert({
    content: message,
    message_room_id: Number(messageRoomId),
    sender_id: userId,
  });
  if (error) {
    throw error;
  }
};
