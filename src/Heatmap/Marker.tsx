import React from "react";
import styled from "styled-components";

export const Marker = styled.div<{color: string, top: number, height: number}>`
  position: absolute;
  width: 100%;
  height: ${({height}) => height}px;
  top: ${({top}) => top}px;
  background-color: ${({color}) => color};
`;

export default Marker;
