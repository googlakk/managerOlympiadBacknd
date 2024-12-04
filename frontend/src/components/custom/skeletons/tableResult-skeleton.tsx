import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

export const TableResultsSkeleton = () => {
  return (
    <>
      <Table className="border">
        {/* Заголовки таблицы */}
        <TableHeader>
          <TableRow className="h-[110px] border-b flex relative ">
            <TableHead>
              <Skeleton />
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Тело таблицы */}
        <TableBody>
          <TableRow>
            <Skeleton />
            {/* Колонка ФИО */}
            <TableCell></TableCell>
            {/* Колонка c Баллами*/}
            <Skeleton className="min-w-[256px] border-r w-[256px]" />
            <TableCell></TableCell>
            <Skeleton className="w-[106px] border-r" />
            {/* Колонка для ответов на задания */}
            <Skeleton className="flex-1 align-middle border-r" />
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className=" bg-white">
          <Skeleton className="w-full" />
        </TableFooter>
      </Table>
    </>
  );
};
