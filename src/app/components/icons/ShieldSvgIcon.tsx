import * as React from 'react';

const ShieldSvgIcon = () => (
  <span className='inline-flex justify-center items-center w-5 h-5 rounded-full bg-red-100'>
    <svg width={24} viewBox='0 0 24 24' className='holder_f19n375c' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='m6.75 6.926 5.113-1.676 5.113 1.676v3.45a8.64 8.64 0 0 1-3.164 6.684l-1.949 1.597-1.95-1.597a8.64 8.64 0 0 1-3.163-6.683V6.926Z'
        fill='#FFC8D2'
      />
      <g filter='url(#a)'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M11.863 5.25v13.407l-1.95-1.597a8.64 8.64 0 0 1-3.163-6.683V6.926l5.113-1.676Z'
          fill='#EE445F'
        />
      </g>
      <defs>
        <filter
          id='a'
          x={1.75}
          y={0.25}
          width={15.113}
          height={23.407}
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity={0} result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation={2.5} />
          <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0' />
          <feBlend in2='BackgroundImageFix' result='effect1_dropShadow' />
          <feBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape' />
        </filter>
      </defs>
    </svg>
  </span>
);

export default ShieldSvgIcon;
