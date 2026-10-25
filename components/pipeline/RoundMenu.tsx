"use client"

import { useState } from "react"
import { MoreHorizontalIcon, PlusCircleIcon, XOctagonIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface RoundMenuProps {
  onAddRound: () => void
  onEndRound: () => void
}

/**
 * Three-dot (⋯) context menu for a pipeline round node using Shadcn Popover.
 */
export function RoundMenu({ onAddRound, onEndRound }: RoundMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`rm-trigger ${open ? "rm-trigger--open" : ""}`}
        onClick={(e) => {
          e.stopPropagation()
        }}
        aria-label="Round options"
      >
        <MoreHorizontalIcon size={14} />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-40 p-1.5 rounded-xl border-[1.5px] border-border bg-card shadow-lg flex flex-col gap-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="rm-item rm-item--add"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(false)
            onAddRound()
          }}
        >
          <PlusCircleIcon size={14} />
          Add Round
        </button>

        <div className="rm-divider" />

        <button
          className="rm-item rm-item--end"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(false)
            onEndRound()
          }}
        >
          <XOctagonIcon size={14} />
          End Round
        </button>
      </PopoverContent>
    </Popover>
  )
}
