"use client";

import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";

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

export const InitialNode = memo((props: NodeProps) => {
    // If it has a label, show the filled state
    if (props.data?.label) {
        return (
            <WorkflowNode
                showToolbar={true}
                onDelete={() => console.log('Delete node:', props.id)}
                onSettings={() => console.log('Settings for node:', props.id)}
                name="Node 1"
            >
                <Handle
                    type="target"
                    position={Position.Top}
                    isConnectable={true}
                />
                <div
                    className="min-w-[200px] h-[50px] text-center flex items-center justify-center"
                    style={defaultNodeStyle}
                >
                    {String(props.data.label)}
                </div>
                <Handle
                    type="source"
                    position={Position.Bottom}
                    isConnectable={true}
                />
            </WorkflowNode>
        );
    }

    // Otherwise show the placeholder state
    return (
        <WorkflowNode
            showToolbar={true}
            onDelete={() => console.log('Delete node:', props.id)}
            onSettings={() => console.log('Settings for node:', props.id)}
            description="Click to add a node"
        >
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={true}
                style={{ zIndex: 10 }}
            />
            <PlaceholderNode
                className="bg-transparent"
            >
                <div className="cursor-pointer flex items-center justify-center h-full">
                    <PlusIcon className="size-4"/>
                </div>
            </PlaceholderNode>
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={true}
                style={{ zIndex: 10 }}
            />
        </WorkflowNode>
    );
});

InitialNode.displayName = "InitialNode";