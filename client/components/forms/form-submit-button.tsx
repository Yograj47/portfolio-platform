import { Button } from "@/components/ui/button";

interface FormSubmitButtonProps {
  loading?: boolean;
  label: string;
  loadingLabel?: string;
}

export function FormSubmitButton({
  loading = false,
  label,
  loadingLabel = "Saving...",
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={loading}
    >
      {loading ? loadingLabel : label}
    </Button>
  );
}