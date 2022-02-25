import React from "react";
import styled from "styled-components";
import {motion} from "framer-motion";

export const Thumb = styled(motion.div)<{height: number}>`
  height: ${({height}) => height}px;
  width: 100%;
  background-color: darkblue;
`;

export default Thumb;
