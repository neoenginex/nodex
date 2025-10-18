import { useWorkflowsParams } from "@/hooks/use-workflows-params";
import { trpc } from "@/trpc/client"
import { toast } from "sonner";

export const useSuspenseWorkflows = () => {
    const [params] = useWorkflowsParams();

    return trpc.workflows.getMany.useSuspenseQuery(params);
};

export const useCreateWorkflow = () => {
    const utils = trpc.useUtils();

    return trpc.workflows.create.useMutation({
        onSuccess: (data) => {
            toast.success(`Workflow "${data.name}" created.`);
            utils.workflows.getMany.invalidate();
        },
        onError: (error: any) => {
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    });
};


export const useRemoveWorkflow = () => {
    const utils = trpc.useUtils();

    return trpc.workflows.remove.useMutation({
        onSuccess: (data) => {
            toast.success(`Workflow "${data.name}" removed.`);
            utils.workflows.getMany.invalidate();
            utils.workflows.getOne.invalidate({ id: data.id });
        },
        onError: (error: any) => {
            toast.error(`Failed to remove workflow: ${error.message}`);
        },
    });
};