import { Validator, succeed, fail, custom } from "./validatee"

const isString = (errorMsg: string): Validator<any> =>
  custom(value => typeof value === "string", errorMsg)

const min = (minChars: number, errorMsg: string): Validator<string> =>
  custom(value => value.length >= minChars, errorMsg)

const max = (minChars: number, errorMsg: string): Validator<string> =>
  custom(value => value.length >= minChars, errorMsg)

export { isString, min, max }
