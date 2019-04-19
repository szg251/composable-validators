import { schema } from "../src/object"
import { init } from "../src/validatee"
import * as string from "../src/string"
import { stringTypeAnnotation } from "@babel/types"

describe("object validators", () => {
  describe("schema validator", () => {
    describe("flat schema", () => {
      const schemaValidator = schema({
        fieldA: string.max("too long", 4),
        fieldB: string.min("too short", 4),
        fieldC: string.onlyNumbers("not a number")
      })

      it("succeeds when every element of the array succeeds", () =>
        expect(
          schemaValidator(
            init({
              fieldA: "1234",
              fieldB: "1234",
              fieldC: "1234"
            })
          ).isValid
        ).toBeTruthy())

      it("fails when any element of the array fails", () =>
        expect(
          schemaValidator(
            init({
              fieldA: "1234",
              fieldB: "123",
              fieldC: "1234"
            })
          ).isValid
        ).toBeFalsy())
    })

    describe("nested schema", () => {
      const schemaValidator = schema({
        fieldA: string.max("too long", 4),
        fieldB: string.min("too short", 4),
        fieldC: schema({
          nestedFieldA: string.onlyNumbers("not a number"),
          nestedFieldB: string.onlyLowcases("not a lowcase")
        })
      })

      it("succeeds when every element of the array succeeds", () =>
        expect(
          schemaValidator(
            init({
              fieldA: "1234",
              fieldB: "1234",
              fieldC: {
                nestedFieldA: "123",
                nestedFieldB: "abc"
              }
            })
          ).isValid
        ).toBeTruthy())

      it("fails when any element of the array fails", () =>
        expect(
          schemaValidator(
            init({
              fieldA: "1234",
              fieldB: "123",
              fieldC: {
                nestedFieldA: "123",
                nestedFieldB: "abc123"
              }
            })
          ).isValid
        ).toBeFalsy())
    })
  })
})
