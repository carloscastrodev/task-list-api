import { HTTPException } from "./HTTPException";

export class NotFoundException extends HTTPException {
  constructor(message: string = "Request resource not found.") {
    super(404, message);
  }
}
