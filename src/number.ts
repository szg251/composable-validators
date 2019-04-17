import { Validator, custom } from "./validatee"

/** Creates a validator that checks if the value is a number */
const isNumber = <T>(errorMsg: string): Validator<T> =>
  custom(value => typeof value === "number", errorMsg)

/** Creates a validator that checks if the value is greater than or equal to a given number */
const min = (errorMsg: string, minChars: number): Validator<number> =>
  custom(value => value >= minChars, errorMsg)

/** Creates a validator that checks if the value is less than or equal to a given number */
const max = (errorMsg: string, maxChars: number): Validator<number> =>
  custom(value => value <= maxChars, errorMsg)

export { isNumber, min, max }
