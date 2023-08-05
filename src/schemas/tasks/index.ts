import { TaskStatus } from "@/types/tasks";
import Joi from "joi";

const taskStatusValidator = (value: number) => {
  if (!Object.values(TaskStatus).includes(value)) {
    return { message: "Invalid status provided" };
  }

  return value;
};

export const createTaskBodySchema = Joi.object({
  description: Joi.string().messages({
    "any.required": "description is required",
  }),
  parentTaskId: Joi.number().allow(null).messages({
    "number.base": "parentTaskId should be a number or null",
  }),
  priority: Joi.number().messages({
    "number.base": "Priority should be a number",
  }),
  status: Joi.custom(taskStatusValidator).optional(),
});

export const completeTaskParamsSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "param id should be a valid number",
    }),
});

export const deleteTaskParamsSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "param id should be a valid number",
    }),
});

export const updateTasksPrioritiesBodySchema = Joi.object()
  .pattern(Joi.number(), Joi.number())
  .messages({
    "object.pattern": "Should be a map of number keys and number values",
  });
