import { useState, useEffect } from "react";

// Cache to store fetched data
const cache: Record<string, unknown> = {};
// Cache to store ongoing fetch promises
const cachePromises: Record<string, Promise<unknown>> = {};

// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge

type UseCachingFetch = (url: string) => {
	isLoading: boolean;
	data: unknown;
	error: Error | null;
};

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */

/**
 * Custom hook that fetches data from a URL with caching.
 * - If the data for the URL is already cached, it returns it immediately.
 * - If a fetch is in progress for the URL, it waits for it to complete.
 * - Otherwise, it initiates a new fetch, caches the result, and updates the state.
 *
 * Returns an object containing:
 * - isLoading: indicates if the fetch is in progress.
 * - data: the fetched data or null if not yet available.
 * - error: any error encountered during the fetch.
 */

export const useCachingFetch: UseCachingFetch = (url) => {
	const [state, setState] = useState<{
		isLoading: boolean;
		data: unknown;
		error: Error | null;
	}>({
		isLoading: true,
		data: null,
		error: null,
	});

	useEffect(() => {
		let isMounted = true;

		if (cache[url]) {
			// Data is already cached
			setState({ isLoading: false, data: cache[url], error: null });
		} else if (cachePromises[url] !== undefined) {
			// Fetch is in progress
			cachePromises[url]
				.then((data) => {
					if (isMounted) {
						setState({ isLoading: false, data, error: null });
					}
				})
				.catch((error) => {
					if (isMounted) {
						setState({ isLoading: false, data: null, error });
					}
				});
		} else {
			// Initiate fetch and store the promise
			const fetchPromise = fetch(url)
				.then((response) => {
					if (!response.ok) throw new Error(`Failed to fetch ${url}`);
					return response.json();
				})
				.then((data) => {
					cache[url] = data;
					delete cachePromises[url];
					if (isMounted) {
						setState({ isLoading: false, data, error: null });
					}
					return data;
				})
				.catch((error) => {
					delete cachePromises[url];
					if (isMounted) {
						setState({ isLoading: false, data: null, error });
					}
					throw error;
				});

			cachePromises[url] = fetchPromise;
		}

		return () => {
			isMounted = false;
		};
	}, [url]);

	return state;
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<void> => {
  throw new Error(
    'preloadCachingFetch has not been implemented, please read the instructions in DevTask.md',
  );
};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const serializeCache = (): string => '';

export const initializeCache = (serializedCache: string): void => {};

export const wipeCache = (): void => {};
