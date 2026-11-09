import { GlobalSearchResult } from "../../models/search/global-search";

export interface GlobalSearch {
  search(term: string): Promise<GlobalSearchResult>;
}
