import { useCallback, useEffect, useMemo, useState } from 'react'
import { ReactFlowProvider, addEdge, useEdgesState, useNodesState } from 'reactflow'
import type { Connection, OnConnect } from 'reactflow'
import 'reactflow/dist/style.css'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
  List,
  ListItem,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import FunctionsIcon from '@mui/icons-material/Functions'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { initialNodes, nodeTypeLabel, type NodeType, type WorkflowEdge, type WorkflowNode, type WorkflowNodeData } from './workflow/types'
import { ComponentsSidebar } from './components/workflow/ComponentsSidebar'
import { WorkflowCanvas } from './components/workflow/WorkflowCanvas'
import { NodeConfigPanel } from './components/workflow/NodeConfigPanel'

type ExecutionStep = {
  id: string
  label: string
  type: NodeType
}

const nodeVisuals: Record<NodeType, { color: string; Icon: typeof PlayCircleFilledIcon }> =
  {
    start: { color: '#00a7b8', Icon: PlayCircleFilledIcon },
    function: { color: '#1f5ea8', Icon: FunctionsIcon },
    condition: { color: '#f4b740', Icon: HelpOutlineIcon },
    end: { color: '#e15050', Icon: StopCircleIcon },
  }

function WorkflowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [idCounter, setIdCounter] = useState(1)
  const [isRunModalOpen, setIsRunModalOpen] = useState(false)
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([])
  const [visibleStepCount, setVisibleStepCount] = useState(0)
  const [runError, setRunError] = useState<string | null>(null)

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id))
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
    setSelectedNodeId((current) => (current === id ? null : current))
  }

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
      setRunError('No Start node found. Add a Start node to run the workflow.')
      setExecutionSteps([])
      setVisibleStepCount(0)
      setIsRunModalOpen(true)
      return
    }

    const adjacency = new Map<string, string[]>()

    edges.forEach((e) => {
      if (!e.source || !e.target) return
      if (!adjacency.has(e.source)) adjacency.set(e.source, [])
      adjacency.get(e.source)!.push(e.target)
    })

    const visited = new Set<string>()
    const order: ExecutionStep[] = []

    const dfs = (id: string) => {
      if (visited.has(id)) return
      visited.add(id)

      const node = nodes.find((n) => n.id === id)
      if (node) {
        order.push({ id: node.id, label: node.data.label, type: node.data.type })
      }

      const neighbors = adjacency.get(id) ?? []
      neighbors.forEach(dfs)
    }

    dfs(startNode.id)

    console.log('Execution order:', order.map((step) => step.label))
    setRunError(null)
    setExecutionSteps(order)
    setVisibleStepCount(0)
    setIsRunModalOpen(true)
  }

  useEffect(() => {
    if (!isRunModalOpen) return
    if (runError || executionSteps.length === 0) {
      setVisibleStepCount(0)
      return
    }

    setVisibleStepCount(0)
    const stepDelayMs = 450
    let current = 0
    const timer = window.setInterval(() => {
      current += 1
      setVisibleStepCount(current)
      if (current >= executionSteps.length) {
        window.clearInterval(timer)
      }
    }, stepDelayMs)

    return () => window.clearInterval(timer)
  }, [executionSteps, isRunModalOpen, runError])

  return (
    <Box display="flex" height="100vh" width="100vw" bgcolor="background.default">
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
        onDeleteNode={deleteNode}
      />

      <NodeConfigPanel
        selectedNode={selectedNode}
        updateSelectedNode={updateSelectedNode}
      />

      <Dialog
        open={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle><b>Workflow Execution</b></DialogTitle>
        <DialogContent dividers>
          {runError ? (
            <Typography color="error" variant="body2">
              {runError}
            </Typography>
          ) : executionSteps.length ? (
            <List dense>
              {executionSteps.map((step, index) => {
                const isVisible = index < visibleStepCount
                const isActive = index === visibleStepCount - 1
                const { color, Icon } = nodeVisuals[step.type]

                return (
                  <Grow
                    key={step.id}
                    in={isVisible}
                    mountOnEnter
                    unmountOnExit
                    timeout={320}
                  >
                    <ListItem
                      disableGutters
                      sx={{
                        mb: 1,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: isActive ? alpha(color, 0.16) : 'transparent',
                        border: `1px solid ${alpha(color, 0.25)}`,
                        transition: 'background-color 200ms ease',
                      }}
                    >
                      <Box
                        sx={{
                          height: 32,
                          width: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(color, 0.2),
                          color,
                          mr: 1.5,
                          flexShrink: 0,
                        }}
                      >
                        <Icon fontSize="small" />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {step.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {nodeTypeLabel[step.type]}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {index + 1}
                      </Typography>
                    </ListItem>
                  </Grow>
                )
              })}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No nodes were visited. Connect nodes from Start to see the path.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRunModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
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