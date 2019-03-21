import { Validator, custom } from "./validatee"

const regex = (regexp: RegExp, errorMsg: string): Validator<string> =>
  custom(value => regexp.test(value), errorMsg)

const isString = (errorMsg: string): Validator<any> =>
  custom(value => typeof value === "string", errorMsg)

const min = (minChars: number, errorMsg: string): Validator<string> =>
  custom(value => value.length >= minChars, errorMsg)

const max = (maxChars: number, errorMsg: string): Validator<string> =>
  custom(value => value.length <= maxChars, errorMsg)

const hasLowcase = (errorMsg: string): Validator<string> =>
  regex(/[a-z]/, errorMsg)

const hasUpcase = (errorMsg: string): Validator<string> =>
  regex(/[A-Z]/, errorMsg)

const hasNumber = (errorMsg: string): Validator<string> =>
  regex(/[0-9]/, errorMsg)

export { isString, min, max, regex, hasLowcase, hasUpcase, hasNumber }
