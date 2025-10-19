"use client";

import { useState, useCallback } from "react";
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Edge,
    type Node,
    type NodeChange,
    type EdgeChange,
    type Connection,
    Background,
    Controls,
    Panel,
} from "@xyflow/react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import '@xyflow/react/dist/style.css';
import './editor.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";

const defaultNodeStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'hsl(var(--foreground))',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 'var(--radius)',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
};

export const EditorLoading = () => {
    console.log('EditorLoading rendered');
    return <LoadingView message="Loading editor..."/>
};

export const EditorError = () => {
    console.log('EditorError rendered');
    return <ErrorView message="Failed to load editor."/>
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const [workflow] = useSuspenseWorkflow(workflowId);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <div className="size-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                proOptions={{ hideAttribution: true }}
                nodeTypes={nodeComponents}
                fitView
            >
                <Background
                    color="rgba(255, 255, 255, 0.25)"
                    gap={32}
                    size={2}
                />
                <Controls />
                 <Panel position="top-right">
                 <AddNodeButton />   
                </Panel>
            </ReactFlow>
        </div>
    );
};