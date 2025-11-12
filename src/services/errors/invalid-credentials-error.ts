export class InvalidCredentialsExistsError extends Error {
  constructor() {
    super('Email or password is wrong')
  }
}
