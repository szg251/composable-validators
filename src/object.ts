import { Validator, fail, succeed, merge, validate } from "./validatee"

type Schema<T> = { [K in keyof T]: Validator<T[K]> }

/** Creates a validator that checks the properties of an object based on a schema */
const schema = <T extends Object>(
  schema: Schema<T>
): Validator<T> => validatee =>
  Object.entries(validatee.value).reduce(
    (prevObj, [key, value]) => merge(prevObj, validate(value, schema[key])),
    succeed(validatee)
  )

export { schema }
