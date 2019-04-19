type Validatee<T> = NotValidated<T> | Validated<T>

interface Validated<T> {
  value: T
  errors: string[]
  isValid: boolean
  isValidated: true
}

interface NotValidated<T> {
  value: T
  errors: []
  isValid: false
  isValidated: false
}

type Validator<T> = (validatee: Validatee<T>) => Validated<T>

/** Initializing a validatee */
const init = <T>(value: T): NotValidated<T> => ({
  value,
  errors: [],
  isValid: false,
  isValidated: false
})

/** Change the value of a validatee */
const input = <T>(validatee: Validatee<T>, value: T): NotValidated<T> => ({
  ...validatee,
  value,
  errors: [],
  isValid: false,
  isValidated: false
})

/** Change the value of a validatee with real time validation */
const inputAndValidate = <T>(validator: Validator<T>) => (
  validatee: Validatee<T>,
  value: T
): Validated<T> => validator(input(validatee, value))

/** Make a validatee valid unconditionally */
const succeed: Validator<any> = validatee => ({
  ...validatee,
  isValid: true && (validatee.isValid || !validatee.isValidated),
  isValidated: true
})

/** Makes a validatee invalid unconditionally */
const fail = (errorMsg: string): Validator<any> => validatee => ({
  ...validatee,
  isValid: false,
  isValidated: true,
  errors: [...validatee.errors, errorMsg]
})

/** Merges two validated values. Value is inherited from the first validatee */
const merge = <T>(
  validatee1: Validated<T>,
  validatee2: Validated<any>
): Validated<T> => ({
  value: validatee1.value,
  isValidated: true,
  isValid: validatee1.isValid && validatee2.isValid,
  errors: [...validatee1.errors, ...validatee2.errors]
})

/** Makes a validatee valid or invalid depending on a predicate */
const custom = <T>(
  predicate: (value: T) => boolean,
  errorMsg: string
): Validator<T> => validatee =>
  predicate(validatee.value) ? succeed(validatee) : fail(errorMsg)(validatee)

/** Compose two validators to one validator */
const compose = <T>(
  validator1: Validator<T>,
  validator2: Validator<T>
): Validator<T> => validatee => validator2(validator1(validatee))

/** Compose a list of validators to one new validator */
const composeMany = <T>(validators: Validator<T>[]): Validator<T> =>
  validators.reduce(compose)

/** Helper function that initalizes a value and runs a validator on it */
const validate = <T>(value: T, validator: Validator<T>): Validated<T> =>
  validator(init(value))

/** Flips the result of a validator */
const not = <T>(
  errorMsg: string,
  validator: Validator<T>
): Validator<T> => validatee =>
  validator(validatee).isValid ? fail(errorMsg)(validatee) : succeed(validatee)

export {
  Validator,
  Validatee,
  Validated,
  init,
  compose,
  composeMany,
  fail,
  succeed,
  merge,
  input,
  inputAndValidate,
  custom,
  validate,
  not
}
