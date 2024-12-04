import { getOlympiadById } from "@/data/loaders";

export default async function OlympiadSingleRoute({
  params,
  children,
}: {
  readonly params: any;
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-start-1 col-span-5">{children}</div>
      </div>
    </div>
  );
}
