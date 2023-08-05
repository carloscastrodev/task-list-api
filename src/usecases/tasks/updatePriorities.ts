import prisma from "@/db/prismaClient";

/**
 * @param idPriorityMap - Should be a map from task ids to numbers representing the updated priority of each task.
 */
export async function updatePriorities(
  idPriorityMap: Record<number, number>
): Promise<void> {
  await prisma.$transaction(
    Object.entries(idPriorityMap).map(([id, priority]) =>
      prisma.task.updateMany({
        where: {
          id: Number(id),
        },
        data: {
          priority,
        },
      })
    )
  );
}
