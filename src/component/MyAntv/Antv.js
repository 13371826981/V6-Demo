import { useState, useEffect } from 'react';
import { Graph, Edge, Shape, NodeView, Addon } from '@antv/x6'
import ModelPopup from '../Model/ChartPopup/Popup'
   // 定义节点
  class MyShape extends Shape.Rect {
    getInPorts() {
      return this.getPortsByGroup('in')
    }
  
    getOutPorts() {
      return this.getPortsByGroup('out')
    }
  
    getUsedInPorts(graph: Graph) {
      const incomingEdges = graph.getIncomingEdges(this) || []
      return incomingEdges.map((edge: Edge) => {
        const portId = edge.getTargetPortId()
        return this.getPort(portId)
      })
    }
  
    getNewInPorts(length: number) {
      return Array.from(
        {
          length,
        },
        () => {
            return {
              group: 'in',
          }
        },
      )
    }
  
    updateInPorts(graph: Graph) {
      const minNumberOfPorts = 1 //控制top链接桩数量
      const ports = this.getInPorts()
      const usedPorts = this.getUsedInPorts(graph)
      const newPorts = this.getNewInPorts(
        Math.max(minNumberOfPorts - usedPorts.length, 1),
      )
  
      if (
        ports.length === minNumberOfPorts &&
        ports.length - usedPorts.length > 0
      ) {
        // noop
      } else if (ports.length === usedPorts.length) {
        this.addPorts(newPorts)
      } else if (ports.length + 1 > usedPorts.length) {
        this.prop(
          ['ports', 'items'],
          this.getOutPorts().concat(usedPorts).concat(newPorts),
          {
            rewrite: true,
          },
        )
      }
      return this
    }
  }
  
  MyShape.config({
    attrs: {
      root: {
        magnet: false,
      },
      body: {
        fill: '#f5f5f5',
        stroke: '#d9d9d9',
        strokeWidth: 1,
      },
      label: {
        text: 'rect',    // 文本
        fill: '#333',    // 文字颜色
        fontSize: 13,    // 文字大小
      },
    },
    ports: {
      items: [
        {
          group: 'out',
        },
        {
          group: 'out',
        },
      ],
      groups: {
        in: {
          position: {
            name: 'top',
          },
          attrs: {
            portBody: {
              magnet: 'passive',
              r: 6,
              stroke: '#ffa940',
              fill: '#fff',
              strokeWidth: 2,
            },
          },
        },
        out: {
          position: {
            name: 'bottom',
          },
          attrs: {
            portBody: {
              magnet: true,
              r: 6,
              fill: '#fff',
              stroke: '#3199FF',
              strokeWidth: 2,
            },
          },
        },
      },
    },
    portMarkup: [
      {
        tagName: 'circle',
        selector: 'portBody',
      },
    ],
  })


// 高亮
const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    attrs: {
      fill: '#fff',
      stroke: '#47C769',
    },
  },
}

function Antv() {
  const [popup,setPopup] = useState(false)
  const [nodeNum,setNodeNum] = useState(2)
  const [arr,setArr] = useState([{
    a:1
  }])
  const [obj,setObj] = useState({a:1})
  console.log(obj)
  useEffect(() =>{
    const graph = new Graph({
      grid: true,
      container: document.getElementById('containers'),
      width: 800,
      height: 1500,
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
        magnetAdsorbed: {
          name: 'stroke',
          args: {
              attrs: {
                fill: '#fff',
                stroke: '#31d0c6',
              },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: 'rounded',
        connectionPoint: 'boundary',
        router: {
          name: 'er',
          args: {
            direction: 'V',
          },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#a0a0a0',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 7,
                },
              },
            },
          })
        },
        //在移动边的时候判断连接是否有效，如果返回 false，当鼠标放开的时候，不会连接到当前元素，否则会连接到当前元素。
        validateConnection({ sourceView, targetView, targetMagnet }) {
          // console.log('validateConnection: ',targetView, targetMagnet )
          if (!targetMagnet) {
            return false
          }
          if (targetMagnet.getAttribute('port-group') !== 'in') {
            return false
          }
          //具体的判断逻辑
          if (targetView) {
            const node = targetView.cell
            if (node instanceof MyShape) {
              const portId = targetMagnet.getAttribute('port')
              const usedInPorts = node.getUsedInPorts(graph)
              if (usedInPorts.find((port) => port && port.id === portId)) {
                return false
              }
            }
          }
          return true
        },
      },
    })
    //创建图像模块
    for(let i=0; i<nodeNum; i++){
      graph.addNode(
        new MyShape().resize(120, 40).position(300, 50 + i * 100).updateInPorts(graph).attr('label/text', 'hello' + i),
      )
    }
    // graph.addNode(
    //     new MyShape().resize(120, 40).position(200, 50).updateInPorts(graph),
    // )
    
    // graph.addNode(
    //     new MyShape().resize(120, 40).position(400, 50).updateInPorts(graph),
    // )
    
    // graph.addNode(
    //     new MyShape().resize(120, 40).position(300, 250).updateInPorts(graph),
    // )
  
    //更新链接桩
    function update(view: NodeView) {
      const cell = view.cell
      if (cell instanceof MyShape) {
        cell.getInPorts().forEach((port) => {
          const portNode = view.findPortElem(port.id, 'portBody')
          view.unhighlight(portNode, {
              highlighter: magnetAvailabilityHighlighter,
          })
        })
        cell.updateInPorts(graph)
      }
    }
    graph.on('edge:connected', ({ previousView, currentView, currentPort }) => {
      console.log('边连接/取消连接currentPort: ',currentPort, )
      if (previousView) {
        console.log('边连接/取消连接previousView: ',previousView)
        update(previousView)
      }
      if (currentView) {
        console.log('边连接/取消连接currentView: ',currentView)
        update(currentView)
      }
      // setPopup(true)
    })
    graph.on('edge:removed', ({ edge, options }) => {
      if (!options.ui) {
        return
      }
      const target = edge.getTargetCell()
      if (target instanceof MyShape) {
        target.updateInPorts(graph)
      }
    })
    graph.on('edge:mouseenter', ({ edge }) => {
      edge.addTools([
        'source-arrowhead',
        'target-arrowhead',
        {
          name: 'button-remove',
          args: {
            distance: -30,
          },
        },
      ])
    })
    graph.on('edge:mouseleave', ({ edge }) => {
      edge.removeTools()
      //判断鼠标离开没有连接成功时触发
      if(!edge._model){
        console.log('鼠标离开后触发:',edge._model)
        setPopup(true)
      }
    })
    graph.on('edge:moved', ({ edge }) => {
      console.log('移动边后触发:',edge)
    })
  })

  //事件:关闭弹窗
  const closePopup = (e) =>{
    setPopup(false)
  }
  //事件:添加子节点
  const addNode = (e) =>{
    setNodeNum(nodeNum + 1)
    setPopup(false)
  }
  return (
    <div>
      <div className="App" id="containers"></div>
      {
        popup ? <ModelPopup onClosePopup={closePopup} onConfirmAddNode={addNode}/> : null
      }
    </div>
  );
}

export default Antv;