import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { HydrateClient } from "@/trpc/server";
import { WorkflowsContainer, WorkflowsList } from "@/features/workflows/components/workflows";

const Page = async () => {
    await requireAuth();

    prefetchWorkflows();

    return (
        <WorkflowsContainer>
         <HydrateClient>
           <ErrorBoundary fallback={<p>Error!</p>}>
              <Suspense fallback={<p>Loading...</p>}>
                <WorkflowsList />
              </Suspense>
            </ErrorBoundary>
          </HydrateClient>
        </WorkflowsContainer>
    )
};

export default Page;