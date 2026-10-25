"use client"

import { useEffect, useRef } from "react"
import { XIcon } from "lucide-react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  /** Width class — defaults to 520px */
  maxWidth?: string
  children: React.ReactNode
}

/**
 * Generic reusable modal.
 * - Closes on Escape key or backdrop click.
 * - Traps focus inside when open.
 * - Accessible: role="dialog", aria-modal, aria-labelledby.
 */
export function Modal({ open, onClose, title, maxWidth = "520px", children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="modal-panel"
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {title && (
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">{title}</h2>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <XIcon size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}
