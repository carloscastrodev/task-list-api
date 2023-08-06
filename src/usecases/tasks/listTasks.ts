import prisma from "@/db/prismaClient";
import { Task } from "@prisma/client";

/**
 * List tasks and subtasks. The root level of the array only contains tasks that are not subtasks.
 */
export async function listTasks(): Promise<Task[]> {
  return await prisma.task.findMany({
    include: {
      subtasks: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      priority: "asc",
    },
    where: {
      deletedAt: null,
      parentTaskId: null,
    },
  });
}
