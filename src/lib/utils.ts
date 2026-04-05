// This helper keeps JSX class lists readable without pulling in another package.
export function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

// Formatting dates in one place keeps the UI consistent across dashboard widgets.
export function formatRelativeDate(date: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch (error) {
    console.error("Failed to format date", error);
    return date;
  }
}

// This small helper gives pages a predictable label for progress badges.
export function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
