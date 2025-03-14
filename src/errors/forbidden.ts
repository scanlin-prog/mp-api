class ForbiddenError extends Error {
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
