export class CustomError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.details = details;
  }
}
