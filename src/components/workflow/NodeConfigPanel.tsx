import { Box, Paper, TextField, Typography } from '@mui/material'
import type { FC } from 'react'
import type { WorkflowNode, WorkflowNodeData } from '../../workflow/types'
import { nodeTypeLabel } from '../../workflow/types'

type NodeConfigPanelProps = {
  selectedNode: WorkflowNode | null
  updateSelectedNode: <K extends keyof WorkflowNodeData>(
    key: K,
    value: WorkflowNodeData[K],
  ) => void
}

export const NodeConfigPanel: FC<NodeConfigPanelProps> = ({
  selectedNode,
  updateSelectedNode,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{ width: 280, borderRadius: 0, display: 'flex', flexDirection: 'column' }}
    >
      <Box px={2.5} py={2} borderBottom="1px solid #e5e7eb">
        <Typography variant="subtitle1" fontWeight={600}>
          Node Configuration
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {selectedNode ? 'Edit selected node' : 'Select a node to edit'}
        </Typography>
      </Box>

      <Box flex={1} p={2.5} display="flex" flexDirection="column" gap={2}>
        {selectedNode ? (
          <>
            <Typography variant="caption" color="text.secondary">
              {nodeTypeLabel[selectedNode.data.type]}
            </Typography>

            <TextField
              label="Display name"
              size="small"
              value={selectedNode.data.label}
              onChange={(e) => updateSelectedNode('label', e.target.value)}
            />

            {selectedNode.data.type === 'function' && (
              <TextField
                label="Function body (demo)"
                size="small"
                multiline
                minRows={6}
                value={selectedNode.data.functionBody ?? ''}
                onChange={(e) =>
                  updateSelectedNode('functionBody', e.target.value)
                }
              />
            )}

            {selectedNode.data.type === 'condition' && (
              <TextField
                label="Condition expression (demo)"
                size="small"
                multiline
                minRows={4}
                value={selectedNode.data.conditionExpression ?? ''}
                onChange={(e) =>
                  updateSelectedNode('conditionExpression', e.target.value)
                }
              />
            )}
          </>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Click a node in the canvas to configure it.
          </Typography>
        )}
      </Box>
    </Paper>
  )
}


