import prisma from "@/db/prismaClient";
import { TaskStatus } from "@/types/tasks";
import { Task } from "@prisma/client";

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
