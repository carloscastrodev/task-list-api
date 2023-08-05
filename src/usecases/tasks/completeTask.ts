import prisma from "@/db/prismaClient";
import { TaskStatus } from "@/types/tasks";
import { Task } from "@prisma/client";

/**
 * Completes a task by updating it's status to DONE and doneAt property to current date.
 */
export async function completeTask(id: number): Promise<Task> {
  return await prisma.task.update({
    where: {
      id,
    },
    data: {
      doneAt: new Date(),
      status: TaskStatus.DONE,
    },
  });
}
