export class AuthenticationError extends Error {}

/**
 * Function to check if an error is an instance of AuthenticationError.
 *
 * @param {unknown} error
 */
export function isAuthenticationError(
  error: unknown,
): error is AuthenticationError {
  return error instanceof AuthenticationError
}
