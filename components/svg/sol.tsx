import { FC } from 'react';

import { SVGProps } from './svg.types';

const SOL: FC<SVGProps> = ({ maxWidth, maxHeight, ...props }) => (
  <svg
    style={{ maxWidth, maxHeight }}
    viewBox="0 0 24 19"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_3198_71779)">
      <path
        d="M3.89841 14.247C4.04324 14.1033 4.24239 14.0195 4.4536 14.0195H23.6077C23.9578 14.0195 24.1328 14.4387 23.8853 14.6842L20.1016 18.4391C19.9567 18.5828 19.7576 18.6667 19.5464 18.6667H0.392251C0.0422387 18.6667 -0.132768 18.2475 0.114655 18.0019L3.89841 14.247Z"
        fill="currentColor"
      />
      <path
        d="M3.89835 0.227569C4.04922 0.0838413 4.24836 0 4.45354 0H23.6077C23.9577 0 24.1327 0.419207 23.8853 0.664742L20.1015 4.41963C19.9567 4.56336 19.7575 4.6472 19.5463 4.6472H0.39219C0.0421776 4.6472 -0.132829 4.228 0.114594 3.98246L3.89835 0.227569Z"
        fill="currentColor"
      />
      <path
        d="M20.1016 7.19241C19.9567 7.04868 19.7576 6.96484 19.5464 6.96484H0.392251C0.0422387 6.96484 -0.132768 7.38405 0.114655 7.62959L3.89841 11.3845C4.04324 11.5282 4.24239 11.612 4.4536 11.612H23.6077C23.9578 11.612 24.1328 11.1928 23.8853 10.9473L20.1016 7.19241Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_3198_71779">
        <rect width="24" height="18.6667" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default SOL;
