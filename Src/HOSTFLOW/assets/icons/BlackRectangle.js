import * as React from "react";
import Svg, { ForeignObject, Path, Defs, ClipPath } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: div */
const SVGComponent = (props) => (
  <Svg
    width={128}
    height={18}
    viewBox="0 0 128 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ForeignObject x={-29.5} y={-30} width={187.5} height={78}></ForeignObject>
    <Path
      data-figma-bg-blur-radius={30}
      d="M103.247 18C107.465 18 111.512 16.3347 114.508 13.3664L128 1.90735e-06L0.499999 1.7585e-06L12.4196 12.8714C15.4477 16.1412 19.7024 18 24.159 18L103.247 18Z"
      fill="#121212"
    />
    <Defs>
      <ClipPath
        id="bgblur_0_1294_9271_clip_path"
        transform="translate(29.5 30)"
      >
        <Path d="M103.247 18C107.465 18 111.512 16.3347 114.508 13.3664L128 1.90735e-06L0.499999 1.7585e-06L12.4196 12.8714C15.4477 16.1412 19.7024 18 24.159 18L103.247 18Z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
