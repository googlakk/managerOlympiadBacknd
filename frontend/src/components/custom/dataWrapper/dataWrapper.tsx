"use client";

import { createContext, useContext } from "react";

import { getOlympiadsData } from "@/data/loaders";
import { useEffect } from "react";
import useOlympiadStore from "@/store/useOlympiadsStore";

const dataContext = createContext({});

export const DataProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const setOlympiads = useOlympiadStore((state) => state.setOlympiads);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOlympiadsData();
      setOlympiads(data.data);
    };

    fetchData();
  }, [setOlympiads]);

  return <dataContext.Provider value={{}}>{children}</dataContext.Provider>;
};

export const useOlympiadContext = () => {
  return useContext(dataContext);
};
