import React from 'react';
import Svg, { Path, Defs, ClipPath, ForeignObject } from 'react-native-svg';

const CrowdGuaranteeBackground = ({ width = 128, height = 18, ...props }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 128 18"
      fill="none"
      {...props}
    >
      <Defs>
        <ClipPath id="bgblur_0_3919_2053_clip_path">
          <Path d="M103.247 18C107.465 18 111.512 16.3347 114.508 13.3664L128 1.90735e-06L0.499999 1.7585e-06L12.4196 12.8714C15.4477 16.1412 19.7024 18 24.159 18L103.247 18Z" />
        </ClipPath>
      </Defs>
      <Path
        d="M103.247 18C107.465 18 111.512 16.3347 114.508 13.3664L128 1.90735e-06L0.499999 1.7585e-06L12.4196 12.8714C15.4477 16.1412 19.7024 18 24.159 18L103.247 18Z"
        fill="#121212"
      />
    </Svg>
  );
};

export default CrowdGuaranteeBackground; 