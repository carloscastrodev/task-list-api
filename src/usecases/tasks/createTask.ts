import prisma from "@/db/prismaClient";
import { TaskStatus } from "@/types/tasks";
import { Task } from "@prisma/client";

/**
 * Creates a task with given description, priority and parentTaskId. If parentTaskId is not null, creates a subtask of the parent task.
 */
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
