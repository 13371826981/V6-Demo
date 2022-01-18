import React, {useEffect} from "react";
import { Graph } from "@antv/x6";
import { usePortal, ReactShape } from "@antv/x6-react-shape";
import RectNode from "./components/RectNode";

const UNIQ_GRAPH_ID = 'UNIQ_GRAPH_ID'
const data = [{}]

function Rect (props){
    const [Protal, setGraph] = usePortal(UNIQ_GRAPH_ID)
    useEffect(()=>{
        const graph = new Graph({
            grid: true,
            container: document.getElementById('rect'),
            width: 800,
            height: 1500,
        })
        
        setGraph(graph)
         // 生成一组可被添加的节点
        const nodes = data.map((dataItem,index) => {
            return new ReactShape({
                x: 60,
                y: 60,
                view: UNIQ_GRAPH_ID, // 需要指定 view 属性为定义的标识
                component: <RectNode />, // 自定义的 React 节点
                // .. 其它配置项
                ports: {
                    groups: {
                      // 输入链接桩群组定义
                      in: {
                        position: 'top',
                        attrs: {
                          circle: {
                            r: 6,
                            magnet: false,
                            stroke: '#31d0c6',
                            strokeWidth: 2,
                            fill: '#fff',
                          },
                        },
                      },
                      // 输出链接桩群组定义
                      out: {
                        position: 'bottom',
                        attrs: {
                          circle: {
                            r: 6,
                            magnet: true,
                            stroke: '#31d0c6',
                            strokeWidth: 2,
                            fill: '#fff',
                          },
                        },
                      },
                    },
                    items: [
                      {
                        id:(index+1).toString(),
                        group: 'in',
                      },
                      {
                        id: (index+2).toString(),
                        group: 'in',
                      },
                      {
                        id: 'port3',
                        group: 'in',
                      },
                      {
                        id: 'port4',
                        group: 'out',
                      },
                      {
                        id: 'port5',
                        group: 'out',
                      },
                    ],
                },
            })
        })
    
        // 批量添加一组节点以提升挂载性能
        graph.addCell(nodes)
        
    },[setGraph])
    
    return (
        <div>
            <div id="rect"></div>
            <Protal />
        </div>
    )
}

export default Rect