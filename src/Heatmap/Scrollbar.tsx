import React, {useRef} from "react";
import styled from "styled-components";
import Marker from "./Marker";
import {Marker as MarkerType, MarkersConfig} from "./types";
import Thumb from "./Thumb";
import {MotionValue} from "framer-motion";
import thumb from "./Thumb";
import {IndexLocationWithAlign} from "react-virtuoso/dist/interfaces";


const Wrapper = styled.div`
  width: 10px;
  background-color: lightgray;
  height: 100%;
  position: relative;
`

export type ScrollbarProps<T extends ReadonlyArray<string>, K extends MarkersConfig<T>> = {
  totalCount: number
  height: number
  totalHeight: number
  markers: MarkerType<K>[]
  markersConfig: K
  y: MotionValue<number>
  onScroll: (props: IndexLocationWithAlign) => void
}

export const Scrollbar = <T extends ReadonlyArray<string>, K extends MarkersConfig<T>>(
  {
    height, totalHeight, markers, markersConfig, totalCount, y, onScroll,
  }: ScrollbarProps<T, K>
) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const markerHeight = Math.round(height / totalCount);

  const thumbHeight = Math.floor(height * height / totalHeight);

  const transformToRowNumber = (deltaY: number) => Math.ceil(totalCount * deltaY / height);

  return <Wrapper ref={parentRef} onClick={(e) => {
    const initialY = parentRef.current?.getBoundingClientRect().top ?? 0;
    const top = Math.max(e.clientY - initialY - thumbHeight / 2, 0);
    const rowNumber = transformToRowNumber(top);
    onScroll({index: rowNumber, behavior: "smooth"});
  }}>
    <Thumb height={thumbHeight} style={{y}} drag='y' dragConstraints={parentRef} dragElastic={0} dragMomentum={false}
           onClick={(e) => e.stopPropagation()} onDrag={() => onScroll({index: transformToRowNumber(y.get())})}/>
    {
      markers.map((marker, i) => {
        const topPos = Math.round(height * (marker.rowIndex - 1) / totalCount);
        return <Marker key={i} top={topPos} color={markersConfig[marker.type].color} height={markerHeight} />
      })
    }
  </Wrapper>
}

export default Scrollbar;
