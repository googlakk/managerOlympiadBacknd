"use client";

import * as React from "react";

import { CATEGORY_PLACES, Participant } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface WinnersProps {
  participant: Participant; // Передаём объект участника
  onSelected: (participant: Participant, place: string | null) => void;
}

export function WinnersCheckDropDown({ participant, onSelected }: WinnersProps) {
  const [position, setPosition] = React.useState<string | null>("");

  const handleValueChange = (value: string | null) => {
    setPosition(value);
    onSelected(participant, value); // Передаём объект участника
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Choose place</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={position ?? ""}
          onValueChange={(value) =>
            handleValueChange(value === "none" ? null : value)
          }
        >
          <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={CATEGORY_PLACES.first}>
            1
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={CATEGORY_PLACES.second}>
            2
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={CATEGORY_PLACES.third}>
            3
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}