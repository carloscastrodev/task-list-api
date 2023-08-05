import Joi from "joi";
import { applySchema } from "../applySchema";

describe("@schemas - applySchema", () => {
  const schema = Joi.object().keys({
    id: Joi.number().required().messages({
      "number.base": "id should be a number",
      "any.required": "id is required",
    }),
  });

  it("Should return an object {isValid: true} when value matches schema", async () => {
    expect(applySchema({ id: 1 }, schema)).toEqual({ isValid: true });
  });

  it("Should return an object {isValid: false, message: string} when value does not match schema", async () => {
    const test = applySchema({ id: "x" }, schema);

    expect(test.isValid).toEqual(false);
    expect(typeof test.message).toEqual("string");
  });
});
