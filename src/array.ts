import { Validator, init, fail, succeed, merge } from "./validatee"

const length = <T>(
  errorMsg: string,
  amount: number
): Validator<T[]> => validatee =>
  validatee.value.length === amount
    ? succeed(validatee)
    : fail(errorMsg)(validatee)

const every = <T>(validator: Validator<T>): Validator<T[]> => validatee => {
  return validatee.value.reduce((prev, current, index) => {
    const validatedPart = validator(init(current))
    return {
      ...prev,
      isValid: prev.isValid && validatedPart.isValid,
      errors: [...prev.errors, ...validatedPart.errors]
    }
  }, succeed(validatee))
}

const each = <T>(
  errorMsg: string,
  validators: Validator<T>[]
): Validator<T[]> => validatee =>
  validatee.value
    .filter((_, index) => validators[index])
    .map((item, index) => validators[index](init(item)))
    .reduce(merge, length<T>(errorMsg, validators.length)(validatee))

export { length, every, each }
