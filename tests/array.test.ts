import { length, every, each } from "../src/array"
import { init } from "../src/core"
import * as string from "../src/string"

describe("array validators", () => {
  describe("basic validators", () => {
    const lengthValidator = length("invalid array length", 5)
    it("succeeds when array length matches", () =>
      expect(lengthValidator(init([1, 2, 3, 4, 5])).isValid).toBeTruthy())

    it("fails when array length doesn't match", () => {
      const validated = lengthValidator(init([1, 2, 3, 4]))
      expect(validated.isValid).toBeFalsy()
    })
  })

  describe("every validator", () => {
    const maxValidator = every(string.max("too long", 4))
    it("succeeds when every element of the array succeeds", () =>
      expect(maxValidator(init(["abc", "def", "ghi"])).isValid).toBeTruthy())

    it("fails when any of the array fails", () =>
      expect(maxValidator(init(["abc", "defdef", "ghi"])).isValid).toBeFalsy())
  })
  describe("each validator", () => {
    const tupleValidator = each("invalid array length", [
      string.max("too long", 4),
      string.min("too short", 4),
      string.onlyNumbers("not a number")
    ])
    it("succeeds when every element of the array succeeds", () =>
      expect(tupleValidator(init(["abc", "abcd", "123"])).isValid).toBeTruthy())

    it("fails when array length doesn't match", () => {
      const validated = tupleValidator(init(["abc", "abcd"]))
      expect(validated.isValid).toBeFalsy()
      expect(validated.errors).toEqual(["invalid array length"])
    })

    it("fails when every any of the array fails", () => {
      const validated = tupleValidator(init(["abc", "abc", "abc"]))
      expect(validated.isValid).toBeFalsy()
      expect(validated.errors).toEqual(["too short", "not a number"])
    })
  })
})
