import { Result, flattenData, useGenerateColumns } from "./Columns";

import { DataTable } from "./Data-table";

export default function MyComponent({ data }: { data: Result[] }) {
  const columns = useGenerateColumns(data);
  const flattenedData = flattenData(data);

  return <DataTable columns={columns} data={flattenedData} />;
}
