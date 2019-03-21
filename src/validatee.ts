type Validator<a> = (validatee: Validatee<a>) => Validatee<a>

interface Validatee<a> {
  value: a
  errors: string[]
  isValid: boolean
  isValidated: boolean
}

const init = <a>(value: a): Validatee<a> => ({
  value,
  errors: [],
  isValid: false,
  isValidated: false
})

const input = <a>(validatee: Validatee<a>, value: a): Validatee<a> => ({
  ...validatee,
  value,
  errors: [],
  isValid: false,
  isValidated: false
})

const inputAndValidate = <a>(validator: Validator<a>) => (
  validatee: Validatee<a>,
  value: a
): Validatee<a> => validator(input(validatee, value))

const succeed: Validator<any> = validatee => ({
  ...validatee,
  isValid: true && (validatee.isValid || !validatee.isValidated),
  isValidated: true
})

const fail = (errorMsg: string): Validator<any> => validatee => ({
  ...validatee,
  isValid: false,
  isValidated: true,
  errors: [...validatee.errors, errorMsg]
})

const custom = <a>(
  predicate: (value: a) => boolean,
  errorMsg: string
): Validator<a> => validatee =>
  predicate(validatee.value) ? succeed(validatee) : fail(errorMsg)(validatee)

const compose = <a>(
  validator1: Validator<a>,
  validator2: Validator<a>
): Validator<a> => validatee => validator2(validator1(validatee))

const composeMany = <a>(validators: Validator<a>[]): Validator<a> =>
  validators.reduce(compose)

export {
  Validator,
  Validatee,
  init,
  compose,
  composeMany,
  fail,
  succeed,
  input,
  inputAndValidate,
  custom
}
