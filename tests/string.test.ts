import {
  isString,
  min,
  max,
  length,
  regex,
  hasLowcase,
  hasUpcase,
  hasNumber,
  onlyNumbers,
  isEmail,
  separated
} from "../src/string"
import { init, composeMany } from "../src/core"

describe("string validators", () => {
  describe("isString", () => {
    const validator = isString("not a string")

    it("succeeds when is string", () =>
      expect(validator(init("string"))).toEqual({
        value: "string",
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when not string", () =>
      expect(validator(init(1))).toEqual({
        value: 1,
        isValid: false,
        isValidated: true,
        errors: ["not a string"]
      }))
  })

  describe("min", () => {
    const validator = min("too short", 4)

    it("succeeds when is longer than 4", () =>
      expect(validator(init("1234"))).toEqual({
        value: "1234",
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when shorter than 4", () =>
      expect(validator(init("123"))).toEqual({
        value: "123",
        isValid: false,
        isValidated: true,
        errors: ["too short"]
      }))
  })

  describe("max", () => {
    const validator = max("too long", 4)

    it("succeeds when is shorter than 4", () =>
      expect(validator(init("1234"))).toEqual({
        value: "1234",
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when longer than 4", () =>
      expect(validator(init("12345"))).toEqual({
        value: "12345",
        isValid: false,
        isValidated: true,
        errors: ["too long"]
      }))
  })

  describe("regex", () => {
    const validator = regex("no lowercase letters", /[a-z]/)
    const validatorStr = regex("no lowercase letters", "[a-z]")

    it("succeeds when regex matches", () => {
      const expected = {
        value: "abcABC123",
        isValid: true,
        isValidated: true,
        errors: []
      }
      expect(validator(init("abcABC123"))).toEqual(expected)
      expect(validatorStr(init("abcABC123"))).toEqual(expected)
    })

    it("fails when regex doesn't match", () => {
      const expected = {
        value: "ABC123",
        isValid: false,
        isValidated: true,
        errors: ["no lowercase letters"]
      }
      expect(validator(init("ABC123"))).toEqual(expected)
      expect(validatorStr(init("ABC123"))).toEqual(expected)
    })
  })
})

describe("regex based", () => {
  const numberValidator = hasNumber("no numbers")

  it("succeeds when has at least 1 number", () =>
    expect(numberValidator(init("a2bc"))).toEqual({
      value: "a2bc",
      isValid: true,
      isValidated: true,
      errors: []
    }))

  it("fails when has no numbers", () =>
    expect(numberValidator(init("abc"))).toEqual({
      value: "abc",
      isValid: false,
      isValidated: true,
      errors: ["no numbers"]
    }))

  const numberValidator2 = hasNumber("not enough numbers", 2)

  it("succeeds when has the required amount of numbers", () =>
    expect(numberValidator2(init("a2bc1"))).toEqual({
      value: "a2bc1",
      isValid: true,
      isValidated: true,
      errors: []
    }))

  it("fails when has less than required amount of numbers", () =>
    expect(numberValidator2(init("a2bc"))).toEqual({
      value: "a2bc",
      isValid: false,
      isValidated: true,
      errors: ["not enough numbers"]
    }))

  const emailValidator = isEmail("invalid email")

  it("succeeds when email is valid", () =>
    expect(emailValidator(init("abc@abc.com"))).toEqual({
      value: "abc@abc.com",
      isValid: true,
      isValidated: true,
      errors: []
    }))

  it("fails when email is invalid", () =>
    expect(emailValidator(init("abc@abc"))).toEqual({
      value: "abc@abc",
      isValid: false,
      isValidated: true,
      errors: ["invalid email"]
    }))
})

describe("composed validators", () => {
  const passwordValidator = composeMany([
    hasLowcase("no lowercase letters"),
    hasUpcase("no uppercase letters"),
    hasNumber("no numbers"),
    min("less than 5 chars", 5)
  ])

  it("succeeds when meets password criteria", () => {
    expect(passwordValidator(init("abCD1"))).toEqual({
      value: "abCD1",
      isValid: true,
      isValidated: true,
      errors: []
    })
  })

  it("fails when has no numbers", () => {
    expect(passwordValidator(init("abCDE"))).toEqual({
      value: "abCDE",
      isValid: false,
      isValidated: true,
      errors: ["no numbers"]
    })
  })

  it("fails when has nothing but numbers", () => {
    expect(passwordValidator(init("1234"))).toEqual({
      value: "1234",
      isValid: false,
      isValidated: true,
      errors: [
        "no lowercase letters",
        "no uppercase letters",
        "less than 5 chars"
      ]
    })
  })

  const phoneNumberValidator = separated(
    "invalid phone number",
    "-",
    [3, 3].map(digits =>
      composeMany([
        onlyNumbers("not a number"),
        length("invalid amount of digits", digits)
      ])
    )
  )

  it("succeeds when is a phone number", () =>
    expect(phoneNumberValidator(init("123-123"))).toEqual({
      value: "123-123",
      isValid: true,
      isValidated: true,
      errors: []
    }))

  it("fails when phone number is invalid", () =>
    expect(phoneNumberValidator(init("123-a23"))).toEqual({
      value: "123-a23",
      isValid: false,
      isValidated: true,
      errors: ["not a number"]
    }))

  it("fails when phone number is invalid", () =>
    expect(phoneNumberValidator(init("123-12"))).toEqual({
      value: "123-12",
      isValid: false,
      isValidated: true,
      errors: ["invalid amount of digits"]
    }))

  it("fails when phone number is invalid", () =>
    expect(phoneNumberValidator(init("123-123-123"))).toEqual({
      value: "123-123-123",
      isValid: false,
      isValidated: true,
      errors: ["invalid phone number"]
    }))
})
