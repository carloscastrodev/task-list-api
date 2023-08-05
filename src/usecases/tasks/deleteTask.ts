import prisma from "@/db/prismaClient";
import { TaskStatus } from "@/types/tasks";

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
