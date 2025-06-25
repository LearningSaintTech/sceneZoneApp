import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={25}
    height={24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M17.3284 4H7.32838C3.49838 4 2.42838 4.92 2.33838 8.5C4.26838 8.5 5.82838 10.07 5.82838 12C5.82838 13.93 4.26838 15.49 2.33838 15.5C2.42838 19.08 3.49838 20 7.32838 20H17.3284C21.3284 20 22.3284 19 22.3284 15V9C22.3284 5 21.3284 4 17.3284 4Z"
      stroke={props.color || "#C6C5ED"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.32666 4V7.5"
      stroke={props.color || "#C6C5ED"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.32666 16.5V20"
      stroke={props.color || "#C6C5ED"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.3585 9.33016L15.9785 10.5802C16.0385 10.7002 16.1585 10.7902 16.2885 10.8102L17.6685 11.0102C18.0085 11.0602 18.1485 11.4802 17.8985 11.7202L16.8985 12.6902C16.7985 12.7802 16.7585 12.9202 16.7785 13.0602L17.0185 14.4302C17.0785 14.7702 16.7185 15.0302 16.4185 14.8702L15.1885 14.2202C15.0685 14.1602 14.9185 14.1602 14.7985 14.2202L13.5685 14.8702C13.2585 15.0302 12.9085 14.7702 12.9685 14.4302L13.2085 13.0602C13.2285 12.9202 13.1885 12.7902 13.0885 12.6902L12.0985 11.7202C11.8485 11.4802 11.9885 11.0602 12.3285 11.0102L13.7085 10.8102C13.8485 10.7902 13.9585 10.7102 14.0185 10.5802L14.6285 9.33016C14.7685 9.02016 15.2085 9.02016 15.3585 9.33016Z"
      stroke={props.color || "#C6C5ED"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
