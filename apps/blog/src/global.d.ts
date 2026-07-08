import type { AstroIntegration } from "@swup/astro";

interface SwupLike {
	hooks: {
		on: (
			event: "visit:start",
			handler: (visit: { to: { url: string } }) => void,
			options?: { before?: boolean },
		) => void;
		on: (
			event: "link:click" | "content:replace" | "page:view" | "visit:end",
			handler: () => void,
			options?: { before?: boolean },
		) => void;
		on: (
			event: string,
			handler: (...args: unknown[]) => void,
			options?: { before?: boolean },
		) => void;
	};
}

declare global {
	interface Window {
		// type from '@swup/astro' is incorrect
		swup?: AstroIntegration & SwupLike;
		onscroll: ((this: Window, ev: Event) => unknown) | null;
		onresize: ((this: Window, ev: UIEvent) => unknown) | null;
		pagefind: {
			search: (query: string) => Promise<{
				results: Array<{
					data: () => Promise<SearchResult>;
				}>;
			}>;
		};
	}
}

interface SearchResult {
	url: string;
	meta: {
		title: string;
	};
	excerpt: string;
	content?: string;
	word_count?: number;
	filters?: Record<string, unknown>;
	anchors?: Array<{
		element: string;
		id: string;
		text: string;
		location: number;
	}>;
	weighted_locations?: Array<{
		weight: number;
		balanced_score: number;
		location: number;
	}>;
	locations?: number[];
	raw_content?: string;
	raw_url?: string;
	sub_results?: SearchResult[];
}
