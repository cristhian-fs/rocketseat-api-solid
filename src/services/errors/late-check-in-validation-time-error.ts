export class LateCheckInValidationTimeError extends Error {
  constructor() {
    super('Check in validation time expired')
  }
}
