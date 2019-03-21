import {
  isString,
  min,
  max,
  regex,
  hasLowcase,
  hasUpcase,
  hasNumber
} from "../src/string"
import { init, composeMany } from "../src/validatee"

describe("string validators", () => {
  describe("isString", () => {
    it("succeeds when is string", () =>
      expect(isString("not a string")(init("string"))).toEqual({
        value: "string",
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when not string", () =>
      expect(isString("not a string")(init(1))).toEqual({
        value: 1,
        isValid: false,
        isValidated: true,
        errors: ["not a string"]
      }))
  })

  describe("min", () => {
    it("succeeds when is longer than 4", () =>
      expect(min(4, "too short")(init("1234"))).toEqual({
        value: "1234",
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when shorter than 4", () =>
      expect(min(4, "too short")(init("123"))).toEqual({
        value: "123",
        isValid: false,
        isValidated: true,
        errors: ["too short"]
      }))
  })

  describe("max", () => {
    it("succeeds when is shorter than 4", () =>
      expect(max(4, "too long")(init("1234"))).toEqual({
        value: "1234",
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when longer than 4", () =>
      expect(max(4, "too long")(init("12345"))).toEqual({
        value: "12345",
        isValid: false,
        isValidated: true,
        errors: ["too long"]
      }))
  })

  describe("regex", () => {
    it("succeeds when regex matches", () =>
      expect(regex(/[a-z]/, "no lowercase letters")(init("abcABC123"))).toEqual(
        {
          value: "abcABC123",
          isValid: true,
          isValidated: true,
          errors: []
        }
      ))

    it("fails when regex doesn't match", () =>
      expect(regex(/[a-z]/, "no lowercase letters")(init("ABC123"))).toEqual({
        value: "ABC123",
        isValid: false,
        isValidated: true,
        errors: ["no lowercase letters"]
      }))
  })
})

describe("composed validators", () => {
  it("succeeds when meets password criteria", () => {
    const isValidPassword = composeMany([
      hasLowcase("no lowercase letters"),
      hasUpcase("no uppercase letters"),
      hasNumber("no numbers"),
      min(5, "at least 5 chars")
    ])

    expect(isValidPassword(init("abCD1"))).toEqual({
      value: "abCD1",
      isValid: true,
      isValidated: true,
      errors: []
    })
  })

  it("fails when has no numbers", () => {
    const isValidPassword = composeMany([
      hasLowcase("no lowercase letters"),
      hasUpcase("no uppercase letters"),
      hasNumber("no numbers"),
      min(5, "less than 5 chars")
    ])

    expect(isValidPassword(init("abCDE"))).toEqual({
      value: "abCDE",
      isValid: false,
      isValidated: true,
      errors: ["no numbers"]
    })
  })

  it("fails when has nothing but numbers", () => {
    const isValidPassword = composeMany([
      hasLowcase("no lowercase letters"),
      hasUpcase("no uppercase letters"),
      hasNumber("no numbers"),
      min(5, "less than 5 chars")
    ])

    expect(isValidPassword(init("1234"))).toEqual({
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
})
