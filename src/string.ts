import { Validator, custom } from "./validatee"

const regex = (errorMsg: string, regexp: string | RegExp): Validator<string> =>
  typeof regexp === "string"
    ? custom(value => new RegExp(regexp).test(value), errorMsg)
    : custom(value => regexp.test(value), errorMsg)

const isString = (errorMsg: string): Validator<any> =>
  custom(value => typeof value === "string", errorMsg)

const min = (errorMsg: string, minChars: number): Validator<string> =>
  custom(value => value.length >= minChars, errorMsg)

const max = (errorMsg: string, maxChars: number): Validator<string> =>
  custom(value => value.length <= maxChars, errorMsg)

const hasLowcase = (errorMsg: string, atLeast: number = 1): Validator<string> =>
  regex(errorMsg, `([a-z].*){${atLeast}}`)

const hasUpcase = (errorMsg: string, atLeast: number = 1): Validator<string> =>
  regex(errorMsg, `([A-Z].*){${atLeast}}`)

const hasNumber = (errorMsg: string, atLeast: number = 1): Validator<string> =>
  regex(errorMsg, `([0-9].*){${atLeast}}`)

export { isString, min, max, regex, hasLowcase, hasUpcase, hasNumber }
