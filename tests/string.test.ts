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
      expect(min("too short", 4)(init("1234"))).toEqual({
        value: "1234",
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when shorter than 4", () =>
      expect(min("too short", 4)(init("123"))).toEqual({
        value: "123",
        isValid: false,
        isValidated: true,
        errors: ["too short"]
      }))
  })

  describe("max", () => {
    it("succeeds when is shorter than 4", () =>
      expect(max("too long", 4)(init("1234"))).toEqual({
        value: "1234",
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when longer than 4", () =>
      expect(max("too long", 4)(init("12345"))).toEqual({
        value: "12345",
        isValid: false,
        isValidated: true,
        errors: ["too long"]
      }))
  })

  describe("regex", () => {
    it("succeeds when regex matches", () => {
      const expected = {
        value: "abcABC123",
        isValid: true,
        isValidated: true,
        errors: []
      }
      expect(regex("no lowercase letters", /[a-z]/)(init("abcABC123"))).toEqual(
        expected
      )
      expect(regex("no lowercase letters", "[a-z]")(init("abcABC123"))).toEqual(
        expected
      )
    })

    it("fails when regex doesn't match", () => {
      const expected = {
        value: "ABC123",
        isValid: false,
        isValidated: true,
        errors: ["no lowercase letters"]
      }
      expect(regex("no lowercase letters", /[a-z]/)(init("ABC123"))).toEqual(
        expected
      )
      expect(regex("no lowercase letters", "[a-z]")(init("ABC123"))).toEqual(
        expected
      )
    })
  })
})

describe("hasXY", () => {
  it("succeeds when has at least 1 number", () =>
    expect(hasNumber("no numbers")(init("a2bc"))).toEqual({
      value: "a2bc",
      isValid: true,
      isValidated: true,
      errors: []
    }))

  it("fails when has no numbers", () =>
    expect(hasNumber("no numbers")(init("abc"))).toEqual({
      value: "abc",
      isValid: false,
      isValidated: true,
      errors: ["no numbers"]
    }))

  it("succeeds when has the required amount of numbers", () =>
    expect(hasNumber("not enough numbers", 2)(init("a2bc1"))).toEqual({
      value: "a2bc1",
      isValid: true,
      isValidated: true,
      errors: []
    }))

  it("fails when has less than required amount of numbers", () =>
    expect(hasNumber("not enough numbers", 2)(init("a2bc"))).toEqual({
      value: "a2bc",
      isValid: false,
      isValidated: true,
      errors: ["not enough numbers"]
    }))
})

describe("composed validators", () => {
  const isValidPassword = composeMany([
    hasLowcase("no lowercase letters"),
    hasUpcase("no uppercase letters"),
    hasNumber("no numbers"),
    min("less than 5 chars", 5)
  ])

  it("succeeds when meets password criteria", () => {
    expect(isValidPassword(init("abCD1"))).toEqual({
      value: "abCD1",
      isValid: true,
      isValidated: true,
      errors: []
    })
  })

  it("fails when has no numbers", () => {
    expect(isValidPassword(init("abCDE"))).toEqual({
      value: "abCDE",
      isValid: false,
      isValidated: true,
      errors: ["no numbers"]
    })
  })

  it("fails when has nothing but numbers", () => {
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
