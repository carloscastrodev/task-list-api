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
      let sentMessage = "";

      err.details.forEach(({ message }) => (sentMessage += message + "\n"));

      return {
        isValid: false,
        message: sentMessage,
      };
    }

    return {
      isValid: false,
      message: "Value does not satisfy schema",
    };
  }
}
