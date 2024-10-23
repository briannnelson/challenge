import React from 'react';
import type { FC } from 'react';
import {
  preloadCachingFetch,
  useCachingFetch,
} from '../caching-fetch-library/cachingFetch';
import Person from './Person';
import { validateData } from './validation';
import constants from "./utils/constants";

type Application = FC & {
  preLoadServerData?: () => Promise<void>;
};

const App: Application = () => {
  const {
    data: rawData,
    isLoading,
    error,
  } = useCachingFetch(constants.apiUrl);
  if (isLoading) return <div>Loading...</div>;
  if (error || rawData === null) return <div>Error: {error?.message}</div>;

  const data = validateData(rawData);

  return (
    <div>
      <h1>Welcome to the People Directory</h1>
      {data.map((person, index) => (
        <Person key={person.email} index={index} />
      ))}
    </div>
  );
};

App.preLoadServerData = async () => {
  await preloadCachingFetch(constants.apiUrl);
};

export default App;
