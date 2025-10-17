import { createTRPCRouter, protectedProcedure } from '../init';
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "wilson.asher00@gmail.com",
      }
    }) 

    return { success: true, message: "Job Queued" }
  }),
});

export type AppRouter = typeof appRouter;