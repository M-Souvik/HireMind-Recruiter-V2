"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2Icon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface AcceptModalProps {
  candidateName: string
  open: boolean
  onClose: () => void
  onConfirm: (reasoning: string) => void
}

export function AcceptModal({ candidateName, open, onClose, onConfirm }: AcceptModalProps) {
  const [reasoning, setReasoning] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset & focus when opened
  useEffect(() => {
    if (open) {
      setReasoning("")
      setTimeout(() => textareaRef.current?.focus(), 80)
    }
  }, [open])

  function handleConfirm() {
    if (!reasoning.trim()) return
    onConfirm(reasoning.trim())
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
              <CheckCircle2Icon size={18} />
            </div>
            <div>
              <DialogTitle className="text-base leading-tight">Accept Candidate</DialogTitle>
              <DialogDescription className="text-sm mt-0.5">
                You&apos;re accepting <span className="font-semibold text-foreground">{candidateName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-1">
          <label htmlFor="accept-reasoning" className="text-sm font-semibold text-foreground">
            Selection Reasoning <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="accept-reasoning"
            ref={textareaRef}
            className="min-h-[120px] resize-y text-sm"
            placeholder="e.g. Strong Java fundamentals, great problem-solving skills, and the AI score aligns well with our SDE-1 requirements…"
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground text-right">
            {reasoning.trim().length} / 1000
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reasoning.trim()}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          >
            <CheckCircle2Icon size={14} />
            Confirm Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
