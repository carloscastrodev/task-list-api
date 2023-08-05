import prisma from "@/db/prismaClient";
import { TaskStatus } from "@/types/tasks";
import { Task } from "@prisma/client";

export async function createTask({
  description,
  priority,
  parentTaskId,
}: {
  description: string;
  priority: number;
  parentTaskId: number | null;
}): Promise<Task> {
  return await prisma.task.create({
    data: {
      description,
      priority,
      status: TaskStatus.PENDING,
      parentTaskId,
    },
  });
}
