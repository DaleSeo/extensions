/**
 * Converts unknown error types to Error objects
 * Useful for catch blocks where error type is unknown
 * @param err - The error to convert
 * @returns An Error object
 */
export function toError(err: unknown): Error {
  if (err instanceof Error) {
    return err;
  }
  return new Error(String(err));
}
