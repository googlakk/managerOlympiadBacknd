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
import { useEffect, useState } from "react";

import { AddParticipantsForms } from "@/components/custom/forms/participants/AddParticipant-forms";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/custom/table/ParticipantsPaginationTable";
import { Input } from "@/components/ui/input";
import { Participants } from "@/store/useOlympiadsStore";
import { addParticipantsAction } from "@/data/actions/participant-actions";
import { addParticipantsToCategory } from "@/data/actions/category-actions";
import { toast } from "sonner";
import useParticipantsStore from "@/store/useParticipantsStore";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  params: {
    id: string;
  };
  categoryId: string;
  dataReload: (r: boolean) => void;
}

export function ParticipantsTable<TData extends { id: Participants }, TValue>({
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

  const handleAddParticipants = () => {
    setUsers(selectedUsers);
    addParticipantsToCategory(
      categoryId,
      selectedUsers.map((user) => user.documentId)
    );
    dataReload(true);
    toast.success("участники добавлены");
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
        return prevSelectedUsers.filter((selected) => selected.id !== user.id);
      } else {
        // Иначе добавляем пользователя в список выбранных
        return [...prevSelectedUsers, user];
      }
    });
  };
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

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
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
        <AddParticipantsForms dataReload={dataReload} />
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
          <Button onClick={handleAddParticipants}>Добавить</Button>
        </div>
      </div>
    </div>
    // <div className="rounded-md border">
    //   <Table>
    //     <TableHeader>
    //       {table.getHeaderGroups().map((headerGroup) => (
    //         <TableRow key={headerGroup.id}>
    //           {headerGroup.headers.map((header) => (
    //             <TableHead key={header.id}>
    //               {header.isPlaceholder
    //                 ? null
    //                 : flexRender(
    //                     header.column.columnDef.header,
    //                     header.getContext()
    //                   )}
    //             </TableHead>
    //           ))}
    //         </TableRow>
    //       ))}
    //     </TableHeader>
    //     <TableBody>
    //       {table.getRowModel().rows?.length ? (
    //         table.getRowModel().rows.map((row) => (
    //           <TableRow
    //             key={row.id}
    //             data-state={
    //               selectedUsers.some((u) => u.id === row.original.id) &&
    //               "selected"
    //             }
    //           >
    //             {/* Добавляем чекбокс для выбора пользователя */}
    //             <TableCell>
    //               <div>
    //                 <input
    //                   type="checkbox"
    //                   checked={selectedUsers.some(
    //                     (u) => u.id === row.original.id
    //                   )}
    //                   onChange={() => handleSelectUser(row.original)}
    //                 />
    //               </div>
    //             </TableCell>
    //             {/* Рендерим остальные данные в ячейках */}
    //             {row.getVisibleCells().map((cell) => (
    //               <TableCell key={cell.id}>
    //                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //               </TableCell>
    //             ))}
    //           </TableRow>
    //         ))
    //       ) : (
    //         <TableRow>
    //           <TableCell colSpan={columns.length} className="h-24 text-center">
    //             No results.
    //           </TableCell>
    //         </TableRow>
    //       )}
    //     </TableBody>
    //     <TableFooter>
    //       <Button onClick={handleAddParticipants}>Добавить</Button>
    //     </TableFooter>
    //   </Table>
    // </div>
  );
}
