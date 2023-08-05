import prisma from "@/db/prismaClient";
import { Task } from "@prisma/client";

export async function listTasks(): Promise<Task[]> {
  return await prisma.task.findMany({
    include: {
      subtasks: true,
    },
    orderBy: {
      priority: "asc",
    },
    where: {
      deletedAt: null,
    },
  });
}
