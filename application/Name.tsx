import React from 'react';
import type { FC } from 'react';
import { useCachingFetch } from '../caching-fetch-library/cachingFetch';
import { validateData } from './validation';
import constants from "./utils/constants";

const Name: FC<{ index: number }> = ({ index }) => {
  // We are intentionally passing down the index prop to the Name component
  // To simulate the useCachingFetch hook being used in different locations
  const {
    data: rawData,
    isLoading,
    error,
  } = useCachingFetch(constants.apiUrl);
  if (isLoading) return <div>Loading...</div>;
  if (error || rawData === null) return <div>Error: {error?.message}</div>;

  const data = validateData(rawData);

  const person = data[index];

  return (
    <div>
      <h2>
        {person.first} {person.last}
      </h2>
    </div>
  );
};

export default Name;
