import {
  FEATURED_COUNT,
  NEWS_WINDOW_DAYS,
  formatNewsUpdatedLabel,
  getNewsLastUpdated,
  getNewsWindowStart,
} from "./ai-news-sync";
import { getAllNews } from "./news";

export function getNewsVerificationLabel(): string {
  const lastUpdated = getNewsLastUpdated(getAllNews());
  if (!lastUpdated) {
    return "内容经联网核验后持续更新";
  }
  return `${formatNewsUpdatedLabel(lastUpdated)}完成联网核验`;
}

export {
  FEATURED_COUNT,
  NEWS_WINDOW_DAYS,
  getNewsLastUpdated,
  getNewsWindowStart,
};
