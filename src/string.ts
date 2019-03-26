import { Validator, custom, init } from "./validatee"
import * as array from "./array"

/*
 * Basic validators
 */

const regex = (errorMsg: string, regexp: string | RegExp): Validator<string> =>
  typeof regexp === "string"
    ? custom(value => new RegExp(regexp).test(value), errorMsg)
    : custom(value => regexp.test(value), errorMsg)

const isString = <T>(errorMsg: string): Validator<T> =>
  custom(value => typeof value === "string", errorMsg)

const min = (errorMsg: string, minChars: number): Validator<string> =>
  custom(value => value.length >= minChars, errorMsg)

const max = (errorMsg: string, maxChars: number): Validator<string> =>
  custom(value => value.length <= maxChars, errorMsg)

const length = (errorMsg: string, minChars: number): Validator<string> =>
  custom(value => value.length === minChars, errorMsg)

/*
 * Regex based validators
 */

const hasLowcase = (errorMsg: string, atLeast: number = 1): Validator<string> =>
  regex(errorMsg, `([a-z].*){${atLeast}}`)

const onlyLowcases = (errorMsg: string): Validator<string> =>
  regex(errorMsg, /^[a-z]*$/)

const hasUpcase = (errorMsg: string, atLeast: number = 1): Validator<string> =>
  regex(errorMsg, `([A-Z].*){${atLeast}}`)

const onlyUpcases = (errorMsg: string): Validator<string> =>
  regex(errorMsg, /^[A-Z]*$/)

const hasNumber = (errorMsg: string, atLeast: number = 1): Validator<string> =>
  regex(errorMsg, `([0-9].*){${atLeast}}`)

const onlyNumbers = (errorMsg: string): Validator<string> =>
  regex(errorMsg, /^[0-9]*$/)

const isEmail = (errorMsg: string): Validator<string> =>
  regex(
    errorMsg,
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )

const separated = (
  errorMsg: string,
  separator: string,
  validators: Validator<string>[]
): Validator<string> => validatee => ({
  ...array.each(errorMsg, validators)(init(validatee.value.split(separator))),
  value: validatee.value
})

export {
  isString,
  min,
  max,
  length,
  regex,
  hasLowcase,
  onlyLowcases,
  hasUpcase,
  onlyUpcases,
  hasNumber,
  onlyNumbers,
  isEmail,
  separated
}
