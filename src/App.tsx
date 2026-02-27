import { useCallback, useMemo, useState } from 'react'
import { ReactFlowProvider, addEdge, useEdgesState, useNodesState } from 'reactflow'
import type { Connection, OnConnect } from 'reactflow'
import 'reactflow/dist/style.css'

import { Box } from '@mui/material'
import { initialNodes, nodeTypeLabel, type NodeType, type WorkflowEdge, type WorkflowNode, type WorkflowNodeData } from './workflow/types'
import { ComponentsSidebar } from './components/workflow/ComponentsSidebar'
import { WorkflowCanvas } from './components/workflow/WorkflowCanvas'
import { NodeConfigPanel } from './components/workflow/NodeConfigPanel'

function WorkflowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [idCounter, setIdCounter] = useState(1)

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  const onConnect: OnConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: 'smoothstep' }, eds)),
    [setEdges],
  )

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    const type = event.dataTransfer.getData('application/reactflow/node-type') as NodeType
    if (!type) return

    const bounds = event.currentTarget.getBoundingClientRect()

    const position = {
      x: event.clientX - bounds.left - 100,
      y: event.clientY - bounds.top - 40,
    }

    const newId = `${type}-${idCounter + 1}`
    setIdCounter((c) => c + 1)

    const newNode: WorkflowNode = {
      id: newId,
      type: type === 'start' ? 'input' : type === 'end' ? 'output' : 'default',
      position,
      data: {
        label: `${nodeTypeLabel[type]} Node`,
        type,
        functionBody: type === 'function' ? '// function body' : undefined,
        conditionExpression: type === 'condition' ? 'x > 0' : undefined,
      },
    }

    setNodes((nds) => [...nds, newNode])
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const updateSelectedNode = <K extends keyof WorkflowNodeData>(
    key: K,
    value: WorkflowNodeData[K],
  ) => {
    if (!selectedNodeId) return
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNodeId
          ? { ...n, data: { ...n.data, [key]: value } }
          : n,
      ),
    )
  }

  const runWorkflow = () => {
    const startNode = nodes.find((n) => n.data.type === 'start')
    if (!startNode) {
      console.warn('No Start node found')
      return
    }

    const adjacency = new Map<string, string[]>()

    edges.forEach((e) => {
      if (!e.source || !e.target) return
      if (!adjacency.has(e.source)) adjacency.set(e.source, [])
      adjacency.get(e.source)!.push(e.target)
    })

    const visited = new Set<string>()
    const order: string[] = []

    const dfs = (id: string) => {
      if (visited.has(id)) return
      visited.add(id)

      const node = nodes.find((n) => n.id === id)
      if (node) order.push(node.data.label)

      const neighbors = adjacency.get(id) ?? []
      neighbors.forEach(dfs)
    }

    dfs(startNode.id)

    console.log('Execution order:', order)
  }

  return (
    <Box display="flex" height="100vh" width="100vw" bgcolor="#f3f4f6">
      <ComponentsSidebar onRunWorkflow={runWorkflow} />

      <WorkflowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={setSelectedNodeId}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      />

      <NodeConfigPanel
        selectedNode={selectedNode}
        updateSelectedNode={updateSelectedNode}
      />
    </Box>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowApp />
    </ReactFlowProvider>
  )
}