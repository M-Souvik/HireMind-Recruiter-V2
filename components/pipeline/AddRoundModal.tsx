"use client"

import { useState } from "react"
import {
  BrainCircuitIcon,
  BotIcon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
  UsersIcon,
  LinkIcon,
  CalendarIcon,
  CheckIcon,
  EyeIcon,
} from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { useGetQuestionList } from "@/queries/assessment"
import { AssessmentQuestionList } from "@/types/pipeline"

// ── Round type options ────────────────────────────────────────────────────────

type RoundTypeOption = {
  id: "ai_screen" | "interview" | "ai_interview" | "assessment"
  label: string
  description: string
  icon: React.ReactNode
  tag: string
  /** whether a joining link field is shown in step 2 */
  hasLink: boolean
}

const ROUND_TYPE_OPTIONS: RoundTypeOption[] = [
  {
    id: "ai_screen",
    label: "AI Screen",
    description:
      "Automated AI-powered screening round. Candidates answer questions via the platform and receive instant AI evaluation.",
    icon: <BrainCircuitIcon size={22} />,
    tag: "Automated",
    hasLink: false,
  },
  {
    id: "interview",
    label: "Interview",
    description:
      "Face-to-face or video interview with a recruiter or panel. Provide a joining link for candidates.",
    icon: <UsersIcon size={22} />,
    tag: "Live",
    hasLink: true,
  },
  {
    id: "ai_interview",
    label: "AI Interview",
    description:
      "AI-conducted interview where candidates respond in real-time. Provide a link to the AI interview session.",
    icon: <BotIcon size={22} />,
    tag: "AI · Live",
    hasLink: true,
  },
  {
    id: "assessment",
    label: "Assessment",
    description:
      "Send candidates a structured test or assignment. Provide a link to the assessment platform.",
    icon: <ClipboardCheckIcon size={22} />,
    tag: "Async",
    hasLink: true,
  },
]

// ── Step 1: Round type selection ──────────────────────────────────────────────

function StepRoundType({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (id: RoundTypeOption["id"]) => void
}) {
  return (
    <div className="ar-step">
      <p className="ar-step-hint">
        Choose the type of round you want to add to the pipeline.
      </p>

      <div className="ar-type-grid">
        {ROUND_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`ar-type-card ${selected === opt.id ? "ar-type-card--selected" : ""}`}
            onClick={() => onSelect(opt.id)}
            aria-pressed={selected === opt.id}
          >
            {/* Selection indicator */}
            <div className="ar-type-check">
              {selected === opt.id && <CheckCircle2Icon size={16} />}
            </div>

            {/* Icon */}
            <div className="ar-type-icon-wrap">{opt.icon}</div>

            {/* Label + tag */}
            <div className="ar-type-label-row">
              <span className="ar-type-label">{opt.label}</span>
              <span className="ar-type-tag">{opt.tag}</span>
            </div>

            {/* Description */}
            <p className="ar-type-desc">{opt.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step 2: Schedule & details ────────────────────────────────────────────────

interface ScheduleFields {
  start_time: string
  end_time: string
  joining_link: string
}

interface AssessmentFields {
  assessment_name: string
  question_paper_id: string
  assessment_duration: string
  assessment_type: string
}

function StepSchedule({
  fields,
  onChange,
  showLink,
}: {
  fields: ScheduleFields
  onChange: (fields: ScheduleFields) => void
  showLink: boolean
}) {
  function set(key: keyof ScheduleFields, value: string) {
    onChange({ ...fields, [key]: value })
  }

  return (
    <div className="ar-step">
      <p className="ar-step-hint">
        Set the schedule for this round. All times are in your local timezone.
      </p>

      <div className="ar-fields">
        {/* Start time */}
        <div className="ar-field">
          <label htmlFor="ar-start" className="ar-field-label">
            <CalendarIcon size={13} />
            Start Time <span className="ar-required">*</span>
          </label>
          <input
            id="ar-start"
            type="datetime-local"
            className="ar-input"
            value={fields.start_time}
            onChange={(e) => set("start_time", e.target.value)}
          />
        </div>

        {/* End time */}
        <div className="ar-field">
          <label htmlFor="ar-end" className="ar-field-label">
            <CalendarIcon size={13} />
            End Time <span className="ar-required">*</span>
          </label>
          <input
            id="ar-end"
            type="datetime-local"
            className="ar-input"
            value={fields.end_time}
            min={fields.start_time || undefined}
            onChange={(e) => set("end_time", e.target.value)}
          />
        </div>

        {/* Joining link — only for interview / ai_interview / assessment */}
        {showLink && (
          <div className="ar-field ar-field--full">
            <label htmlFor="ar-link" className="ar-field-label">
              <LinkIcon size={13} />
              Joining / Assessment Link
            </label>
            <input
              id="ar-link"
              type="url"
              className="ar-input"
              placeholder="https://meet.google.com/abc-xyz or https://platform.com/test/123"
              value={fields.joining_link}
              onChange={(e) => set("joining_link", e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}


function StepAssessment({
  fields,
  onChange,
  // showLink,
}: {
  fields: AssessmentFields
  onChange: (fields: AssessmentFields) => void
  // showLink: boolean
}) {
  function set(key: keyof AssessmentFields, value: string) {
    onChange({ ...fields, [key]: value })
  }

  const { data: questionList, isLoading } = useGetQuestionList()

  return (
    <div className="ar-step">
      <p className="ar-step-hint">
        Assessment details are required for this round. Please provide the necessary information below.
      </p>

      <div className="ar-fields">
        <div className="ar-field">
          <label htmlFor="ar-assessment-name" className="ar-field-label">
            Assessment Name <span className="ar-required">*</span>
          </label>
          <input
            id="ar-assessment-name"
            type="text"
            className="ar-input"
            placeholder="e.g. Senior SDE Assessment"
            value={fields.assessment_name}
            onChange={(e) => set("assessment_name", e.target.value)}
          />
        </div>

        <div className="ar-field">
          <label htmlFor="ar-assessment-duration" className="ar-field-label">
            Duration (minutes) <span className="ar-required">*</span>
          </label>
          <input
            id="ar-assessment-duration"
            type="number"
            min="1"
            step="1"
            className="ar-input"
            placeholder="e.g. 60"
            value={fields.assessment_duration}
            onChange={(e) => set("assessment_duration", e.target.value)}
          />
        </div>
      </div>

      <p className="ar-field-label ar-question-paper-heading">
        Select Question Paper <span className="ar-required">*</span>
      </p>
      <div className="ar-question-papers">
        {isLoading && <p className="ar-question-paper-empty">Loading question papers...</p>}
        {!isLoading && questionList?.data.length === 0 && (
          <p className="ar-question-paper-empty">No question papers available.</p>
        )}
        {questionList?.data.map((question: AssessmentQuestionList) => {
          const isSelected = fields.question_paper_id === question.id

          return (
            <div
              key={question.id}
              onClick={() => set("question_paper_id", question.id)}
              className={`ar-question-paper ${isSelected ? "ar-question-paper--selected" : ""}`}
            >

              <div className="flex items-center gap-2">

                {isSelected ? <CheckIcon size={20} /> : null}

              <div className="ar-question-paper-info">
                <span className="ar-question-paper-name">{question.name}</span>
                <span className="ar-question-paper-meta">
                  {question.total_questions} questions · {question.total_marks} marks
                </span>
              </div>
              </div>
              <button
                type="button"
                className={`ar-question-paper-preview ${isSelected ? "ar-question-paper-preview--selected" : ""}`}
                onClick={() => set("question_paper_id", question.id)}
                aria-pressed={isSelected}
              >
                <EyeIcon size={14} />
                {isSelected ? "Selected" : "Preview"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Step indicator ─────────────────────────────────────────────────────────────

const STEPS = [{
  name: "Round Type",
  description: "Choose a round",
  visible_if: () => true
},
{
  name: "Assessment Details",
  description: "Add questions",
  visible_if: (selectedType: RoundTypeOption["id"] | null) =>
    selectedType === "assessment"
},
{
  name: "Schedule & Details",
  description: "Set date & time",
  visible_if: () => true
}
]

function StepIndicator({
  current,
  selectedStep,
}: {
  current: number
  selectedStep: RoundTypeOption["id"] | null
}) {
  const visibleSteps = STEPS.filter((step) => step.visible_if(selectedStep))

  return (
    <div className="ar-stepper">
      {visibleSteps.map((step, i) => (
        <div key={step.name} className="ar-stepper-item">
          <div className="ar-stepper-node">
            <div
              className={`ar-stepper-dot ${
                i === current
                  ? "ar-stepper-dot--active"
                  : i < current
                    ? "ar-stepper-dot--done"
                    : ""
              }`}
            >
              {i < current ? <CheckCircle2Icon size={12} /> : i + 1}
            </div>
            <div className="ar-stepper-label-group">
              <span
                className={`ar-stepper-label ${i === current ? "ar-stepper-label--active" : ""}`}
              >
                {step.name}
              </span>
              <span className="ar-stepper-description">{step.description}</span>
            </div>
          </div>
          {i < visibleSteps.length - 1 &&(
            <div className="flex w-full">
              <div className="ar-stepper-line" />

            </div>
             )}
        </div>
      ))}
    </div>
  )
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CreateRoundPayload {
  type: RoundTypeOption["id"]
  job: string          // jobId passed from parent
  start_time: string   // ISO datetime string
  end_time: string     // ISO datetime string
  joining_link?: string
  assessment_name?: string
  question_paper_id?: string
  assessment_duration?: string
  assessment_type?: string
  order: number        // rounds.length + 1
}

// ── Add Round Modal ────────────────────────────────────────────────────────────

interface AddRoundModalProps {
  open: boolean
  onClose: () => void
  jobId: string
  currentRoundCount: number
  /** Called with the full payload ready to POST */
  onConfirm: (payload: CreateRoundPayload) => void
}

export function AddRoundModal({
  open,
  onClose,
  jobId,
  currentRoundCount,
  onConfirm,
}: AddRoundModalProps) {
  const [step, setStep] = useState(0)
  const [selectedType, setSelectedType] = useState<RoundTypeOption["id"] | null>(null)
  const [schedule, setSchedule] = useState<ScheduleFields>({
    start_time: "",
    end_time: "",
    joining_link: "",
  })
  const [assessment, setAssessment] = useState<AssessmentFields>({
    assessment_name: "",
    question_paper_id: "",
    assessment_duration: "",
    assessment_type: "scheduled"
  })

  const selectedOption = ROUND_TYPE_OPTIONS.find((o) => o.id === selectedType)
  const showLink = selectedOption?.hasLink ?? false

  const assessmentValid =
    assessment.assessment_name.trim() !== "" &&
    assessment.assessment_duration.trim() !== "" &&
    Number(assessment.assessment_duration) > 0 &&
    assessment.question_paper_id.trim() !== ""

  // Schedule validity: start + end required
  const step2Valid = schedule.start_time.trim() !== "" && schedule.end_time.trim() !== ""

  function handleClose() {
    setStep(0)
    setSelectedType(null)
    setSchedule({ start_time: "", end_time: "", joining_link: "" })
    setAssessment({
      assessment_name: "",
      question_paper_id: "",
      assessment_duration: "",
      assessment_type: "",
    })
    onClose()
  }

  function handleConfirm() {
    if (
      !selectedType ||
      !step2Valid ||
      (selectedType === "assessment" && !assessmentValid)
    ) return

    const payload: CreateRoundPayload = {
      type: selectedType,
      job: jobId,
      // status: "scheduled",
      start_time: new Date(schedule.start_time).toISOString(),
      end_time: new Date(schedule.end_time).toISOString(),
      order: currentRoundCount + 1,
      ...(showLink && schedule.joining_link.trim()
        ? { joining_link: schedule.joining_link.trim() }
        : {}),
      ...(selectedType === "assessment"
        ? {
            assessment_name: assessment.assessment_name.trim(),
            question_paper_id: assessment.question_paper_id,
            assessment_duration: assessment.assessment_duration.trim(),
            assessment_type: assessment.assessment_type.trim(),
          }
        : {}),
    }

    onConfirm(payload)
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add New Round" maxWidth="640px">
      {/* Step indicator */}
      <StepIndicator current={step} selectedStep={selectedType} />

      {/* Step content */}
      {step === 0 && (
        <StepRoundType selected={selectedType} onSelect={setSelectedType} />
      )}
      {step === 1 && (
        selectedType !== "assessment" ? (
        <StepSchedule
          fields={schedule}
          onChange={setSchedule}
          showLink={showLink}
        />
      ):(
        <StepAssessment
          fields={assessment}
          onChange={setAssessment}
          // showLink={showLink}
        />
      )
    )}

    {step === 2 && 
        (
        <StepSchedule
          fields={schedule}
          onChange={setSchedule}
          showLink={showLink}
        />
      
    )}

      {/* Footer actions */}
      <div className="ar-footer">
        <button className="ar-btn ar-btn--ghost" onClick={handleClose}>
          Cancel
        </button>

        <div className="ar-footer-right">
          {step > 0 && (
            <button
              className="ar-btn ar-btn--secondary"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              className="ar-btn ar-btn--primary"
              onClick={() => {
                if (step === 1 && selectedType === "assessment" && !assessmentValid) return
                setStep((s) => s + 1)
              }}
              disabled={
                (step === 0 && !selectedType) ||
                (step === 1 && selectedType === "assessment" && !assessmentValid)
              }
            >
              Next
            </button>
          ) : (
            <button
              className="ar-btn ar-btn--primary"
              onClick={handleConfirm}
              disabled={!step2Valid || (selectedType === "assessment" && !assessmentValid)}
            >
              Add Round
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
