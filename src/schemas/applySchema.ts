import Joi from "joi";

export function applySchema(
  value: any,
  schema: Joi.ObjectSchema<any>
): { isValid: boolean; message?: string } {
  try {
    Joi.assert(value, schema);

    return {
      isValid: true,
    };
  } catch (err) {
    if (err instanceof Joi.ValidationError) {
      return {
        isValid: false,
        message: (err as Error).message,
      };
    }

    return {
      isValid: false,
      message: "Value does not satisfy schema",
    };
  }
}
