export function ProjectEmpty() {
  return (
    <div className="rounded-md border py-20 text-center">
      <h3 className="text-lg font-semibold">
        No projects found
      </h3>

      <p className="mt-2 text-muted-foreground">
        Try selecting another category.
      </p>
    </div>
  );
}