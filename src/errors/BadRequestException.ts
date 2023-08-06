import { HTTPException } from "./HTTPException";

export class BadRequestException extends HTTPException {
  constructor(message: string = "Bad Request") {
    super(400, message);
  }
}
