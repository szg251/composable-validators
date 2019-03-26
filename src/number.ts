import { Validator, custom } from "./validatee"

const isNumber = <T>(errorMsg: string): Validator<T> =>
  custom(value => typeof value === "number", errorMsg)

const min = (errorMsg: string, minChars: number): Validator<number> =>
  custom(value => value >= minChars, errorMsg)

const max = (errorMsg: string, maxChars: number): Validator<number> =>
  custom(value => value <= maxChars, errorMsg)

export { isNumber, min, max }
