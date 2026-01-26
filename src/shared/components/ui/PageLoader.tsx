import Loader from "./Loader";

export default function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}
