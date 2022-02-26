import React, {useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import AutoSizer from "react-virtualized-auto-sizer";
import {Virtuoso, VirtuosoProps} from "react-virtuoso";

import Scrollbar from "./Scrollbar";
import {Marker, MarkersConfig} from "./types";
import {useMotionValue} from "framer-motion";
import {VirtuosoHandle} from "react-virtuoso/dist/components";


const Container = styled.div`
  display: flex;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
`;


export type HeatmapExtendedProps<T extends ReadonlyArray<string>, K extends MarkersConfig<T>> = {
  markersConfig: K,
  markers: Marker<K>[]
  totalCount: number
  virtuosoInnerRef?: React.MutableRefObject<VirtuosoHandle | null>
}

export type HeatmapProps<T extends ReadonlyArray<string>, K extends MarkersConfig<T>, D, C> = VirtuosoProps<D, C> & HeatmapExtendedProps<T, K>

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

export const Heatmap = <T extends ReadonlyArray<string>, K extends MarkersConfig<T>, D, C>(
  {
    totalCount, itemContent, virtuosoInnerRef, markers, markersConfig, onScroll, scrollerRef, ...rest
  }: HeatmapProps<T, K, D, C>,
) => {
  const y = useMotionValue(0);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const innerScrollerRef = useRef<HTMLElement | Window | null>();
  const listRef = useRef<HTMLDivElement | null>();
  const [currentTotalHeight, setTotalHeight] = useState(0);

  useEffect(() => {
    if (virtuosoInnerRef) {
      virtuosoInnerRef.current = virtuosoRef.current;
    }
  }, [virtuosoRef.current])

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
              innerScrollerRef.current = ref;
              scrollerRef?.(ref);
            }}
            onScroll={(e, ...args) => {
              y.set(height * ((e.target as HTMLElement)?.scrollTop ?? 0) / currentTotalHeight);
              onScroll?.(e, ...args);
            }}
            totalCount={totalCount} itemContent={itemContent} {...rest}/>
        </Content>
        <Scrollbar y={y} totalCount={totalCount} height={height}
                   totalHeight={currentTotalHeight}
                   onScroll={(props) => {
                     virtuosoRef.current?.scrollToIndex(props);
                   }}
                   markers={markers} markersConfig={markersConfig}/>
      </Container>
    }
  </AutoSizer>;
};

export default Heatmap;
