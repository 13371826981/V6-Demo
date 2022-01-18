import React, {useState,useEffect} from 'react'
import './App.css';
import { Graph,} from '@antv/x6'; 
import Antv from './component/MyAntv/Antv';
import ModelPopup from './component/Model/ChartPopup/Popup'
import Rect from './component/ReactRender/Rect';

//X6 支持 JSON 格式数据，该对象中需要有节点 nodes 和边 edges 字段，分别用数组表示：
const data = {
  // 节点
  nodes: [
    {
      id: 'node1', // String，可选，节点的唯一标识
      x: 40,       // Number，必选，节点位置的 x 值
      y: 40,       // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 40,  // Number，可选，节点大小的 height 值
      label: 'hello', // String，节点标签
      shape: 'rect',  //改变节点图形样式
      ports: { //定义链接桩的样式
        groups: {
          // 输入链接桩群组定义
          in: {
            position: 'top',
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
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port1',
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
    },
    {
      id: 'node2', // String，节点的唯一标识
      x: 160,      // Number，必选，节点位置的 x 值
      y: 180,      // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 40,  // Number，可选，节点大小的 height 值
      label: 'world', // String，节点标签
      shape: 'ellipse', // 使用 ellipse 渲染
    },
  ],
  // 边
  edges: [
    {
      source: 'node1', // String，必须，起始节点 id
      target: 'node2', // String，必须，目标节点 id
    },
  ],
};

//页面状态管理
// this.state = {
//   modelPopupState:false,
// }


function App() {
  const [ modelPopupState, setModelPopupState ] = useState(false)
  // console.log('页面状态:',this.state)
  useEffect(() => {
    //生成图形对象
    const graph = new Graph({
      container: document.getElementById('container'),
      width: 400,
      height: 400,
      snapline: true,//对齐线是移动节点排版的辅助工具
      // background: {
      //   color: 'red', // 设置画布背景颜色
      // },
      resizing: {
        // enabled: true,
        restricted:true,
        preserveAspectRatio:true,
      },
      //控制图形的拖拽空间大小
      translating: {
        restrict: {
          x: 0,
          y: 0,
          width: 400,
          height: 400,
        }
      },
      //给图形设置对应的边
      connecting: {
        connector: 'algo-edge',
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'in'
        },
        validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet }) {
          // 只能从输出链接桩创建连接
          if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
            return false
          }

          // 只能连接到输入链接桩
          if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
            return false
          }

          // 判断目标链接桩是否可连接
          const portId = targetMagnet.getAttribute('port')
          const node = targetView.cell
          const port = node.getPort(portId)
          if (port && port.connected) {
            return false
          }

          return true
        },
      }
    });
    // 定义箭头边
    Graph.registerConnector(
      'algo-edge',
      (source, target) => {
        const offset = 2
        const control = 80
        const v1 = { x: source.x, y: source.y + offset + control }
        const v2 = { x: target.x, y: target.y - offset - control }

        return `M ${source.x} ${source.y}
          L ${source.x} ${source.y + offset}
          C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${target.x} ${target.y - offset}
          L ${target.x} ${target.y}
          `
      },
      true,
    )
    //传入data数据生成页面
    graph.fromJSON(data)
  })
  return (
    <div>
      <div className="App" id="container"></div>
      <Antv/>
      <Rect/>
      {
        modelPopupState ? <ModelPopup /> : null
      }
    </div>
  );
}




export default App;
