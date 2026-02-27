import { Box, Paper, Typography } from '@mui/material'
import type { EdgeChange, NodeChange, OnConnect } from 'reactflow'
import ReactFlow, { Background, Controls, MiniMap, Panel } from 'reactflow'
import type { FC } from 'react'
import type { WorkflowEdge, WorkflowNode } from '../../workflow/types'

type WorkflowCanvasProps = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: OnConnect
  onNodeClick: (nodeId: string) => void
  onDrop: React.DragEventHandler<HTMLDivElement>
  onDragOver: React.DragEventHandler<HTMLDivElement>
}

export const WorkflowCanvas: FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onDrop,
  onDragOver,
}) => {
  const handleNodeClick: NonNullable<
    React.ComponentProps<typeof ReactFlow>['onNodeClick']
  > = (_, node) => {
    onNodeClick(node.id)
  }

  return (
    <Box flex={1} position="relative" onDrop={onDrop} onDragOver={onDragOver}>
      <Box position="absolute" top={0} right={0} bottom={0} left={0}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
          <Panel position="top-right">
            <Paper elevation={1} sx={{ px: 1.5, py: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Drag nodes and connect them
              </Typography>
            </Paper>
          </Panel>
        </ReactFlow>
      </Box>
    </Box>
  )
}


