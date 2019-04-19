import { Validator, fail, succeed, merge, validate } from "./validatee"

type Schema<T> = { [K in keyof T]: Validator<T[K]> }

/** Creates a validator that checks the properties of an object based on a schema */
const schema = <T extends Object>(
  errorMsg: string,
  schema: Schema<T>
): Validator<T> => validatee =>
  Object.entries(validatee.value).reduce(
    (prevObj, [key, value]) => merge(prevObj, validate(value, schema[key])),
    schemaForm(errorMsg, schema)(validatee)
  )

/** Creates a validator that checks if the object type matches the schema */
const schemaForm = (
  errorMsg: string,
  schema: Schema<any>
): Validator<any> => validatee =>
  Object.keys(schema).every(key => typeof validatee.value[key] !== "undefined")
    ? succeed(validatee)
    : fail(errorMsg)(validatee)

export { schema }
