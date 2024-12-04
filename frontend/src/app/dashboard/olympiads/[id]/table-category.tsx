"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addParticipantsToCategory,
  removeParticipantsByCategory,
} from "@/data/actions/category-actions";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/custom/table/ParticipantsPaginationTable";
import { Input } from "@/components/ui/input";
import { Participants } from "@/store/useOlympiadsStore";
import { addParticipantsAction } from "@/data/actions/participant-actions";
import { toast } from "sonner";
import useParticipantsStore from "@/store/useParticipantsStore";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<Participants>[];
  data: TData[];
  params: {
    id: string;
  };
  categoryId: string;
  dataReload: (r: boolean) => void;
}

export function CategoryTable<TData extends { id: Participants }, TValue>({
  columns,
  data,
  categoryId,
  dataReload,
}: DataTableProps<Participants, TValue>) {
  // Состояние для хранения выбранных пользователей
  const [selectedUsers, setSelectedUsers] = useState<Participants[]>([]);
  const setUsers = useParticipantsStore((state) => state.setParticipants);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });
  const filteredData = () => {
    const newParticipants = data.filter(
      (participant) =>
        !selectedUsers.some(
          (selectedParticipants) => selectedParticipants.id === participant.id
        )
    );
    return newParticipants;
  };

  const handleRemoveParticipants = () => {
    setUsers(selectedUsers);

    removeParticipantsByCategory(
      categoryId,
      filteredData().map((user) => user.id)
    );
    dataReload(true);
    toast.success("Участник(и) удален(ы)");
    setSelectedUsers([]), setUsers([]), setSorting([]), setRowSelection({});
    setColumnFilters([]);
  };

  const handleRowSelect = (rowId: string, user: Participants) => {
    setRowSelection((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));

    setSelectedUsers((prevSelectedUsers) => {
      // Проверка: если пользователь уже выбран, удаляем его из списка
      if (prevSelectedUsers.some((selected) => selected.id === user.id)) {
        return prevSelectedUsers.filter((selected) => selected.id == user.id);
      } else {
        // Иначе добавляем пользователя в список выбранных
        return [...prevSelectedUsers, user];
      }
    });
  };

  console.log(selectedUsers);

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Find students..."
          value={
            (table.getColumn("firstName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className=" cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowSelect(row.id, row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} user(s) selected.
        </div>
        <DataTablePagination table={table} />

        <div>
          <Button onClick={handleRemoveParticipants}>Удалить</Button>
        </div>
      </div>
    </div>
  );
}
