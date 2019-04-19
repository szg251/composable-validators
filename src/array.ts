import { Validator, fail, succeed, merge, validate } from "./core"

/** Creates a validator that checks if the array is exactly as long as a given number */
const length = <T>(
  errorMsg: string,
  amount: number
): Validator<T[]> => validatee =>
  validatee.value.length === amount
    ? succeed(validatee)
    : fail(errorMsg)(validatee)

/** Creates a validator that checks all the values in the array with a given validator */
const every = <T>(validator: Validator<T>): Validator<T[]> => validatee => {
  return validatee.value.reduce((prev, current, index) => {
    const validatedPart = validate(current, validator)
    return {
      ...prev,
      isValid: prev.isValid && validatedPart.isValid,
      errors: [...prev.errors, ...validatedPart.errors]
    }
  }, succeed(validatee))
}

/** Creates a validator that checks all the values in the array with a given list of validator */
const each = <T>(
  errorMsg: string,
  validators: Validator<T>[]
): Validator<T[]> => validatee =>
  validatee.value
    .filter((_, index) => validators[index])
    .map((item, index) => validate(item, validators[index]))
    .reduce(merge, length<T>(errorMsg, validators.length)(validatee))

export { length, every, each }
