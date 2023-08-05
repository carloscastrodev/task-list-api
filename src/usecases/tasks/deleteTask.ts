import prisma from "@/db/prismaClient";
import { TaskStatus } from "@/types/tasks";

/**
 * Deletes a task by updating it's status to DELETED and deletedAt property to current date.
 */
export async function deleteTask(id: number): Promise<void> {
  await prisma.task.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      status: TaskStatus.DELETED,
    },
  });
}
