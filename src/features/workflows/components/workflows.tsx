"use client";

import { formatDistanceToNow } from "date-fns";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { EmptyView, EntityContainer, EntityHeader, EntityPagination, EntityList, EntitySearch, ErrorView, LoadingView, EntityItem } from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "@/hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
import { WorkflowIcon } from "lucide-react";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Workflow = RouterOutput["workflows"]["getMany"]["items"][number];

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    })
    return (
        <EntitySearch 
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search workflows"
        />
    );
};

export const WorkflowsList = () => {
    const [workflows] = useSuspenseWorkflows();

    return (
        <EntityList
            items={workflows.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow} />}
            emptyView={<WorkflowsEmpty />}
        />
    )
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();
    const router = useRouter();
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            },
        });
    }
    
    return (
        <>
            {modal}
            <EntityHeader 
                title="Workflows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New Workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    );
};

export const WorkflowsPagination = () => {
    const [workflows] = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();

    return (
        <EntityPagination
        disabled={false}
        totalPages={workflows.totalPages}
        page={workflows.page}
        onPageChange={(page) => setParams({ ...params, page })}
        />
    );
};

export const WorkflowsContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    );
};

export const WorkflowsLoading = () => {
    return <LoadingView message="Loading workflows..." />;
};

export const WorkflowsError = () => {
    return <ErrorView message="Error loading workflows." />;
};

export const WorkflowsEmpty = () => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            },
        });
    }

    return (
        <>
            {modal}
            <EmptyView
                onNew={handleCreate}
                message="Workflow not found. Create new workflow to get started."
                buttonLabel="New Workflow"
            />
        </>
    );
};

export const WorkflowItem = ({
    data,
}: {
    data: Workflow
}) => {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({ id: data.id });
    }

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={`Updated ${formatDistanceToNow(data.updatedAt, { addSuffix: true })} • Created ${formatDistanceToNow(data.createdAt, { addSuffix: true })}`}
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}
        />
    )
}
