import { Box, IconButton, Paper, Typography } from '@mui/material'
import type { EdgeChange, NodeChange, OnConnect, NodeProps } from 'reactflow'
import ReactFlow, { Background, Controls, Handle, MiniMap, Panel, Position } from 'reactflow'
import CloseIcon from '@mui/icons-material/Close'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import FunctionsIcon from '@mui/icons-material/Functions'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import type { FC } from 'react'
import { useMemo } from 'react'
import { alpha } from '@mui/material/styles'
import type { WorkflowEdge, WorkflowNode, WorkflowNodeData, NodeType } from '../../workflow/types'
import { nodeTypeLabel } from '../../workflow/types'

type WorkflowNodeComponentData = WorkflowNodeData & {
  onDelete?: () => void
}

type WorkflowNodeComponentProps = NodeProps<WorkflowNodeComponentData>

const nodeVisuals: Record<NodeType, { color: string; Icon: typeof PlayCircleFilledIcon }> =
  {
    start: { color: '#00a7b8', Icon: PlayCircleFilledIcon },
    function: { color: '#1f5ea8', Icon: FunctionsIcon },
    condition: { color: '#f4b740', Icon: HelpOutlineIcon },
    end: { color: '#e15050', Icon: StopCircleIcon },
  }

const WorkflowNodeComponent: FC<WorkflowNodeComponentProps> = ({ data }) => {
  const { type, label, onDelete } = data
  const { color, Icon } = nodeVisuals[type]

  const showInputHandle = type !== 'start'
  const showOutputHandle = type !== 'end'

  return (
    <Paper
      elevation={2}
      sx={{
        px: 2,
        py: 1.5,
        minWidth: 180,
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
        border: `1px solid ${alpha(color, 0.3)}`,
        bgcolor: alpha(color, 0.08),
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={0.75}>
        <Box
          sx={{
            height: 28,
            width: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(color, 0.18),
            color,
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Typography variant="caption" fontWeight={700} sx={{ color }}>
          {nodeTypeLabel[type]}
        </Typography>
        {onDelete && (
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              bgcolor: 'rgba(255,255,255,0.9)',
            }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        )}
      </Box>
      <Typography variant="body2" fontWeight={600}>
        {label}
      </Typography>

      {showInputHandle && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ left: -8, background: color, border: '2px solid #fff' }}
        />
      )}
      {showOutputHandle && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ right: -8, background: color, border: '2px solid #fff' }}
        />
      )}
    </Paper>
  )
}

type WorkflowCanvasProps = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: OnConnect
  onNodeClick: (nodeId: string) => void
  onDrop: React.DragEventHandler<HTMLDivElement>
  onDragOver: React.DragEventHandler<HTMLDivElement>
  onDeleteNode: (id: string) => void
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
  onDeleteNode,
}) => {
  const handleNodeClick: NonNullable<
    React.ComponentProps<typeof ReactFlow>['onNodeClick']
  > = (_, node) => {
    onNodeClick(node.id)
  }

  const nodesWithDelete = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        style: {
          border: 'none',
          boxShadow: 'none',
          background: 'transparent',
          padding: 0,
        },
        data: {
          ...node.data,
          onDelete: () => onDeleteNode(node.id),
        },
      })),
    [nodes, onDeleteNode],
  )

  const nodeTypes = useMemo(
    () => ({
      default: WorkflowNodeComponent,
      input: WorkflowNodeComponent,
      output: WorkflowNodeComponent,
    }),
    [],
  )

  return (
    <Box flex={1} position="relative" onDrop={onDrop} onDragOver={onDragOver}>
      <Box position="absolute" top={0} right={0} bottom={0} left={0}>
        <ReactFlow
          nodes={nodesWithDelete}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
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


