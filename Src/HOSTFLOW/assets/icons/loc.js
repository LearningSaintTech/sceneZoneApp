import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={13}
    height={12}
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M10.8096 4.225C10.2846 1.915 8.26956 0.875 6.49956 0.875C6.49956 0.875 6.49956 0.875 6.49456 0.875C4.72956 0.875 2.70956 1.91 2.18456 4.22C1.59956 6.8 3.17956 8.985 4.60956 10.36C5.13956 10.87 5.81956 11.125 6.49956 11.125C7.17956 11.125 7.85956 10.87 8.38456 10.36C9.81456 8.985 11.3946 6.805 10.8096 4.225ZM6.49956 6.73C5.62956 6.73 4.92456 6.025 4.92456 5.155C4.92456 4.285 5.62956 3.58 6.49956 3.58C7.36956 3.58 8.07456 4.285 8.07456 5.155C8.07456 6.025 7.36956 6.73 6.49956 6.73Z"
      fill="url(#paint0_linear_4254_5985)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_4254_5985"
        x1={10.9345}
        y1={11.125}
        x2={0.789971}
        y2={2.3413}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#7952FC" />
        <Stop offset={1} stopColor="#B15CDE" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
