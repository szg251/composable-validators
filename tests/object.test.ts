import { schema } from "../src/object"
import { init } from "../src/validatee"
import * as string from "../src/string"

describe("object validators", () => {
  describe("schema validator", () => {
    describe("flat schema", () => {
      const schemaValidator = schema("invalid object", {
        fieldA: string.max("too long", 4),
        fieldB: string.min("too short", 4),
        fieldC: string.onlyNumbers("not a number")
      })

      it("succeeds when every property of the object succeeds", () =>
        expect(
          schemaValidator(
            init({
              fieldA: "1234",
              fieldB: "1234",
              fieldC: "1234"
            })
          ).isValid
        ).toBeTruthy())

      it("fails when the object type doesn't match the schema", () =>
        expect(
          schemaValidator(
            init<any>({
              fieldA: "1234",
              fieldB: "1234"
            })
          ).errors
        ).toEqual(["invalid object"]))

      it("fails when any property of the object fails", () =>
        expect(
          schemaValidator(
            init({
              fieldA: "1234",
              fieldB: "123",
              fieldC: "1234"
            })
          ).isValid
        ).toBeFalsy())

      it("aggregates error messages when many properties of the object fail", () =>
        expect(
          schemaValidator(
            init({
              fieldA: "1234",
              fieldB: "123",
              fieldC: "1234a"
            })
          ).errors
        ).toEqual(["too short", "not a number"]))
    })

    describe("nested schema", () => {
      const schemaValidator = schema("invalid object", {
        fieldA: string.max("too long", 4),
        fieldB: string.min("too short", 4),
        fieldC: schema("invalid object", {
          nestedFieldA: string.onlyNumbers("not a number"),
          nestedFieldB: string.onlyLowcases("not a lowcase")
        })
      })

      it("succeeds when every property of the object succeeds", () =>
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

      it("fails when any property of the object fails", () =>
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

      it("aggregates error messages when many properties of the object fail", () =>
        expect(
          schemaValidator(
            init({
              fieldA: "12345",
              fieldB: "1234",
              fieldC: {
                nestedFieldA: "123",
                nestedFieldB: "abc123"
              }
            })
          ).errors
        ).toEqual(["too long", "not a lowcase"]))
    })
  })
})
