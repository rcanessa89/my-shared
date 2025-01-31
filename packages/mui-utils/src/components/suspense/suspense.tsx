import {
  Suspense as ReactSuspense,
  type FC,
  type PropsWithChildren
} from 'react';

import { Loading } from '../loading/loading';

export const Suspense: FC<PropsWithChildren> = ({ children }) => (
  <ReactSuspense fallback={<Loading show={true} />}>{children}</ReactSuspense>
);
