import { Transform } from "class-transformer";

export function ToBoolean(optional: boolean = false) {
  if (optional) {
    return Transform(({ value }) =>
      value === undefined ? value : value === true || value === "true",
    );
  } else {
    return Transform(({ value }) => value === true || value === "true");
  }
}
