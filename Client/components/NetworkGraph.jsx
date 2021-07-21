import useSWR from "swr";
import { request } from "graphql-request";
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import options from "utils/options";
import {
  setStatusColor,
  setNodeShape,
  setNodeValue,
  animationOptions,
} from "utils/graphHelpers";
const { findNestedObj } = require("../utils/findNestedObj");

import { NodesContext } from "components/context/NodesContext";
import { NodeContext } from "components/context/NodeContext";

//fetch edges

const NetworkGraph = (props) => {
  const [nodesContext, setNodesContext] = useContext(NodesContext);
  const [nodeContext, setNodeContext] = useContext(NodeContext);
  // const { data, error } = useSWR(API);

  //element where to place the graph
  const domNode = useRef(null);
  //element of the graph
  const network = useRef(null);

  // Dataset of the graph which the network consumes
  // Allows for dynamic updates
  const nodes = new DataSet();
  const edges = new DataSet();

  const tree = {};

  const PopOver = (item) => {
    const { host } = item;
    return host;
  };

  let data = [];
  props.data.length == undefined ? data.push(props.data) : (data = props.data);

  useEffect(() => {
    //Layer 4 - nodes (servers) update dynamically on data update (SWR)
    //nodes
    let n = [];
    //edges
    let e = [];
    //entities
    let entities = [];

    data.map((dept) => {
      dept.groups.map((group) => {
        group.systems.map((system) => {
          system.entities.map((entity) => {
            entities.push(entity);

            n.push({
              id: entity.id,
              label: entity.name,
              title: PopOver(entity.label),
              group: group.name,
              status: entity.status.code,
              color: setStatusColor(entity.status.code),
              shape: setNodeShape(entity.status.code),
              value: setNodeValue(entity.status.code),
            });
            e.push({
              id: entity.id,
              from: entity.id,
              to: `s-${system.name}`,
            });
          });
        });
      });
      setNodesContext(entities);
    });
    network.current.body.data.nodes.update(n);
    network.current.body.data.edges.update(e);
  }, [props.data]);

  // Dynamic edges, update if new edges are added or edited
  // useEffect(() => {
  //   if (data) {
  //     network.current.body.data.edges.update(
  //       data.map((item, i) => ({
  //         from: item.from,
  //         to: item.to,
  //         label: item.label,
  //       }))
  //     );
  //   }
  // }, [data]);

  // Focus on matched node from nodeContext.jsx
  useEffect(() => {
    if (nodeContext != undefined && nodeContext.length != 0) {
      network.current.selectNodes([nodeContext]);
      network.current.focus([nodeContext], animationOptions);
    }
    return function cleanup() {
      setNodeContext(undefined);
    };
  }, [nodeContext]);

  useLayoutEffect(() => {
    if (domNode.current) {
      (function setGroupNodes() {
        data.map((x, i) => {
          //Grupp
          x.groups.map((group) => {
            //Set group nodes (Layer 1)
            nodes.add({
              id: group.name,
              label: group.name,
              group: group.name,
              value: 10,
              layer: 2,
            }),
              edges.add({
                from: group.name,
                to: `n-nav`,
                length: 500,
              });
            // }
            //Set system nodes (Layer 2)
            //System
            group.systems.map((system) => {
              nodes.add({
                id: `s-${system.name}`,
                label: system.name,
                group: group.name,
                value: 3,
                layer: 3,
              });
              edges.add({
                from: `s-${system.name}`,
                to: group.name,
                length: 300,
              });
            });
          });
        });
      })();

      //Log all event updates such as node creations, updates or deletions
      nodes.on("update", function (event, properties, senderId) {
        console.log("event", event, properties);
        console.log(nodes.get());
        console.log(edges.get());
      });
    }
    //Initialize network
    network.current = new Network(
      domNode.current,
      { nodes: nodes, edges: edges },
      options
    );
    network.current.on("stabilizationIterationsDone", function () {
      // network.current.setOptions({ physics: false });
      // console.log("Network stabilized, physics disabled.");
    });

    //node onClick, set the current node in a context so other components can use it
    network.current.on("click", (properties) => {
      if (properties.nodes.length) {
        setNodeContext(nodes.get(properties.nodes[0]).id);
      } else {
        setNodeContext(undefined);
      }
    });
  }, [domNode, network]);

  return <div style={{ height: "100%" }} id="network" ref={domNode} />;
};

export default NetworkGraph;
