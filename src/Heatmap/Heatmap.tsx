import React, {useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import AutoSizer from "react-virtualized-auto-sizer";
import {Virtuoso} from "react-virtuoso";

import Scrollbar from "./Scrollbar";
import {Marker, MarkerConfig, MarkersConfig} from "./types";
import {useMotionValue} from "framer-motion";
import {VirtuosoHandle} from "react-virtuoso/dist/components";


const Container = styled.div`
  display: flex;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
`;


export type HeatmapProps<T extends ReadonlyArray<string>, K extends MarkersConfig<T>> = {
  markersConfig: K,
  // getRowType: (index: number) => RowTypeName<T>
  markers: Marker<K>[]
  itemContent: (index: number) => React.ReactElement
  totalCount: number
}

const ScrollerWrapper = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Scroller = React.forwardRef<HTMLDivElement>(({...props}, ref) => {
  return <ScrollerWrapper ref={ref} {...props}/>;
});


const List = (
  listRef: React.MutableRefObject<HTMLDivElement | null | undefined>, currentTotalHeight: number, setTotalHeight: (n: number) => void,
) => React.forwardRef<HTMLDivElement>(({...props}, ref) => {

  return <div {...props} ref={(elem) => {
    const currentHeight = elem?.clientHeight ?? 0;
    if (elem && currentTotalHeight !== currentHeight) {
      setTotalHeight(currentHeight)
    }

    listRef.current = elem;
    (ref as (instance: HTMLDivElement | null) => void)(elem);
  }}/>;
});

export const Heatmap = <T extends ReadonlyArray<string>, K extends MarkersConfig<T>>(
  {
    totalCount, itemContent, markers, markersConfig,
  }: HeatmapProps<T, K>,
) => {
  const y = useMotionValue(0);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollerRef = useRef<HTMLElement | Window | null>();
  const listRef = useRef<HTMLDivElement | null>();
  const [currentTotalHeight, setTotalHeight] = useState(0);

  const ThisList = useMemo(() => List(listRef, currentTotalHeight, setTotalHeight), [listRef, currentTotalHeight, setTotalHeight]);

  return <AutoSizer>
    {
      ({width, height}) => <Container style={{width, height}}>
        <Content>
          <Virtuoso
            ref={virtuosoRef}
            components={{
              Scroller: Scroller,
              List: ThisList,
            }}
            scrollerRef={(ref) => {
              scrollerRef.current = ref;
            }}
            onScroll={(e) => {
              y.set(height * ((e.target as HTMLElement)?.scrollTop ?? 0) / currentTotalHeight);
            }}
            totalCount={totalCount} itemContent={itemContent}/>
        </Content>
        <Scrollbar y={y} totalCount={totalCount} height={height}
                   totalHeight={currentTotalHeight}
                   onScroll={(props) => {
                     virtuosoRef.current?.scrollToIndex(props);
                   }}
                   markers={markers} markersConfig={markersConfig}/>
        <button onClick={() => {
          console.log(virtuosoRef.current);
          console.log(scrollerRef.current);
          console.log(listRef.current, currentTotalHeight);
        }}>
          test
        </button>
      </Container>
    }
  </AutoSizer>;
};

export default Heatmap;
