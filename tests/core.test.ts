import {
  Validatee,
  Validator,
  init,
  succeed,
  fail,
  input,
  custom,
  compose,
  many,
  not
} from "../src/core"

const initialized: Validatee<number> = {
  value: 1,
  errors: [],
  isValid: false,
  isValidated: false
}

const succeeded: Validatee<number> = {
  value: 1,
  errors: [],
  isValid: true,
  isValidated: true
}

const failed: Validatee<number> = {
  value: 1,
  errors: ["validation error"],
  isValid: false,
  isValidated: true
}

describe("basic functions", () => {
  it("initializes a validatee", () => expect(init(1)).toEqual(initialized))

  it("succeeds a validatee", () =>
    expect(succeed(initialized)).toEqual(succeeded))

  it("fails a validatee", () =>
    expect(fail("validation error")(initialized)).toEqual(failed))

  it("resets succeeded validation on input", () =>
    expect(input(succeeded, 2)).toEqual({
      ...initialized,
      value: 2
    }))

  it("resets failed validation on input", () =>
    expect(input(failed, 2)).toEqual({
      ...initialized,
      value: 2
    }))
})

describe("custom validator", () => {
  it("succeeds when predicate is true", () => {
    const isOne: Validator<number> = custom(
      value => value === 1,
      "validation error"
    )
    expect(isOne(initialized)).toEqual(succeeded)
  })

  it("fails when predicate is false", () => {
    const isTwo: Validator<number> = custom(
      value => value === 2,
      "validation error"
    )
    expect(isTwo(initialized)).toEqual(failed)
  })
})

describe("compose", () => {
  it("succeeds when both validators succeed", () =>
    expect(
      compose(
        succeed,
        succeed
      )(initialized)
    ).toEqual(succeeded))

  it("fails when both validators fail", () =>
    expect(
      compose(
        fail("validation error 1"),
        fail("validation error 2")
      )(initialized)
    ).toEqual({
      ...failed,
      errors: ["validation error 1", "validation error 2"]
    }))

  it("fails when one of the validators fails", () =>
    expect(
      compose(
        succeed,
        fail("validation error")
      )(initialized)
    ).toEqual(failed))
})

describe("many", () => {
  it("succeeds when all validators succeed", () =>
    expect(many([succeed, succeed, succeed])(initialized)).toEqual(succeeded))

  it("fails when all validators fail", () =>
    expect(
      many([
        fail("validation error 1"),
        fail("validation error 2"),
        fail("validation error 3")
      ])(initialized)
    ).toEqual({
      ...failed,
      errors: ["validation error 1", "validation error 2", "validation error 3"]
    }))

  it("fails when one of the validators fail", () =>
    expect(
      many([succeed, fail("validation error"), succeed])(initialized)
    ).toEqual(failed))
})

describe("logical NOT combinator", () => {
  it("succeeds when the validator succeeds", () =>
    expect(not("validation error", fail(""))(initialized)).toEqual(succeeded))

  it("fails when the string contains upper case letters", () =>
    expect(not("validation error", succeed)(initialized)).toEqual(failed))
})
