"use client";

import { CheckIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Participants } from "@/store/useOlympiadsStore";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const participantsColumns: ColumnDef<Participants>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row, table }) => {
      const user = row.original;
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onChange={() => table.setRowSelection}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: "Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => {
      const birthDate = new Date(row.getValue("age"));
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();

      const monthDifference = today.getMonth() - birthDate.getMonth();
      const dayDifference = today.getDate() - birthDate.getDate();

      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
      }

      return `${age}`;
    },
  },
  {
    accessorKey: "organization",
    header: "Organization",
  },
];
