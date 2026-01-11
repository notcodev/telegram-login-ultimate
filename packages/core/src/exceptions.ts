export class AuthenticationError extends Error {}

export function isAuthenticationError(
  error: unknown,
): error is AuthenticationError {
  return error instanceof AuthenticationError
}
