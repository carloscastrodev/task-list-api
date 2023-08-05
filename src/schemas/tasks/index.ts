import Joi from "joi";

export const createTaskBodySchema = Joi.object({
  description: Joi.string(),
  parentTaskId: Joi.number().allow(null),
  priority: Joi.number(),
});

export const completeTaskParamsSchema = Joi.object({
  id: Joi.string().regex(/^[0,9]{1,}$/),
});

export const deleteTaskParamsSchema = Joi.object({
  id: Joi.string().regex(/^[0,9]{1,}$/),
});

export const updateTasksPrioritiesBodySchema = Joi.object().pattern(
  Joi.number(),
  Joi.number()
);
