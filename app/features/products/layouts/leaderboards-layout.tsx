import { Outlet, data } from "react-router";
import { z } from "zod";
import { DateTime } from "luxon";
import type { Route } from "./+types/leaderboards-layout";
import { getProductPagesByDateRange } from "../queries";

const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

function getDateRange(pathname: string) {
  const daily = pathname.match(/\/leaderboards\/daily\/(\d+)\/(\d+)\/(\d+)/);
  if (daily) {
    const d = DateTime.fromObject({ year: +daily[1], month: +daily[2], day: +daily[3] }).setZone("Asia/Seoul");
    return { startDate: d.startOf("day"), endDate: d.endOf("day") };
  }
  const weekly = pathname.match(/\/leaderboards\/weekly\/(\d+)\/(\d+)/);
  if (weekly) {
    const d = DateTime.fromObject({ weekYear: +weekly[1], weekNumber: +weekly[2] }).setZone("Asia/Seoul");
    return { startDate: d.startOf("week"), endDate: d.endOf("week") };
  }
  const monthly = pathname.match(/\/leaderboards\/monthly\/(\d+)\/(\d+)/);
  if (monthly) {
    const d = DateTime.fromObject({ year: +monthly[1], month: +monthly[2] }).setZone("Asia/Seoul");
    return { startDate: d.startOf("month"), endDate: d.endOf("month") };
  }
  const yearly = pathname.match(/\/leaderboards\/yearly\/(\d+)/);
  if (yearly) {
    const d = DateTime.fromObject({ year: +yearly[1] }).setZone("Asia/Seoul");
    return { startDate: d.startOf("year"), endDate: d.endOf("year") };
  }
  return null;
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success, data: parsedData } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams)
  );
  if (!success) {
    throw data(
      { error_code: "invalid_page", message: "Invalid page" },
      { status: 400 }
    );
  }

  const dateRange = getDateRange(url.pathname);
  if (dateRange) {
    const totalPages = await getProductPagesByDateRange(dateRange);
    if (totalPages > 0 && parsedData.page > totalPages) {
      throw data(
        { error_code: "page_out_of_range", message: `Page ${parsedData.page} does not exist.` },
        { status: 404 }
      );
    }
  }
};

export default function LeaderboardLayout() {
  return <Outlet />;
}
