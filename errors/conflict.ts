class ConflictError extends Error {
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

export default ConflictError;
