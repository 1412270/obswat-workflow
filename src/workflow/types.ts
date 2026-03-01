import type { Edge, Node } from 'reactflow'

export type NodeType = 'start' | 'function' | 'condition' | 'end'

export type WorkflowNodeData = {
    label: string
    type: NodeType
    functionBody?: string
    conditionExpression?: string
    onDelete?: () => void
}

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge

export const initialNodes: WorkflowNode[] = [
    {
        id: 'start-1',
        type: 'input',
        position: { x: 250, y: 150 },
        data: { label: 'Start Workflow', type: 'start' },
    },
]

export const nodeTypeLabel: Record<NodeType, string> = {
    start: 'Start',
    function: 'Function',
    condition: 'Condition',
    end: 'End',
}

export const paletteItems = [
    { id: 'start', title: 'Start', description: 'Start workflow' },
    { id: 'function', title: 'Function', description: 'Execute code' },
    { id: 'condition', title: 'Condition', description: 'Branch logic' },
    { id: 'end', title: 'End', description: 'End workflow' },
] as const


