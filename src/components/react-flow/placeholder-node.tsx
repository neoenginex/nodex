"use client";

import React, { useCallback, forwardRef, type ReactNode } from "react";
import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import { BaseNode } from "./base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
  ({ children, onClick, className }, ref) => {
    return (
      <BaseNode
        ref={ref}
        className={`w-[50px] h-[50px] border-dashed border-gray-400 bg-card p-2 text-center text-gray-400 shadow-none cursor-pointer hover:border-gray-300 hover:bg-white/5 ${className || ''}`}
        onClick={onClick}
      >
        {children}
        <Handle
          type="target"
          style={{ visibility: "hidden" }}
          position={Position.Top}
          isConnectable={false}
        />
        <Handle
          type="source"
          style={{ visibility: "hidden" }}
          position={Position.Bottom}
          isConnectable={false}
        />
      </BaseNode>
    );
  },
);

PlaceholderNode.displayName = "PlaceholderNode";
