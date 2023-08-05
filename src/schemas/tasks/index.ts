import Joi from "joi";

export const createTaskBodySchema = Joi.object({
  description: Joi.string().required().messages({
    "any.required": "description is required",
  }),
  parentTaskId: Joi.number().allow(null).messages({
    "number.base": "parentTaskId should be a number or null",
  }),
  priority: Joi.number().required().messages({
    "any.required": "priority is required",
    "number.base": "priority should be a number",
  }),
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
