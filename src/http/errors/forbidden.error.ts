export default class ForbiddenError extends Error {
  constructor(message?: string) {
    super(message ?? 'Forbidden');
  }
}
