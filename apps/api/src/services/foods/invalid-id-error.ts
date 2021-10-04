// Thrown when a request is made with a bad ID (invalid food code, locale ID etc)
// Should be translated to either 400 or 404 in the HTTP layer
export default class InvalidIdError extends Error {}
