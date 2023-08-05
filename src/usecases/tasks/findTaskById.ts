import prisma from "@/db/prismaClient";
import { Task } from "@prisma/client";

/**
 * Try to find and return a task by id. Returns null if it does not exist.
 */
export async function findTaskById(id: number): Promise<Task | null> {
  return await prisma.task.findUnique({
    where: {
      id,
    },
  });
}
