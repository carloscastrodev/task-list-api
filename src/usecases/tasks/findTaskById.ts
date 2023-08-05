import prisma from "@/db/prismaClient";
import { Task } from "@prisma/client";

export async function findTaskById(id: number): Promise<Task | null> {
  return await prisma.task.findUnique({
    where: {
      id,
    },
  });
}
