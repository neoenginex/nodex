import { generateSlug } from "random-word-slugs";
import { createTRPCRouter, protectedProcedure, premiumProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { TRPCError } from "@trpc/server";
import { NodeType } from "@/generated/prisma";
import { Node as FlowNode, Edge } from "@xyflow/react";

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(({ ctx }) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
                node: {
                    create: {
                        type: NodeType.INITIAL,
                        position: { x: 0, y: 0 },
                        name: NodeType.INITIAL,
                    }
                }
            },
        });
    }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const workflow = await prisma.workflow.findUnique({
                where: { id: input.id }
            });

            if (!workflow || workflow.userId !== ctx.auth.user.id) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Workflow not found or unauthorized",
                });
            }

            return prisma.workflow.delete({
                where: { id: input.id },
            });
        }),
    updateName: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string().min(1) }))
        .mutation(({ ctx, input }) => {
            return prisma.workflow.update({
            where: { id: input.id, userId: ctx.auth.user.id },
            data: { name: input.name }
        });
    }),
    getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        const workflow = await prisma.workflow.findUnique({
            where: { id: input.id },
            include: { node: true, connections: true },
        });

        if (!workflow) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Workflow with id ${input.id} not found`,
            });
        }

        if (workflow.userId !== ctx.auth.user.id) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You do not have access to this workflow",
            });
        }

        const nodes: FlowNode[] = workflow.node.map((node) => ({
            id: node.id,
            type: node.type,
            position: node.position as { x: number, y: number },
            data: (node.data as Record<string, unknown>) || {},
        }));

        const edges: Edge[] = workflow.connections.map((connection) => ({
            id: connection.id,
            source: connection.fromNodeId,
            target: connection.toNodeId,
            sourceHandle: connection.fromOutput,
            targetHandle: connection.toInput,
        }));

        return {
            id: workflow.id,
            name: workflow.name,
            nodes,
            edges,
        };
    }),
    getMany: protectedProcedure
        .input(
            z.object({
               page: z.number().default(PAGINATION.DEFAULT_PAGE),
               pageSize: z
                .number()
                .min(PAGINATION.MIN_PAGE_SIZE)
                .max(PAGINATION.MAX_PAGE_SIZE)
                .default(PAGINATION.DEFAULT_PAGE_SIZE),
            search: z.string().default(""),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;

            const [items, totalCount] = await Promise.all([
                prisma.workflow.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    where: { 
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },  
                }),
                prisma.workflow.count({
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        }
                    },
                }),
            ]);

            const totalPages = Math.ceil(totalCount / pageSize );
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            return {
                items: items,
                page,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            };
    }),
});
