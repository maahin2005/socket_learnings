export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode: number = 500, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    // Set the prototype explicitly to ensure instanceof works correctly
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
