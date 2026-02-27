import { Box, Button, Divider, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import type { FC } from 'react'
import { paletteItems } from '../../workflow/types'

type ComponentsSidebarProps = {
  onRunWorkflow: () => void
}

export const ComponentsSidebar: FC<ComponentsSidebarProps> = ({ onRunWorkflow }) => {
  return (
    <Paper
      elevation={1}
      sx={{ width: 260, display: 'flex', flexDirection: 'column', borderRadius: 0 }}
    >
      <Box px={2.5} py={2} borderBottom="1px solid #e5e7eb">
        <Typography variant="subtitle1" fontWeight={600}>
          Components
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Drag components to the canvas
        </Typography>
      </Box>

      <Box flex={1} overflow="auto">
        <List dense disablePadding>
          {paletteItems.map((item) => (
            <ListItemButton
              key={item.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow/node-type', item.id)
              }}
              sx={{ px: 2.5, py: 1.5 }}
            >
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={600}>
                    {item.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {item.description}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Divider />
      <Box p={2}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          size="small"
          onClick={onRunWorkflow}
        >
          Run Workflow
        </Button>
      </Box>
    </Paper>
  )
}


