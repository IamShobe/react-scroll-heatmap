import React from "react";
import {ComponentStory, ComponentMeta} from "@storybook/react";

import Heatmap from "./Heatmap/Heatmap";
import {MarkerConfig, MarkersConfig} from "./Heatmap/types";


export default {
  title: "Example/Main",
  component: Heatmap,
} as ComponentMeta<typeof Heatmap>;


const markerNames = ["test1", "test2"] as const
const markerConfigs: MarkersConfig<typeof markerNames> = {
  test1: {
    color: "red",
  },
  test2: {
    color: "green",
  },
};

const Template: ComponentStory<typeof Heatmap> = (args) => <div
  style={{width: 800, height: 300}}>
  <Heatmap totalCount={100}
           markersConfig={markerConfigs}
           markers={[{
             rowIndex: 100,
             type: "test1",
           }]}
           itemContent={(index) => <div key={index}>{index}</div>}/>
</div>;

export const Main = Template.bind({});
