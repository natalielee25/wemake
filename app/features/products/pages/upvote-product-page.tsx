import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/upvote-product-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { toggleProductUpvote } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  await toggleProductUpvote(client, { productId: params.productId, userId });
  return { ok: true };
};
