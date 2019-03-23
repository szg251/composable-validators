import { isNumber, min, max } from "../src/number"
import { init, composeMany } from "../src/validatee"

describe("number validators", () => {
  describe("isNumber", () => {
    it("succeeds when is number", () =>
      expect(isNumber("not a number")(init(123))).toEqual({
        value: 123,
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when not number", () =>
      expect(isNumber("not a number")(init(false))).toEqual({
        value: false,
        isValid: false,
        isValidated: true,
        errors: ["not a number"]
      }))
  })

  describe("min", () => {
    it("succeeds when is larger than or equal to 4", () =>
      expect(min("too small", 400)(init(400))).toEqual({
        value: 400,
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when smaller than 4", () =>
      expect(min("too small", 400)(init(399))).toEqual({
        value: 399,
        isValid: false,
        isValidated: true,
        errors: ["too small"]
      }))
  })

  describe("max", () => {
    it("succeeds when is smaller than or equal to 4", () =>
      expect(max("too large", 400)(init(400))).toEqual({
        value: 400,
        isValid: true,
        isValidated: true,
        errors: []
      }))

    it("fails when longer than 4", () =>
      expect(max("too large", 400)(init(401))).toEqual({
        value: 401,
        isValid: false,
        isValidated: true,
        errors: ["too large"]
      }))
  })
})
