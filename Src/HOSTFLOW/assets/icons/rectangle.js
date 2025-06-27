import * as React from "react";
import Svg, { ForeignObject, Path, Defs, ClipPath } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: div */
const SVGComponent = (props) => (
  <Svg
    width={127}
    height={17}
    viewBox="0 0 127 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ForeignObject x={-30} y={-30} width={187} height={77}></ForeignObject>
    <Path
      data-figma-bg-blur-radius={30}
      d="M94.5811 -1.18683e-06C99.388 -1.12675e-06 104.084 1.44339 108.061 4.1432L127 17L-7.43094e-07 17L18.9391 4.14317C22.916 1.44338 27.6121 -2.02386e-06 32.4189 -1.96378e-06L94.5811 -1.18683e-06Z"
      fill="white"
      fillOpacity={0.1}
    />
    <Defs>
      <ClipPath id="bgblur_0_229_7434_clip_path" transform="translate(30 30)">
        <Path d="M94.5811 -1.18683e-06C99.388 -1.12675e-06 104.084 1.44339 108.061 4.1432L127 17L-7.43094e-07 17L18.9391 4.14317C22.916 1.44338 27.6121 -2.02386e-06 32.4189 -1.96378e-06L94.5811 -1.18683e-06Z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
