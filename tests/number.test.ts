import * as number from "../src/number"
import { init, validate } from "../src/core"

describe("number validators", () => {
  describe("isNumber", () => {
    const isNumber = number.isNumber("not a number")

    it("succeeds when is number", () =>
      expect(validate(123, isNumber).isValid).toBeTruthy())

    it("fails when not number", () =>
      expect(validate(false, isNumber).isValid).toBeFalsy())
  })

  describe("min", () => {
    const min = number.min("too small", 400)

    it("succeeds when is larger than or equal to 4", () =>
      expect(validate(400, min).isValid).toBeTruthy())

    it("fails when smaller than 4", () =>
      expect(validate(399, number.min("too small", 400)).isValid).toBeFalsy())
  })

  describe("max", () => {
    const max = number.max("too large", 400)

    it("succeeds when is smaller than or equal to 4", () =>
      expect(validate(400, max).isValid).toBeTruthy())

    it("fails when longer than 4", () =>
      expect(validate(401, max).isValid).toBeFalsy())
  })
})
