/** Clear empty optional form values without changing omitted PATCH fields. */
export function normalizeOptionalFields(
  data: object,
  fields: readonly string[],
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      fields.includes(key) && value === "" ? null : value,
    ]),
  );
}
