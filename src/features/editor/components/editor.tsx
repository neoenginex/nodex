"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

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

    console.log('workflowId:', workflowId);
    console.log('workflow:', workflow);

    return (
        <div>
            <p>Workflow ID: {workflowId}</p>
            <pre>
                {JSON.stringify(workflow, null, 2)}
            </pre>
        </div>
    );
};