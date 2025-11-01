import Spinner from "@/components/ui/spinner";

export default function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}