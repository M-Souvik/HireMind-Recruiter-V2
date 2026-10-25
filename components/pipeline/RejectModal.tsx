"use client"

import { useEffect, useRef, useState } from "react"
import { XCircleIcon } from "lucide-react"

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

interface RejectModalProps {
  candidateName: string
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}

export function RejectModal({ candidateName, open, onClose, onConfirm }: RejectModalProps) {
  const [reason, setReason] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset & focus when opened
  useEffect(() => {
    if (open) {
      setReason("")
      setTimeout(() => textareaRef.current?.focus(), 80)
    }
  }, [open])

  function handleConfirm() {
    if (!reason.trim()) return
    onConfirm(reason.trim())
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 shrink-0">
              <XCircleIcon size={18} />
            </div>
            <div>
              <DialogTitle className="text-base leading-tight">Reject Candidate</DialogTitle>
              <DialogDescription className="text-sm mt-0.5">
                You&apos;re rejecting <span className="font-semibold text-foreground">{candidateName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-1">
          <label htmlFor="reject-reason" className="text-sm font-semibold text-foreground">
            Rejection Reason <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="reject-reason"
            ref={textareaRef}
            className="min-h-[120px] resize-y text-sm"
            placeholder="e.g. Skills don't match the required Java/Spring Boot stack, and the candidate lacks relevant backend testing experience…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground text-right">
            {reason.trim().length} / 1000
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="gap-1.5 bg-red-600 hover:bg-red-700 text-white border-0"
          >
            <XCircleIcon size={14} />
            Confirm Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
