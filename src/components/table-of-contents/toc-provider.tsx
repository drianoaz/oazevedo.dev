import { createContext, useContext } from 'react';
import { TocItem } from 'remark-flexible-toc';

type TocContextProps = {
  active: string[];
  toc: TocItem[];
};

export const TocContext = createContext({} as TocContextProps);

export const useTocContext = () => {
  return useContext(TocContext);
};
