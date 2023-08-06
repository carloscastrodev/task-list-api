import prisma from "@/db/prismaClient";
import { TaskStatus } from "@/types/tasks";
import { Task } from "@prisma/client";

/**
 * Completes a task by updating it's status to DONE and doneAt property to current date.
 * Also completes every subtask of the given task
 */
export async function completeTask(id: number): Promise<Task> {
  const doneAt = new Date();

  const [_, task] = await prisma.$transaction([
    prisma.task.updateMany({
      where: {
        parentTaskId: id,
      },
      data: {
        doneAt,
        status: TaskStatus.DONE,
      },
    }),
    prisma.task.update({
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
      where: {
        id,
      },
      data: {
        doneAt,
        status: TaskStatus.DONE,
      },
    }),
  ]);

  return task;
}
