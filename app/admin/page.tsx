"use client";
import { useEffect, useMemo, useState } from "react";
import { site as fallback } from "../../content/site";
import { Markdown } from "../../components/Markdown";

type SectionKey =
  | "hero"
  | "marquee"
  | "services"
  | "process"
  | "beliefs"
  | "clients"
  | "clientLogos"
  | "caseStudies"
  | "about"
  | "book"
  | "contact"
  | "schema"
  | "brand"
  | "settings"
  | "posts"
  | "wireframe"
  | "navigation"
  | "header"
  | "footer";

const HOME_SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "marquee", label: "Capabilities" },
  { key: "services", label: "Services" },
  { key: "process", label: "Process" },
  { key: "beliefs", label: "Beliefs" },
  { key: "clients", label: "Clients (heading)" },
  { key: "clientLogos", label: "Client Logos" },
  { key: "caseStudies", label: "Case Studies" },
  { key: "about", label: "About" },
  { key: "book", label: "Book a Call" },
  { key: "contact", label: "Contact" },
];

// Small UI helpers
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
      {children}
    </label>
  );
}
function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        (props.className || "") +
        " w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-neutral-900"
      }
    />
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        (props.className || "") +
        " w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-5 dark:border-gray-700 dark:bg-neutral-900"
      }
    />
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
    >
      {children}
    </button>
  );
}

// Lightweight toast system
type Toast = {
  id: number;
  kind: "success" | "error" | "info";
  message: string;
};
function Toasts({
  items,
  onClose,
}: {
  items: Toast[];
  onClose: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed top-3 right-3 z-[9999] flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={
            "pointer-events-auto flex items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-md transition " +
            (t.kind === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/50 dark:bg-green-950 dark:text-green-200"
              : t.kind === "error"
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950 dark:text-red-200"
              : "border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-neutral-900 dark:text-gray-100")
          }
          role="status"
          aria-live="polite"
        >
          {t.kind === "success" ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : t.kind === "error" ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6" />
              <path d="M9 9l6 6" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          )}
          <span>{t.message}</span>
          <button
            onClick={() => onClose(t.id)}
            className="ml-1 rounded p-0.5 text-current/60 hover:text-current"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function ImageUpload({
  value,
  onChange,
  buttonLabel = "Upload image",
  accept = "image/*",
}: {
  value?: string;
  onChange: (url: string) => void;
  buttonLabel?: string;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null);
    setBusy(true);
    const fd = new FormData();
    fd.append("file", f);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Upload failed");
      onChange(j.url);
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="file"
        accept={accept}
        onChange={onPick}
        disabled={busy}
        className="text-xs"
      />
      <span className="text-xs text-gray-500">
        {busy ? "Uploading…" : buttonLabel}
      </span>
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-brand-500 underline"
        >
          Preview
        </a>
      )}
      {err && <span className="text-xs text-red-600">{err}</span>}
    </div>
  );
}

// Section editors
function HeroEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });
  const stats: any[] = Array.isArray(v.stats) ? v.stats : [];
  const primaryCta =
    typeof v.primaryCta === "object" && v.primaryCta ? { ...v.primaryCta } : {};
  const secondaryCta =
    typeof v.secondaryCta === "object" && v.secondaryCta
      ? { ...v.secondaryCta }
      : {};
  const updateCta = (
    key: "primaryCta" | "secondaryCta",
    field: "label" | "href" | "target",
    value: string | boolean
  ) => {
    const current =
      typeof v[key] === "object" && v[key] ? { ...(v[key] as any) } : {};
    if (field === "target") {
      if (value) current.target = "_blank";
      else delete current.target;
    } else {
      current[field] = value;
    }
    const cleaned = { ...current };
    if (!cleaned.label && !cleaned.href && !cleaned.target) {
      const next = { ...v };
      delete next[key];
      onChange(next);
    } else {
      onChange({ ...v, [key]: cleaned });
    }
  };
  return (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput
          value={v.title || ""}
          onChange={(e) => up("title", e.target.value)}
        />
      </Field>
      <Field label="Subhead">
        <TextInput
          value={v.subhead || ""}
          onChange={(e) => up("subhead", e.target.value)}
        />
      </Field>
      <Field label="Body">
        <Textarea
          rows={4}
          value={v.body || ""}
          onChange={(e) => up("body", e.target.value)}
        />
      </Field>
      <div>
        <Field label="Hero image URL">
          <TextInput
            value={v.image || ""}
            onChange={(e) => up("image", e.target.value)}
          />
        </Field>
        <div className="mt-1">
          <ImageUpload
            value={v.image}
            onChange={(url) => up("image", url)}
            buttonLabel="Upload hero image"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Stats</Label>
        {stats.map((s, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <TextInput
              placeholder="Value"
              value={s.value || ""}
              onChange={(e) => {
                const arr = [...stats];
                arr[i] = { ...arr[i], value: e.target.value };
                up("stats", arr);
              }}
            />
            <TextInput
              placeholder="Label"
              value={s.label || ""}
              onChange={(e) => {
                const arr = [...stats];
                arr[i] = { ...arr[i], label: e.target.value };
                up("stats", arr);
              }}
            />
            <div className="col-span-2 flex justify-end">
              <IconButton
                title="Remove"
                onClick={() => {
                  const arr = stats.filter((_, idx) => idx !== i);
                  up("stats", arr);
                }}
              >
                Remove
              </IconButton>
            </div>
          </div>
        ))}
        <IconButton
          title="Add"
          onClick={() => up("stats", [...stats, { value: "", label: "" }])}
        >
          Add stat
        </IconButton>
      </div>
      <div className="space-y-3">
        <div className="text-sm font-medium">Primary button</div>
        <Field label="Text">
          <TextInput
            value={primaryCta.label || ""}
            onChange={(e) => updateCta("primaryCta", "label", e.target.value)}
            placeholder="Book a call"
          />
        </Field>
        <Field label="URL">
          <TextInput
            value={primaryCta.href || ""}
            onChange={(e) => updateCta("primaryCta", "href", e.target.value)}
            placeholder="https://..."
          />
        </Field>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={primaryCta.target === "_blank"}
            onChange={(e) =>
              updateCta("primaryCta", "target", e.target.checked)
            }
          />
          Open in new tab
        </label>
      </div>
      <div className="space-y-3">
        <div className="text-sm font-medium">Secondary button</div>
        <Field label="Text">
          <TextInput
            value={secondaryCta.label || ""}
            onChange={(e) => updateCta("secondaryCta", "label", e.target.value)}
            placeholder="See case studies"
          />
        </Field>
        <Field label="URL">
          <TextInput
            value={secondaryCta.href || ""}
            onChange={(e) => updateCta("secondaryCta", "href", e.target.value)}
            placeholder="#case-studies"
          />
        </Field>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={secondaryCta.target === "_blank"}
            onChange={(e) =>
              updateCta("secondaryCta", "target", e.target.checked)
            }
          />
          Open in new tab
        </label>
      </div>
    </div>
  );
}

function BookEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });
  const paragraphs: string[] = Array.isArray(v.paragraphs) ? v.paragraphs : [];
  const primaryCta =
    typeof v.primaryCta === "object" && v.primaryCta ? { ...v.primaryCta } : {};
  const secondaryCta =
    typeof v.secondaryCta === "object" && v.secondaryCta
      ? { ...v.secondaryCta }
      : {};
  const tertiaryCta =
    typeof v.tertiaryCta === "object" && v.tertiaryCta
      ? { ...v.tertiaryCta }
      : {};

  const updateCta = (
    key: "primaryCta" | "secondaryCta" | "tertiaryCta",
    field: "label" | "href" | "target",
    val: string | boolean
  ) => {
    const current =
      typeof v[key] === "object" && v[key] ? { ...(v[key] as any) } : {};
    if (field === "target") {
      if (val) current.target = "_blank";
      else delete current.target;
    } else {
      current[field] = val;
    }
    const cleaned = { ...current };
    if (!cleaned.label && !cleaned.href && !cleaned.target) {
      const next = { ...v };
      delete next[key];
      onChange(next);
    } else {
      onChange({ ...v, [key]: cleaned });
    }
  };

  return (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput
          value={v.title || ""}
          onChange={(e) => up("title", e.target.value)}
        />
      </Field>
      <div>
        <Label>Paragraphs</Label>
        <StringListEditor
          value={paragraphs}
          onChange={(arr) => up("paragraphs", arr)}
          placeholder="Paragraph"
        />
      </div>
      <div className="space-y-3">
        <div className="text-sm font-medium">Primary button</div>
        <Field label="Text">
          <TextInput
            value={primaryCta.label || ""}
            onChange={(e) => updateCta("primaryCta", "label", e.target.value)}
            placeholder="Book a call"
          />
        </Field>
        <Field label="URL">
          <TextInput
            value={primaryCta.href || ""}
            onChange={(e) => updateCta("primaryCta", "href", e.target.value)}
            placeholder="https://..."
          />
        </Field>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={primaryCta.target === "_blank"}
            onChange={(e) =>
              updateCta("primaryCta", "target", e.target.checked)
            }
          />
          Open in new tab
        </label>
      </div>
      <div className="space-y-3">
        <div className="text-sm font-medium">Secondary button</div>
        <Field label="Text">
          <TextInput
            value={secondaryCta.label || ""}
            onChange={(e) => updateCta("secondaryCta", "label", e.target.value)}
            placeholder="See case studies"
          />
        </Field>
        <Field label="URL">
          <TextInput
            value={secondaryCta.href || ""}
            onChange={(e) => updateCta("secondaryCta", "href", e.target.value)}
            placeholder="#case-studies"
          />
        </Field>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={secondaryCta.target === "_blank"}
            onChange={(e) =>
              updateCta("secondaryCta", "target", e.target.checked)
            }
          />
          Open in new tab
        </label>
      </div>
      <div className="space-y-3">
        <div className="text-sm font-medium">Contact button</div>
        <Field label="Text">
          <TextInput
            value={tertiaryCta.label || ""}
            onChange={(e) => updateCta("tertiaryCta", "label", e.target.value)}
            placeholder="Go to contact form"
          />
        </Field>
        <Field label="URL">
          <TextInput
            value={tertiaryCta.href || ""}
            onChange={(e) => updateCta("tertiaryCta", "href", e.target.value)}
            placeholder="#contact"
          />
        </Field>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={tertiaryCta.target === "_blank"}
            onChange={(e) =>
              updateCta("tertiaryCta", "target", e.target.checked)
            }
          />
          Open in new tab
        </label>
      </div>
    </div>
  );
}

function StringListEditor({
  value,
  onChange,
  placeholder = "Item",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2">
      {list.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextInput
            value={s}
            placeholder={placeholder}
            onChange={(e) => {
              const arr = [...list];
              arr[i] = e.target.value;
              onChange(arr);
            }}
          />
          <IconButton
            title="Remove"
            onClick={() => onChange(list.filter((_, idx) => idx !== i))}
          >
            Remove
          </IconButton>
        </div>
      ))}
      <IconButton title="Add" onClick={() => onChange([...list, ""])}>
        Add
      </IconButton>
    </div>
  );
}

function PillsEditor({
  value,
  onChange,
  placeholder = "Add item",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const list = Array.isArray(value) ? value : [];
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...list, t]);
    setDraft("");
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
  };
  const onBlur = () => add();
  const removeAt = (idx: number) => onChange(list.filter((_, i) => i !== idx));
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {list.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs dark:border-gray-700 dark:bg-neutral-900"
          >
            <span>{s}</span>
            <button
              type="button"
              aria-label="Remove"
              onClick={() => removeAt(i)}
              className="rounded-full p-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <TextInput
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
        <IconButton title="Add" onClick={add}>
          Add
        </IconButton>
      </div>
    </div>
  );
}

function ReorderablePillsEditor({
  value,
  onChange,
  placeholder = "Add item",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const list = Array.isArray(value) ? value : [];
  const [draft, setDraft] = useState("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...list, t]);
    setDraft("");
  };
  const removeAt = (idx: number) => onChange(list.filter((_, i) => i !== idx));

  const onDragStart = (idx: number, e: React.DragEvent) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch {}
  };
  const onDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (overIdx !== idx) setOverIdx(idx);
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIdx ?? Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    setDragIdx(null);
    setOverIdx(null);
    if (Number.isFinite(from) && Number.isFinite(to) && from !== to) {
      const next = [...list];
      const [moved] = next.splice(from as number, 1);
      next.splice(to, 0, moved);
      onChange(next);
    }
  };
  const onDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {list.map((s, i) => {
          const active = overIdx === i;
          return (
            <span
              key={i}
              draggable
              onDragStart={(e) => onDragStart(i, e)}
              onDragOver={(e) => onDragOver(i, e)}
              onDrop={(e) => onDrop(i, e)}
              onDragEnd={onDragEnd}
              className={
                "inline-flex cursor-move items-center gap-2 rounded-full border px-3 py-1 text-xs transition " +
                (active
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-gray-300 bg-white dark:border-gray-700 dark:bg-neutral-900")
              }
              title="Drag to reorder"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M8 6h.01M12 6h.01M16 6h.01M8 12h.01M12 12h.01M16 12h.01M8 18h.01M12 18h.01M16 18h.01" />
              </svg>
              <span>{s}</span>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => removeAt(i)}
                className="rounded-full p-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <TextInput
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <IconButton title="Add" onClick={add}>
          Add
        </IconButton>
      </div>
    </div>
  );
}

function ServicesEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });
  const items: any[] = Array.isArray(v.items) ? v.items : [];
  const sectionCta = typeof v.cta === "object" && v.cta ? { ...v.cta } : {};
  const updateSectionCta = (
    field: "label" | "href" | "target",
    val: string | boolean
  ) => {
    const current =
      typeof v.cta === "object" && v.cta ? { ...(v.cta as any) } : {};
    if (field === "target") {
      if (val) current.target = "_blank";
      else delete current.target;
    } else {
      current[field] = val;
    }
    const cleaned = { ...current };
    if (!cleaned.label && !cleaned.href && !cleaned.target) {
      const next = { ...v };
      delete next.cta;
      onChange(next);
    } else {
      onChange({ ...v, cta: cleaned });
    }
  };
  const cta = typeof v.cta === "object" && v.cta ? { ...v.cta } : {};
  const updateCta = (
    field: "label" | "href" | "target",
    val: string | boolean
  ) => {
    const current =
      typeof v.cta === "object" && v.cta ? { ...(v.cta as any) } : {};
    if (field === "target") {
      if (val) current.target = "_blank";
      else delete current.target;
    } else {
      current[field] = val;
    }
    const cleaned = { ...current };
    if (!cleaned.label && !cleaned.href && !cleaned.target) {
      const next = { ...v };
      delete next.cta;
      onChange(next);
    } else {
      onChange({ ...v, cta: cleaned });
    }
  };
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const onDragStart = (idx: number, e: React.DragEvent) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch {}
  };
  const onDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (overIdx !== idx) setOverIdx(idx);
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIdx ?? Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    setDragIdx(null);
    setOverIdx(null);
    if (Number.isFinite(from) && Number.isFinite(to) && from !== to) {
      const next = [...items];
      const [moved] = next.splice(from as number, 1);
      next.splice(to, 0, moved);
      up("items", next);
    }
  };
  const onDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };
  return (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput
          value={v.title || ""}
          onChange={(e) => up("title", e.target.value)}
        />
      </Field>
      <Field label="Subtitle">
        <Textarea
          rows={3}
          value={v.subtitle || ""}
          onChange={(e) => up("subtitle", e.target.value)}
        />
      </Field>
      <Field label="Note">
        <Textarea
          rows={2}
          value={v.note || ""}
          onChange={(e) => up("note", e.target.value)}
        />
      </Field>
      <div className="space-y-3">
        <div className="text-sm font-medium">Call-to-action button</div>
        <Field label="Text">
          <TextInput
            value={cta.label || ""}
            onChange={(e) => updateCta("label", e.target.value)}
            placeholder="Book a call"
          />
        </Field>
        <Field label="URL">
          <TextInput
            value={cta.href || ""}
            onChange={(e) => updateCta("href", e.target.value)}
            placeholder="https://..."
          />
        </Field>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={cta.target === "_blank"}
            onChange={(e) => updateCta("target", e.target.checked)}
          />
          Open in new tab
        </label>
      </div>
      <div className="space-y-2">
        <Label>Items</Label>
        {items.map((it, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => onDragStart(i, e)}
            onDragOver={(e) => onDragOver(i, e)}
            onDrop={(e) => onDrop(i, e)}
            onDragEnd={onDragEnd}
            className={
              (overIdx === i ? "border-brand-500 bg-brand-500/5 " : "") +
              "grid grid-cols-2 gap-2 rounded-md border border-gray-200 p-2 dark:border-gray-800"
            }
          >
            <div className="col-span-2 -mb-1 flex items-center gap-2 text-xs text-gray-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M8 6h.01M12 6h.01M16 6h.01M8 12h.01M12 12h.01M16 12h.01M8 18h.01M12 18h.01M16 18h.01" />
              </svg>
              Drag to reorder
            </div>
            <TextInput
              placeholder="Title"
              value={it.title || ""}
              onChange={(e) => {
                const arr = [...items];
                arr[i] = { ...arr[i], title: e.target.value };
                up("items", arr);
              }}
            />
            <TextInput
              placeholder="Icon (optional)"
              value={it.icon || ""}
              onChange={(e) => {
                const arr = [...items];
                arr[i] = { ...arr[i], icon: e.target.value };
                up("items", arr);
              }}
            />
            <div className="col-span-2">
              <Textarea
                placeholder="Description"
                rows={2}
                value={it.description || ""}
                onChange={(e) => {
                  const arr = [...items];
                  arr[i] = { ...arr[i], description: e.target.value };
                  up("items", arr);
                }}
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <IconButton
                title="Remove"
                onClick={() =>
                  up(
                    "items",
                    items.filter((_, idx) => idx !== i)
                  )
                }
              >
                Remove
              </IconButton>
            </div>
          </div>
        ))}
        <IconButton
          title="Add"
          onClick={() =>
            up("items", [...items, { title: "", description: "" }])
          }
        >
          Add item
        </IconButton>
      </div>
    </div>
  );
}

function ProcessEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });
  const steps: any[] = Array.isArray(v.steps) ? v.steps : [];
  const sectionCta = typeof v.cta === "object" && v.cta ? { ...v.cta } : {};
  const updateSectionCta = (
    field: "label" | "href" | "target",
    val: string | boolean
  ) => {
    const current =
      typeof v.cta === "object" && v.cta ? { ...(v.cta as any) } : {};
    if (field === "target") {
      if (val) current.target = "_blank";
      else delete current.target;
    } else {
      current[field] = val;
    }
    const cleaned = { ...current };
    if (!cleaned.label && !cleaned.href && !cleaned.target) {
      const next = { ...v };
      delete next.cta;
      onChange(next);
    } else {
      onChange({ ...v, cta: cleaned });
    }
  };
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const onDragStart = (idx: number, e: React.DragEvent) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch {}
  };
  const onDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (overIdx !== idx) setOverIdx(idx);
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIdx ?? Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    setDragIdx(null);
    setOverIdx(null);
    if (Number.isFinite(from) && Number.isFinite(to) && from !== to) {
      const next = [...steps];
      const [moved] = next.splice(from as number, 1);
      next.splice(to, 0, moved);
      up("steps", next);
    }
  };
  const onDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };
  return (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput
          value={v.title || ""}
          onChange={(e) => up("title", e.target.value)}
        />
      </Field>
      <Field label="Intro">
        <Textarea
          rows={3}
          value={v.intro || ""}
          onChange={(e) => up("intro", e.target.value)}
        />
      </Field>
      <div className="space-y-3">
        <div className="text-sm font-medium">Secondary button</div>
        <Field label="Text">
          <TextInput
            value={sectionCta.label || ""}
            onChange={(e) => updateSectionCta("label", e.target.value)}
            placeholder="Work with us"
          />
        </Field>
        <Field label="URL">
          <TextInput
            value={sectionCta.href || ""}
            onChange={(e) => updateSectionCta("href", e.target.value)}
            placeholder="#contact"
          />
        </Field>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={sectionCta.target === "_blank"}
            onChange={(e) => updateSectionCta("target", e.target.checked)}
          />
          Open in new tab
        </label>
      </div>
      <div className="space-y-2">
        <Label>Steps</Label>
        {steps.map((st, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => onDragStart(i, e)}
            onDragOver={(e) => onDragOver(i, e)}
            onDrop={(e) => onDrop(i, e)}
            onDragEnd={onDragEnd}
            className={
              (overIdx === i ? "border-brand-500 bg-brand-500/5 " : "") +
              "grid grid-cols-2 gap-2 rounded-md border border-gray-200 p-2 dark:border-gray-800"
            }
          >
            <div className="col-span-2 -mb-1 flex items-center gap-2 text-xs text-gray-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M8 6h.01M12 6h.01M16 6h.01M8 12h.01M12 12h.01M16 12h.01M8 18h.01M12 18h.01M16 18h.01" />
              </svg>
              Drag to reorder
            </div>
            <TextInput
              placeholder="Title"
              value={st.title || ""}
              onChange={(e) => {
                const arr = [...steps];
                arr[i] = { ...arr[i], title: e.target.value };
                up("steps", arr);
              }}
            />
            <div className="col-span-2">
              <Textarea
                placeholder="Description"
                rows={2}
                value={st.description || ""}
                onChange={(e) => {
                  const arr = [...steps];
                  arr[i] = { ...arr[i], description: e.target.value };
                  up("steps", arr);
                }}
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <IconButton
                title="Remove"
                onClick={() =>
                  up(
                    "steps",
                    steps.filter((_, idx) => idx !== i)
                  )
                }
              >
                Remove
              </IconButton>
            </div>
          </div>
        ))}
        <IconButton
          title="Add"
          onClick={() =>
            up("steps", [...steps, { title: "", description: "" }])
          }
        >
          Add step
        </IconButton>
      </div>
    </div>
  );
}

function BeliefsEditor({
  value,
  onChange,
}: {
  value: any[];
  onChange: (v: any[]) => void;
}) {
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2">
      {list.map((b, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <TextInput
            placeholder="Title"
            value={b.title || ""}
            onChange={(e) => {
              const arr = [...list];
              arr[i] = { ...arr[i], title: e.target.value };
              onChange(arr);
            }}
          />
          <div className="col-span-2">
            <Textarea
              placeholder="Quote"
              rows={2}
              value={b.quote || ""}
              onChange={(e) => {
                const arr = [...list];
                arr[i] = { ...arr[i], quote: e.target.value };
                onChange(arr);
              }}
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <IconButton
              title="Remove"
              onClick={() => onChange(list.filter((_, idx) => idx !== i))}
            >
              Remove
            </IconButton>
          </div>
        </div>
      ))}
      <IconButton
        title="Add"
        onClick={() => onChange([...(list || []), { title: "", quote: "" }])}
      >
        Add belief
      </IconButton>
    </div>
  );
}

function ClientLogosEditor({
  value,
  onChange,
}: {
  value: any[];
  onChange: (v: any[]) => void;
}) {
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-3">
      {list.map((logo, i) => (
        <div key={i} className="grid grid-cols-3 items-start gap-2">
          <div className="col-span-2">
            <Field label="Image URL">
              <TextInput
                value={logo.src || ""}
                onChange={(e) => {
                  const arr = [...list];
                  arr[i] = { ...arr[i], src: e.target.value };
                  onChange(arr);
                }}
              />
            </Field>
            <div className="mt-1">
              <ImageUpload
                value={logo.src}
                onChange={(url) => {
                  const arr = [...list];
                  arr[i] = { ...arr[i], src: url };
                  onChange(arr);
                }}
              />
            </div>
          </div>
          <Field label="Alt text">
            <TextInput
              value={logo.alt || ""}
              onChange={(e) => {
                const arr = [...list];
                arr[i] = { ...arr[i], alt: e.target.value };
                onChange(arr);
              }}
            />
          </Field>
          <div className="col-span-3 flex justify-end">
            <IconButton
              title="Remove"
              onClick={() => onChange(list.filter((_, idx) => idx !== i))}
            >
              Remove
            </IconButton>
          </div>
        </div>
      ))}
      <IconButton
        title="Add"
        onClick={() => onChange([...(list || []), { src: "", alt: "" }])}
      >
        Add logo
      </IconButton>
    </div>
  );
}

function CaseStudiesEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });
  const items: any[] = Array.isArray(v.items) ? v.items : [];
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const onDragStart = (idx: number, e: React.DragEvent) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch {}
  };
  const onDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (overIdx !== idx) setOverIdx(idx);
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIdx ?? Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    setDragIdx(null);
    setOverIdx(null);
    if (Number.isFinite(from) && Number.isFinite(to) && from !== to) {
      const next = [...items];
      const [moved] = next.splice(from as number, 1);
      next.splice(to, 0, moved);
      up("items", next);
    }
  };
  const onDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };
  return (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput
          value={v.title || ""}
          onChange={(e) => up("title", e.target.value)}
        />
      </Field>
      <Field label="Intro">
        <Textarea
          rows={3}
          value={v.intro || ""}
          onChange={(e) => up("intro", e.target.value)}
        />
      </Field>
      <div className="space-y-2">
        <Label>Items</Label>
        {items.map((it, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => onDragStart(i, e)}
            onDragOver={(e) => onDragOver(i, e)}
            onDrop={(e) => onDrop(i, e)}
            onDragEnd={onDragEnd}
            className={
              (overIdx === i ? "border-brand-500 bg-brand-500/5 " : "") +
              "space-y-2 rounded-md border border-gray-200 p-3 dark:border-gray-800"
            }
          >
            <div className="-mb-1 flex items-center gap-2 text-xs text-gray-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M8 6h.01M12 6h.01M16 6h.01M8 12h.01M12 12h.01M16 12h.01M8 18h.01M12 18h.01M16 18h.01" />
              </svg>
              Drag to reorder
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TextInput
                placeholder="Slug"
                value={it.slug || ""}
                onChange={(e) => {
                  const arr = [...items];
                  arr[i] = { ...arr[i], slug: e.target.value };
                  up("items", arr);
                }}
              />
              <TextInput
                placeholder="Title"
                value={it.title || ""}
                onChange={(e) => {
                  const arr = [...items];
                  arr[i] = { ...arr[i], title: e.target.value };
                  up("items", arr);
                }}
              />
              <TextInput
                placeholder="Category"
                value={it.category || ""}
                onChange={(e) => {
                  const arr = [...items];
                  arr[i] = { ...arr[i], category: e.target.value };
                  up("items", arr);
                }}
              />
              <TextInput
                placeholder="Link"
                value={it.link || ""}
                onChange={(e) => {
                  const arr = [...items];
                  arr[i] = { ...arr[i], link: e.target.value };
                  up("items", arr);
                }}
              />
              <TextInput
                placeholder="Button label"
                value={it.linkLabel || ""}
                onChange={(e) => {
                  const arr = [...items];
                  arr[i] = { ...arr[i], linkLabel: e.target.value };
                  up("items", arr);
                }}
              />
              <div className="col-span-2">
                <Textarea
                  placeholder="Summary"
                  rows={2}
                  value={it.summary || ""}
                  onChange={(e) => {
                    const arr = [...items];
                    arr[i] = { ...arr[i], summary: e.target.value };
                    up("items", arr);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Field label="Image URL">
                  <TextInput
                    value={it.image || ""}
                    onChange={(e) => {
                      const arr = [...items];
                      arr[i] = { ...arr[i], image: e.target.value };
                      up("items", arr);
                    }}
                  />
                </Field>
                <div className="mt-1">
                  <ImageUpload
                    value={it.image}
                    onChange={(url) => {
                      const arr = [...items];
                      arr[i] = { ...arr[i], image: url };
                      up("items", arr);
                    }}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Label>Results</Label>
                <PillsEditor
                  value={Array.isArray(it.results) ? it.results : []}
                  onChange={(vals) => {
                    const arr = [...items];
                    arr[i] = { ...arr[i], results: vals };
                    up("items", arr);
                  }}
                  placeholder="Add result"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <IconButton
                title="Remove"
                onClick={() =>
                  up(
                    "items",
                    items.filter((_, idx) => idx !== i)
                  )
                }
              >
                Remove
              </IconButton>
            </div>
          </div>
        ))}
        <IconButton
          title="Add"
          onClick={() =>
            up("items", [
              ...items,
              {
                slug: "",
                title: "",
                category: "",
                summary: "",
                image: "",
                results: [],
                link: "",
              },
            ])
          }
        >
          Add item
        </IconButton>
      </div>
    </div>
  );
}

function AboutEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });
  const highlights: string[] = Array.isArray(v.highlights) ? v.highlights : [];
  const clients: string[] = Array.isArray(v.clients) ? v.clients : [];
  return (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput
          value={v.title || ""}
          onChange={(e) => up("title", e.target.value)}
        />
      </Field>
      <Field label="Body">
        <Textarea
          rows={3}
          value={v.body || ""}
          onChange={(e) => up("body", e.target.value)}
        />
      </Field>
      <div>
        <Label>Highlights</Label>
        <StringListEditor
          value={highlights}
          onChange={(arr) => up("highlights", arr)}
          placeholder="Highlight"
        />
      </div>
      <div>
        <Label>Clients</Label>
        <StringListEditor
          value={clients}
          onChange={(arr) => up("clients", arr)}
          placeholder="Client"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="CEO Name">
          <TextInput
            value={v.ceoName || ""}
            onChange={(e) => up("ceoName", e.target.value)}
          />
        </Field>
        <Field label="CEO Title">
          <TextInput
            value={v.ceoTitle || ""}
            onChange={(e) => up("ceoTitle", e.target.value)}
          />
        </Field>
        <div className="col-span-2">
          <Field label="CEO Note">
            <Textarea
              rows={3}
              value={v.ceoNote || ""}
              onChange={(e) => up("ceoNote", e.target.value)}
            />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Photo URL">
            <TextInput
              value={v.photo || ""}
              onChange={(e) => up("photo", e.target.value)}
            />
          </Field>
          <div className="mt-1">
            <ImageUpload value={v.photo} onChange={(url) => up("photo", url)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });
  const socials: any[] = Array.isArray(v.socials) ? v.socials : [];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Email">
          <TextInput
            value={v.email || ""}
            onChange={(e) => up("email", e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <TextInput
            value={v.phone || ""}
            onChange={(e) => up("phone", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Location">
        <TextInput
          value={v.location || ""}
          onChange={(e) => up("location", e.target.value)}
        />
      </Field>
      <div className="space-y-2">
        <Label>Socials</Label>
        {socials.map((s, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <TextInput
              placeholder="Label"
              value={s.label || ""}
              onChange={(e) => {
                const arr = [...socials];
                arr[i] = { ...arr[i], label: e.target.value };
                up("socials", arr);
              }}
            />
            <TextInput
              placeholder="URL"
              value={s.href || ""}
              onChange={(e) => {
                const arr = [...socials];
                arr[i] = { ...arr[i], href: e.target.value };
                up("socials", arr);
              }}
            />
            <div className="col-span-2 flex justify-end">
              <IconButton
                title="Remove"
                onClick={() =>
                  up(
                    "socials",
                    socials.filter((_, idx) => idx !== i)
                  )
                }
              >
                Remove
              </IconButton>
            </div>
          </div>
        ))}
        <IconButton
          title="Add"
          onClick={() => up("socials", [...socials, { label: "", href: "" }])}
        >
          Add social
        </IconButton>
      </div>
    </div>
  );
}

function BrandEditor({
  value,
  onChange,
  fallback,
}: {
  value: any;
  onChange: (v: any) => void;
  fallback?: any;
}) {
  const current = value || {};
  const fallbackData = fallback || {};

  const DEFAULT_HEADING_FONT =
    'var(--font-heading-default), "Montserrat", sans-serif';
  const DEFAULT_BODY_FONT = 'var(--font-body-default), "Open Sans", sans-serif';

  const legacyFont =
    typeof current.fontFamily === "string"
      ? current.fontFamily
      : typeof fallbackData.fontFamily === "string"
      ? fallbackData.fontFamily
      : "";

  const setValue = (key: string, val: any) => {
    const next = { ...current };
    if (val === "" || val === null || typeof val === "undefined") {
      delete next[key];
    } else {
      next[key] = val;
    }
    if ("fontFamily" in next) delete next.fontFamily;
    onChange(next);
  };

  const effectiveLogo =
    (typeof current.logoUrl === "string" && current.logoUrl) ||
    (typeof fallbackData.logoUrl === "string" ? fallbackData.logoUrl : "");

  const brandColorForInputs =
    (typeof current.brandColor === "string" && current.brandColor) ||
    (typeof fallbackData.brandColor === "string"
      ? fallbackData.brandColor
      : "#C62828");

  const buttonOverride =
    typeof current.primaryButtonColor === "string"
      ? current.primaryButtonColor
      : "";
  const effectiveButtonColor = buttonOverride || brandColorForInputs;

  const headingOverride =
    typeof current.headingFontFamily === "string"
      ? current.headingFontFamily
      : "";
  const bodyOverride =
    typeof current.bodyFontFamily === "string" ? current.bodyFontFamily : "";

  const fallbackHeading =
    typeof fallbackData.headingFontFamily === "string"
      ? fallbackData.headingFontFamily
      : legacyFont;
  const fallbackBody =
    typeof fallbackData.bodyFontFamily === "string"
      ? fallbackData.bodyFontFamily
      : legacyFont;

  const displayHeadingFont =
    headingOverride || fallbackHeading || DEFAULT_HEADING_FONT;
  const displayBodyFont = bodyOverride || fallbackBody || DEFAULT_BODY_FONT;

  const headingSelection = (headingOverride || fallbackHeading || "").trim();
  const bodySelection = (bodyOverride || fallbackBody || "").trim();

  const colorPresets = [
    {
      name: "Crimson (Default)",
      value: "#C62828",
      description: "Bold crimson default — energetic and confident",
    },
    {
      name: "Blue",
      value: "#3b82f6",
      description: "Professional blue - trusted and reliable",
    },
    {
      name: "Green",
      value: "#10b981",
      description: "Fresh green - perfect for eco/health brands",
    },
    {
      name: "Purple",
      value: "#8b5cf6",
      description: "Modern purple - tech and innovation focused",
    },
    {
      name: "Red",
      value: "#ef4444",
      description: "Bold red - high energy and attention-grabbing",
    },
    {
      name: "Teal",
      value: "#14b8a6",
      description: "Sophisticated teal - modern and professional",
    },
    {
      name: "Pink",
      value: "#ec4899",
      description: "Creative pink - design and lifestyle brands",
    },
    {
      name: "Indigo",
      value: "#6366f1",
      description: "Deep indigo - premium and trustworthy",
    },
  ];

  const headingFontPresets = [
    {
      name: "Default (Montserrat)",
      value: "",
      description: "Use the built-in Montserrat heading font",
    },
    {
      name: "Playfair Display",
      value: "'Playfair Display', 'Times New Roman', serif",
      description: "Elegant serif for editorial headlines",
    },
    {
      name: "Inter",
      value:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      description: "Clean geometric sans-serif",
    },
    {
      name: "Poppins",
      value: "'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      description: "Rounded sans-serif with personality",
    },
    {
      name: "DM Sans",
      value: "'DM Sans', 'Segoe UI', sans-serif",
      description: "Friendly sans-serif with generous spacing",
    },
  ];

  const bodyFontPresets = [
    {
      name: "Default (Open Sans)",
      value: "",
      description: "Use the built-in Open Sans body font",
    },
    {
      name: "Inter",
      value:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      description: "Highly readable for UI copy",
    },
    {
      name: "Source Sans Pro",
      value: "'Source Sans Pro', 'Segoe UI', sans-serif",
      description: "Humanist sans-serif designed for legibility",
    },
    {
      name: "Roboto",
      value: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      description: "Versatile workhorse sans-serif",
    },
    {
      name: "System UI",
      value:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      description: "Match the visitor's operating system font",
    },
  ];

  const isBrandPresetActive = (hex: string) =>
    (brandColorForInputs || "").toLowerCase() === hex.toLowerCase();

  return (
    <div className="space-y-4">
      <div>
        <Field label="Site logo URL">
          <TextInput
            value={
              typeof current.logoUrl === "string"
                ? current.logoUrl
                : effectiveLogo
            }
            onChange={(e) => setValue("logoUrl", e.target.value)}
          />
        </Field>
        <div className="mt-1">
          <ImageUpload
            value={
              typeof current.logoUrl === "string"
                ? current.logoUrl
                : effectiveLogo
            }
            onChange={(url) => setValue("logoUrl", url)}
            buttonLabel="Upload logo"
          />
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          The logo appears in the header and mobile navigation.
        </div>
      </div>

      <hr className="my-4 border-gray-200 dark:border-gray-800" />

      <div className="space-y-3">
        <div className="text-sm font-medium">Brand Colors</div>
        <Field label="Primary Brand Color">
          <div className="flex items-center gap-2">
            <TextInput
              type="color"
              value={brandColorForInputs}
              onChange={(e) => setValue("brandColor", e.target.value)}
              className="max-w-20 h-10 cursor-pointer"
            />
            <TextInput
              value={brandColorForInputs}
              onChange={(e) => setValue("brandColor", e.target.value)}
              placeholder="#C62828"
              className="flex-1"
            />
            <IconButton
              title="Reset to default"
              onClick={() => setValue("brandColor", "")}
            >
              Reset
            </IconButton>
          </div>
        </Field>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          This color powers accent borders, badges, and other brand elements.
        </div>

        <Field label="Primary Button Color (optional)">
          <div className="flex flex-wrap items-center gap-2">
            <TextInput
              type="color"
              value={effectiveButtonColor}
              onChange={(e) => setValue("primaryButtonColor", e.target.value)}
              className="max-w-20 h-10 cursor-pointer"
            />
            <TextInput
              value={buttonOverride}
              onChange={(e) => setValue("primaryButtonColor", e.target.value)}
              placeholder="#hex — leave blank to match brand color"
              className="flex-1"
            />
            <IconButton
              title="Use brand color"
              onClick={() => setValue("primaryButtonColor", "")}
            >
              Use brand color
            </IconButton>
          </div>
        </Field>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          Buttons fall back to the primary brand color when no override is set.
        </div>

        <div>
          <Label>Color Presets</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setValue("brandColor", preset.value)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition hover:bg-gray-50 dark:hover:bg-white/5 ${
                  isBrandPresetActive(preset.value)
                    ? "border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-white/5"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
                  style={{ backgroundColor: preset.value }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {preset.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-200 dark:border-gray-800" />

      <div className="space-y-3">
        <div className="text-sm font-medium">Typography</div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Field label="Heading font stack">
              <TextInput
                value={headingOverride}
                onChange={(e) => setValue("headingFontFamily", e.target.value)}
                placeholder={
                  'Default: var(--font-heading-default), "Montserrat", sans-serif'
                }
              />
            </Field>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Leave blank to continue using Montserrat for headings.
            </div>
            <div className="grid grid-cols-1 gap-2">
              {headingFontPresets.map((preset) => {
                const presetValue = (preset.value || "").trim();
                const active = headingSelection === presetValue;
                return (
                  <button
                    key={`${preset.name}-heading`}
                    type="button"
                    onClick={() => setValue("headingFontFamily", preset.value)}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition hover:bg-gray-50 dark:hover:bg-white/5 ${
                      active
                        ? "border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-white/5"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {preset.description}
                      </div>
                    </div>
                    <span
                      className="text-xs text-gray-500"
                      style={{
                        fontFamily: preset.value || DEFAULT_HEADING_FONT,
                      }}
                    >
                      Aa
                    </span>
                  </button>
                );
              })}
            </div>
            <div
              className="rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-600 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300"
              style={{ fontFamily: displayHeadingFont }}
            >
              Heading Preview — The quick brown fox jumps.
            </div>
          </div>

          <div className="space-y-2">
            <Field label="Body font stack">
              <TextInput
                value={bodyOverride}
                onChange={(e) => setValue("bodyFontFamily", e.target.value)}
                placeholder={
                  'Default: var(--font-body-default), "Open Sans", sans-serif'
                }
              />
            </Field>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Leave blank to continue using Open Sans for body copy.
            </div>
            <div className="grid grid-cols-1 gap-2">
              {bodyFontPresets.map((preset) => {
                const presetValue = (preset.value || "").trim();
                const active = bodySelection === presetValue;
                return (
                  <button
                    key={`${preset.name}-body`}
                    type="button"
                    onClick={() => setValue("bodyFontFamily", preset.value)}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition hover:bg-gray-50 dark:hover:bg-white/5 ${
                      active
                        ? "border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-white/5"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {preset.description}
                      </div>
                    </div>
                    <span
                      className="text-xs text-gray-500"
                      style={{ fontFamily: preset.value || DEFAULT_BODY_FONT }}
                    >
                      Aa
                    </span>
                  </button>
                );
              })}
            </div>
            <div
              className="rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-600 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300"
              style={{ fontFamily: displayBodyFont }}
            >
              Body Preview — The quick brown fox jumps over the lazy dog.
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Ensure any custom fonts are loaded on the site (Google Fonts,
          self-hosted files, etc.).
        </div>
      </div>
    </div>
  );
}

function SettingsEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="text-sm font-medium">Favicon</div>
        <Field label="Favicon URL (.ico, .png)">
          <TextInput
            value={v.faviconUrl || ""}
            onChange={(e) => up("faviconUrl", e.target.value)}
          />
        </Field>
        <div className="mt-1">
          <ImageUpload
            value={v.faviconUrl}
            onChange={(url) => up("faviconUrl", url)}
            buttonLabel="Upload favicon"
          />
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Recommended: 32x32 or 48x48 PNG, or a .ico file. Manage logo, color,
          and typography in the <strong>Brand</strong> tab.
        </div>
      </div>

      <hr className="my-4 border-gray-200 dark:border-gray-800" />

      <div className="space-y-3">
        <div className="text-sm font-medium">SEO Meta</div>
        <Field label="Site Name">
          <TextInput
            value={v.siteName || ""}
            onChange={(e) => up("siteName", e.target.value)}
          />
        </Field>
        <Field label="SEO Title">
          <TextInput
            value={v.seoTitle || ""}
            onChange={(e) => up("seoTitle", e.target.value)}
          />
        </Field>
        <Field label="SEO Description">
          <Textarea
            rows={3}
            value={v.seoDescription || ""}
            onChange={(e) => up("seoDescription", e.target.value)}
          />
        </Field>
        <Field label="Canonical URL">
          <TextInput
            value={v.canonicalUrl || ""}
            onChange={(e) => up("canonicalUrl", e.target.value)}
            placeholder="https://yourdomain.com"
          />
        </Field>
      </div>
      <div className="space-y-3">
        <div className="text-sm font-medium">Open Graph</div>
        <Field label="OG Title">
          <TextInput
            value={v.ogTitle || ""}
            onChange={(e) => up("ogTitle", e.target.value)}
          />
        </Field>
        <Field label="OG Description">
          <Textarea
            rows={3}
            value={v.ogDescription || ""}
            onChange={(e) => up("ogDescription", e.target.value)}
          />
        </Field>
        <Field label="OG Image URL">
          <TextInput
            value={v.ogImageUrl || ""}
            onChange={(e) => up("ogImageUrl", e.target.value)}
          />
        </Field>
        <div className="mt-1">
          <ImageUpload
            value={v.ogImageUrl}
            onChange={(url) => up("ogImageUrl", url)}
            buttonLabel="Upload OG image"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-sm font-medium">Twitter</div>
        <Field label="Card Type">
          <TextInput
            value={v.twitterCard || "summary_large_image"}
            onChange={(e) => up("twitterCard", e.target.value)}
            placeholder="summary_large_image"
          />
        </Field>
        <Field label="@Site">
          <TextInput
            value={v.twitterSite || ""}
            onChange={(e) => up("twitterSite", e.target.value)}
            placeholder="@yourhandle"
          />
        </Field>
      </div>
      <hr className="my-4 border-gray-200 dark:border-gray-800" />

      <div className="space-y-3">
        <div className="text-sm font-medium">Analytics</div>
        <Field label="Google Analytics ID">
          <TextInput
            value={v.googleAnalyticsId || ""}
            onChange={(e) => up("googleAnalyticsId", e.target.value)}
            placeholder="G-XXXXXXXXXX"
          />
        </Field>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Enter your Google Analytics 4 measurement ID (starts with G-). Leave
          blank to disable Google Analytics tracking.
        </div>
      </div>

      <hr className="my-4 border-gray-200 dark:border-gray-800" />
      <div className="space-y-2">
        <div className="text-sm font-medium">Sitemap & Robots</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Generated dynamically from Settings. Use the links to preview.
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Open sitemap.xml
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Open robots.txt
          </a>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Set a Canonical URL above to ensure absolute URLs.
        </div>
      </div>
    </div>
  );
}

// Blog Posts editor
type PostSummary = {
  slug: string;
  title: string;
  date?: string;
  published?: boolean;
};
type PostItem = {
  slug: string;
  title: string;
  excerpt?: string;
  content_md?: string;
  cover_image?: string;
  author?: string;
  tags?: string[];
  date?: string;
  published?: boolean;
  audio_url?: string;
};

function PostsEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<PostSummary[]>([]);
  const [query, setQuery] = useState("");
  const [publishedOnly, setPublishedOnly] = useState(true);
  const [current, setCurrent] = useState<PostItem | null>(null);
  const [preview, setPreview] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (publishedOnly) params.set("published", "true");
    let j: any = { ok: false };
    try {
      const res = await fetch(`/api/admin/posts?${params.toString()}`, {
        cache: "no-store",
      });
      j = await res.json();
    } catch (e: any) {
      alert(e?.message || "Failed to load posts");
    }
    setLoading(false);
    if (j.ok) setItems(j.items || []);
    else alert(j.error || "Failed to load posts");
  };
  useEffect(() => {
    fetchList();
  }, []);

  const loadPost = async (slug: string) => {
    setSaving(true);
    const res = await fetch(`/api/admin/posts/${slug}`);
    const j = await res.json();
    setSaving(false);
    if (j.ok) setCurrent(j.item as PostItem);
  };

  const newPost = () =>
    setCurrent({
      slug: "",
      title: "",
      excerpt: "",
      content_md: "",
      cover_image: "",
      author: "",
      tags: [],
      date: new Date().toISOString().slice(0, 10),
      published: false,
      audio_url: "",
    });
  const up = (k: keyof PostItem, v: any) =>
    setCurrent(
      (p): PostItem => ({ ...(p ?? { slug: "", title: "" }), [k]: v })
    );
  const slugify = (s: string) =>
    (s || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");

  const save = async () => {
    if (!current) return;
    setSaving(true);
    // Normalize common path typos and shapes before save
    const normalizedAudio = (current.audio_url || "").startsWith("/upload/")
      ? (current.audio_url || "").replace(/^\/upload\//, "/uploads/")
      : current.audio_url || "";
    const payload = {
      ...current,
      audio_url: normalizedAudio || undefined,
      tags: Array.isArray(current.tags) ? current.tags : [],
    };
    let j: any = { ok: false };
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      j = await res.json();
    } catch (e: any) {
      alert(e?.message || "Failed to save");
    }
    setSaving(false);
    if (j.ok) {
      await fetchList();
    } else {
      alert(j.error || "Failed to save");
    }
  };
  const del = async () => {
    if (!current?.slug) return;
    if (!confirm("Delete this post?")) return;
    setSaving(true);
    const res = await fetch(`/api/admin/posts/${current.slug}`, {
      method: "DELETE",
    });
    const j = await res.json();
    setSaving(false);
    if (j.ok) {
      setCurrent(null);
      await fetchList();
    }
  };

  return (
    <div className="grid gap-6 ">
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title…"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-neutral-900"
          />
          <button onClick={fetchList} className="btn-secondary text-xs">
            Search
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={publishedOnly}
              onChange={(e) => setPublishedOnly(e.target.checked)}
            />{" "}
            Published only
          </label>
          <button onClick={newPost} className="btn-primary text-xs">
            New Post
          </button>
        </div>
        <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-800 max-h-[24rem] overflow-auto">
          {loading ? (
            <li className="p-3 text-sm text-gray-600">Loading…</li>
          ) : (
            (items || []).map((it) => (
              <li
                key={it.slug}
                className="p-3 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <button
                  onClick={() => loadPost(it.slug)}
                  className="w-full text-left"
                >
                  <div className="text-sm font-medium">{it.title}</div>
                  <div className="text-xs text-gray-500">{it.slug}</div>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
        {!current ? (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Select a post on the left or click New Post.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Title">
                <TextInput
                  value={current.title || ""}
                  onChange={(e) => {
                    const t = e.target.value;
                    up("title", t);
                    if (!current.slug) up("slug", slugify(t));
                  }}
                />
              </Field>
              <Field label="Slug">
                <TextInput
                  value={current.slug || ""}
                  onChange={(e) => up("slug", slugify(e.target.value))}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Author">
                <TextInput
                  value={current.author || ""}
                  onChange={(e) => up("author", e.target.value)}
                />
              </Field>
              <Field label="Date">
                <TextInput
                  type="date"
                  value={(current.date || "").slice(0, 10)}
                  onChange={(e) => up("date", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Excerpt">
              <Textarea
                rows={2}
                value={current.excerpt || ""}
                onChange={(e) => up("excerpt", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Cover image URL">
                <TextInput
                  value={current.cover_image || ""}
                  onChange={(e) => up("cover_image", e.target.value)}
                />
              </Field>
              <div className="pt-6">
                <ImageUpload
                  value={current.cover_image}
                  onChange={(url) => up("cover_image", url)}
                  buttonLabel="Upload cover"
                  accept="image/*"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Audio/Video URL (podcast)">
                <TextInput
                  value={current.audio_url || ""}
                  onChange={(e) => up("audio_url", e.target.value)}
                  placeholder="https://.../audio.mp3 or video.mp4"
                />
              </Field>
              <div className="pt-6">
                <ImageUpload
                  value={current.audio_url}
                  onChange={(url) => up("audio_url", url)}
                  buttonLabel="Upload media"
                  accept="audio/*,video/*"
                />
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <ReorderablePillsEditor
                value={Array.isArray(current.tags) ? current.tags : []}
                onChange={(arr) => up("tags", arr)}
                placeholder="tag"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!current.published}
                  onChange={(e) => up("published", e.target.checked)}
                />{" "}
                Published
              </label>
              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={saving}
                  className="btn-cta text-xs"
                >
                  {saving ? "Saving…" : "Save Post"}
                </button>
                <button
                  onClick={del}
                  disabled={saving || !current.slug}
                  className="btn-secondary text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              <div>
                <Label>Content (Markdown)</Label>
                <Textarea
                  rows={14}
                  value={current.content_md || ""}
                  onChange={(e) => up("content_md", e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Preview</Label>
                  <button
                    type="button"
                    onClick={() => setPreview((p) => !p)}
                    className="text-xs underline"
                  >
                    {preview ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="mt-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  {preview && (
                    <div className="article-content">
                      <Markdown content={current.content_md || ""} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SchemaEditor({
  value,
  onChange,
  contextData,
  onToast,
}: {
  value: any;
  onChange: (v: any) => void;
  contextData: any;
  onToast?: (msg: string, kind?: "success" | "error" | "info") => void;
}) {
  const [text, setText] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  // Form state
  type ServiceItem = { name: string; description?: string };
  type FaqItem = { q: string; a: string };
  const [businessName, setBusinessName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState("");
  const [image, setImage] = useState("");
  const [telephone, setTelephone] = useState("");
  const [priceRange, setPriceRange] = useState("$$");
  const [addressLocality, setAddressLocality] = useState("");
  const [addressRegion, setAddressRegion] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [openingDays, setOpeningDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [opens, setOpens] = useState("09:00");
  const [closes, setCloses] = useState("17:00");
  const [sameAs, setSameAs] = useState<string[]>([]);
  const [areaServed, setAreaServed] = useState<string[]>([]);
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [includeOrg, setIncludeOrg] = useState(false);
  const [includeProf, setIncludeProf] = useState(true);
  const [includeWebsite, setIncludeWebsite] = useState(true);
  const [websiteName, setWebsiteName] = useState("");
  useEffect(() => {
    const pretty = JSON.stringify(value ?? {}, null, 2);
    setText(pretty);
    setErr(null);
    // Seed form from context and existing value
    try {
      const origin =
        (typeof window !== "undefined" ? window.location.origin : "") ||
        "https://example.com";
      setUrl(origin);
      const contact = contextData?.contact || {};
      const services = contextData?.services || {};
      setTelephone(contact.phone || "");
      setAddressCountry(contact.location || "");
      const socials = Array.isArray(contact.socials) ? contact.socials : [];
      const same = socials.map((s: any) => s?.href).filter(Boolean);
      setSameAs(same);
      const serviceItems = Array.isArray(services.items) ? services.items : [];
      setServicesList(
        serviceItems.map((it: any) => ({
          name: it?.title || "",
          description: it?.description || "",
        }))
      );
      setBusinessName("MapleGrowth Digital");
      setLegalName("MapleGrowth Digital");
      const logoPath = fallback.logoUrl || "/logo.png";
      const fullLogo = logoPath.startsWith("http")
        ? logoPath
        : origin + logoPath;
      setLogo(fullLogo);
      setImage(fullLogo);
      setWebsiteName("MapleGrowth Digital");
      // If existing JSON-LD present, try to hydrate more precisely
      const obj = value || {};
      const graph = Array.isArray(obj["@graph"]) ? obj["@graph"] : [];
      const lb = graph.find((n: any) => n?.["@type"] === "LocalBusiness");
      if (lb) {
        setBusinessName(lb.name || businessName);
        setLegalName(lb.legalName || legalName);
        setUrl(lb.url || url);

        // Extract URL from ImageObject structure or use string directly
        const logoUrl =
          typeof lb.logo === "string"
            ? lb.logo
            : typeof lb.logo === "object" && lb.logo?.url
            ? lb.logo.url
            : logo;
        const imageUrl =
          typeof lb.image === "string"
            ? lb.image
            : typeof lb.image === "object" && lb.image?.url
            ? lb.image.url
            : image;

        setLogo(logoUrl);
        setImage(imageUrl);
        setTelephone(lb.telephone || telephone);
        setPriceRange(lb.priceRange || priceRange);
        setAddressLocality(lb.address?.addressLocality || addressLocality);
        setAddressRegion(lb.address?.addressRegion || addressRegion);
        setAddressCountry(lb.address?.addressCountry || addressCountry);
        if (lb.address?.postalCode) setPostalCode(lb.address.postalCode);
        if (
          Array.isArray(lb.openingHoursSpecification) &&
          lb.openingHoursSpecification[0]
        ) {
          setOpeningDays(
            lb.openingHoursSpecification[0].dayOfWeek || openingDays
          );
          setOpens(lb.openingHoursSpecification[0].opens || opens);
          setCloses(lb.openingHoursSpecification[0].closes || closes);
        }
        if (Array.isArray(lb.sameAs)) setSameAs(lb.sameAs);
      }
      const serviceNodes = graph.filter((n: any) => n?.["@type"] === "Service");
      if (serviceNodes.length)
        setServicesList(
          serviceNodes.map((n: any) => ({
            name: n.name || "",
            description: n.description || "",
          }))
        );
      const faq = graph.find((n: any) => n?.["@type"] === "FAQPage");
      if (faq && Array.isArray(faq.mainEntity)) {
        setFaqs(
          faq.mainEntity.map((q: any) => ({
            q: q?.name || "",
            a: q?.acceptedAnswer?.text || "",
          }))
        );
      }
    } catch {}
  }, [value]);

  const apply = () => {
    try {
      const parsed = text.trim() ? JSON.parse(text) : {};
      onChange(parsed);
      setText(JSON.stringify(parsed, null, 2));
      setErr(null);
      onToast?.("Applied schema changes", "success");
    } catch (e: any) {
      setErr("Invalid JSON");
      onToast?.("Invalid JSON", "error");
    }
  };

  const prettify = () => {
    try {
      const p = JSON.parse(text);
      setText(JSON.stringify(p, null, 2));
      setErr(null);
    } catch {
      setErr("Invalid JSON");
    }
  };

  // Helper to build JSON-LD from current form state
  const slugify = (s: string) =>
    (s || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const buildJsonFromForm = (
    opts?: Partial<{ logo: string; image: string }>
  ) => {
    const agencyId = (url || "").replace(/\/$/, "") + "/#agency";
    const websiteId = (url || "").replace(/\/$/, "") + "/#website";
    const types: any = [
      "LocalBusiness",
      ...(includeOrg ? ["Organization"] : []),
      ...(includeProf ? ["ProfessionalService"] : []),
    ];
    const jsonld: any = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": types,
          "@id": agencyId,
          name: businessName || undefined,
          legalName: legalName || undefined,
          description: undefined,
          url: url || undefined,
          logo:
            opts?.logo ?? logo
              ? { "@type": "ImageObject", url: opts?.logo ?? logo }
              : undefined,
          image:
            opts?.image ?? image
              ? { "@type": "ImageObject", url: opts?.image ?? image }
              : undefined,
          telephone: telephone || undefined,
          priceRange: priceRange || undefined,
          address:
            addressLocality || addressRegion || addressCountry
              ? {
                  "@type": "PostalAddress",
                  addressLocality: addressLocality || undefined,
                  addressRegion: addressRegion || undefined,
                  addressCountry: addressCountry || undefined,
                  postalCode: postalCode || undefined,
                }
              : undefined,
          openingHoursSpecification: openingDays.length
            ? [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: openingDays,
                  opens: opens || undefined,
                  closes: closes || undefined,
                },
              ]
            : undefined,
          contactPoint: telephone
            ? [
                {
                  "@type": "ContactPoint",
                  telephone: telephone,
                  contactType: "customer service",
                },
              ]
            : undefined,
          sameAs: sameAs.length ? sameAs : undefined,
        },
        ...servicesList
          .filter((s) => s.name)
          .map((s) => {
            const slug = slugify(s.name);
            const serviceUrl =
              (s as any).url ||
              (url || "").replace(/\/$/, "") + "/services/" + slug;
            return {
              "@type": "Service",
              "@id": serviceUrl + "#service",
              name: s.name,
              description: s.description || undefined,
              serviceType: (s as any).serviceType || undefined,
              areaServed: areaServed.length ? areaServed : undefined,
              url: serviceUrl,
              provider: { "@id": agencyId },
            };
          }),
      ],
    };
    if (includeWebsite) {
      jsonld["@graph"].push({
        "@type": "WebSite",
        "@id": websiteId,
        url: url || undefined,
        name: websiteName || businessName || undefined,
        publisher: { "@id": agencyId },
      });
    }
    if (faqs.length) {
      jsonld["@graph"].push({
        "@type": "FAQPage",
        mainEntity: faqs
          .filter((f) => f.q && f.a)
          .map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
      });
    }
    return jsonld;
  };

  const generateFromContent = () => {
    try {
      const origin =
        (typeof window !== "undefined" ? window.location.origin : "") ||
        "https://example.com";
      const contact = contextData?.contact || {};
      const services = contextData?.services || {};
      const socials = Array.isArray(contact.socials) ? contact.socials : [];
      const serviceItems = Array.isArray(services.items) ? services.items : [];
      const logoPath = (fallback.logoUrl || "/logo.png").startsWith("http")
        ? fallback.logoUrl
        : origin + (fallback.logoUrl || "");
      const phone = contact.phone || "";
      const sameAs = socials.map((s: any) => s?.href).filter(Boolean);
      const agencyId = origin + "/#agency";
      const jsonld = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LocalBusiness",
            "@id": agencyId,
            name: "MapleGrowth Digital",
            description: "Web design and development studio",
            url: origin,
            logo: logoPath,
            image: logoPath,
            telephone: phone,
            priceRange: "$$",
            address: {
              "@type": "PostalAddress",
              addressCountry: contact.location || "AU",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:00",
                closes: "17:00",
              },
            ],
            contactPoint: phone
              ? [
                  {
                    "@type": "ContactPoint",
                    telephone: phone,
                    contactType: "customer service",
                  },
                ]
              : undefined,
            sameAs: sameAs.length ? sameAs : undefined,
          },
          ...serviceItems.map((it: any) => ({
            "@type": "Service",
            name: it?.title || "Service",
            description: it?.description || undefined,
            provider: { "@id": agencyId },
          })),
        ],
      } as any;
      setText(JSON.stringify(jsonld, null, 2));
      setErr(null);
    } catch (e: any) {
      setErr("Failed to generate");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <IconButton title="Generate from content" onClick={generateFromContent}>
          Generate from content
        </IconButton>
        <IconButton title="Prettify" onClick={prettify}>
          Prettify
        </IconButton>
        <IconButton title="Apply" onClick={apply}>
          Apply
        </IconButton>
        {err && <span className="text-xs text-red-600">{err}</span>}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Form builder</div>
        <button
          type="button"
          className="text-xs underline"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? "Hide" : "Show"}
        </button>
      </div>
      {showForm && (
        <div className="space-y-4 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Business name">
              <TextInput
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </Field>
            <Field label="Legal name">
              <TextInput
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
              />
            </Field>
            <Field label="Website URL">
              <TextInput value={url} onChange={(e) => setUrl(e.target.value)} />
            </Field>
            <Field label="Telephone">
              <TextInput
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </Field>
            <Field label="Price range">
              <TextInput
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </Field>
            <div className="col-span-2 grid md:grid-cols-2 gap-2">
              <Field label="Logo URL">
                <TextInput
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
              </Field>
              <div className="pt-5">
                <ImageUpload
                  value={logo}
                  onChange={(url) => {
                    setLogo(url);
                    const j = buildJsonFromForm({ logo: url });
                    setText(JSON.stringify(j, null, 2));
                    onChange(j);
                    onToast?.("Applied logo to schema", "success");
                  }}
                  buttonLabel="Upload logo"
                />
              </div>
              <Field label="Image URL">
                <TextInput
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </Field>
              <div className="pt-5">
                <ImageUpload
                  value={image}
                  onChange={(url) => {
                    setImage(url);
                    const j = buildJsonFromForm({ image: url });
                    setText(JSON.stringify(j, null, 2));
                    onChange(j);
                    onToast?.("Applied image to schema", "success");
                  }}
                  buttonLabel="Upload image"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Field label="Address locality">
              <TextInput
                value={addressLocality}
                onChange={(e) => setAddressLocality(e.target.value)}
              />
            </Field>
            <Field label="Address region">
              <TextInput
                value={addressRegion}
                onChange={(e) => setAddressRegion(e.target.value)}
              />
            </Field>
            <Field label="Address country">
              <TextInput
                value={addressCountry}
                onChange={(e) => setAddressCountry(e.target.value)}
              />
            </Field>
            <Field label="Postal code">
              <TextInput
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Field>
          </div>
          <div className="space-y-2">
            <Label>Opening hours</Label>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((d) => {
                const active = openingDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setOpeningDays((prev) =>
                        active ? prev.filter((x) => x !== d) : [...prev, d]
                      )
                    }
                    className={
                      (active
                        ? "bg-brand-500 text-white"
                        : "bg-white text-gray-700 dark:bg-neutral-900 dark:text-gray-200") +
                      " rounded-md border border-gray-300 px-2 py-1 dark:border-gray-700"
                    }
                  >
                    {d.slice(0, 3)}
                  </button>
                );
              })}
              <div className="ml-auto flex items-center gap-2 flex-wrap">
                <span>Opens</span>
                <input
                  type="time"
                  value={opens}
                  onChange={(e) => setOpens(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-neutral-900"
                />
                <span>Closes</span>
                <input
                  type="time"
                  value={closes}
                  onChange={(e) => setCloses(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-neutral-900"
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Social profiles (sameAs)</Label>
            <ReorderablePillsEditor
              value={sameAs}
              onChange={setSameAs}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Area served</Label>
            <ReorderablePillsEditor
              value={areaServed}
              onChange={setAreaServed}
              placeholder="Australia, Global, ..."
            />
          </div>
          <div className="space-y-2">
            <Label>Organization types</Label>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIncludeOrg((v) => !v)}
                className={
                  (includeOrg
                    ? "bg-brand-500 text-white"
                    : "bg-white text-gray-700 dark:bg-neutral-900 dark:text-gray-200") +
                  " rounded-md border border-gray-300 px-2 py-1 dark:border-gray-700"
                }
              >
                Organization
              </button>
              <button
                type="button"
                onClick={() => setIncludeProf((v) => !v)}
                className={
                  (includeProf
                    ? "bg-brand-500 text-white"
                    : "bg-white text-gray-700 dark:bg-neutral-900 dark:text-gray-200") +
                  " rounded-md border border-gray-300 px-2 py-1 dark:border-gray-700"
                }
              >
                ProfessionalService
              </button>
              <span className="text-gray-500 dark:text-gray-400">
                LocalBusiness is always included
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Website node</Label>
            <div className="flex items-center gap-2 text-xs">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeWebsite}
                  onChange={(e) => setIncludeWebsite(e.target.checked)}
                />{" "}
                Include WebSite
              </label>
              <div className="flex-1">
                <Field label="Website name">
                  <TextInput
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Services</Label>
            <div className="space-y-3">
              {servicesList.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-2 rounded-md border border-gray-200 p-2 dark:border-gray-800"
                >
                  <TextInput
                    placeholder="Name"
                    value={s.name}
                    onChange={(e) => {
                      const arr = [...servicesList];
                      arr[i] = { ...arr[i], name: e.target.value };
                      setServicesList(arr);
                    }}
                  />
                  <TextInput
                    placeholder="Service URL (optional)"
                    value={(s as any).url || ""}
                    onChange={(e) => {
                      const arr = [...servicesList];
                      (arr[i] as any) = {
                        ...(arr[i] as any),
                        url: e.target.value,
                      };
                      setServicesList(arr);
                    }}
                  />
                  <TextInput
                    placeholder="Service type (optional)"
                    value={(s as any).serviceType || ""}
                    onChange={(e) => {
                      const arr = [...servicesList];
                      (arr[i] as any) = {
                        ...(arr[i] as any),
                        serviceType: e.target.value,
                      };
                      setServicesList(arr);
                    }}
                  />
                  <div className="col-span-2">
                    <Textarea
                      placeholder="Description"
                      rows={2}
                      value={s.description || ""}
                      onChange={(e) => {
                        const arr = [...servicesList];
                        arr[i] = { ...arr[i], description: e.target.value };
                        setServicesList(arr);
                      }}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <IconButton
                      title="Remove"
                      onClick={() =>
                        setServicesList(
                          servicesList.filter((_, idx) => idx !== i)
                        )
                      }
                    >
                      Remove
                    </IconButton>
                  </div>
                </div>
              ))}
              <IconButton
                title="Add"
                onClick={() =>
                  setServicesList([
                    ...servicesList,
                    { name: "", description: "" },
                  ])
                }
              >
                Add service
              </IconButton>
            </div>
          </div>
          <div className="space-y-2">
            <Label>FAQ</Label>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-2 rounded-md border border-gray-200 p-2 dark:border-gray-800"
                >
                  <TextInput
                    placeholder="Question"
                    value={f.q}
                    onChange={(e) => {
                      const arr = [...faqs];
                      arr[i] = { ...arr[i], q: e.target.value };
                      setFaqs(arr);
                    }}
                  />
                  <div className="col-span-2">
                    <Textarea
                      placeholder="Answer"
                      rows={2}
                      value={f.a}
                      onChange={(e) => {
                        const arr = [...faqs];
                        arr[i] = { ...arr[i], a: e.target.value };
                        setFaqs(arr);
                      }}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <IconButton
                      title="Remove"
                      onClick={() =>
                        setFaqs(faqs.filter((_, idx) => idx !== i))
                      }
                    >
                      Remove
                    </IconButton>
                  </div>
                </div>
              ))}
              <IconButton
                title="Add"
                onClick={() => setFaqs([...faqs, { q: "", a: "" }])}
              >
                Add Q&A
              </IconButton>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconButton
              title="Build JSON-LD"
              onClick={() => {
                const jsonld = buildJsonFromForm();
                setText(JSON.stringify(jsonld, null, 2));
                onChange(jsonld);
                onToast?.("Built JSON-LD from form", "success");
              }}
            >
              Build JSON‑LD
            </IconButton>
          </div>
        </div>
      )}
      <Textarea
        rows={18}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="rounded-md border border-gray-200 p-3 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300">
        Paste valid JSON-LD here. Click Generate to scaffold from current
        content, then Apply to stage changes before saving the section.
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState<SectionKey>("hero");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [raw, setRaw] = useState(false);
  const [rawText, setRawText] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Initialize tab from URL hash or localStorage
  useEffect(() => {
    const initializeTab = () => {
      // First check URL hash
      const hash = window.location.hash.slice(1);
      const validSections: SectionKey[] = [
        "hero",
        "marquee",
        "services",
        "process",
        "beliefs",
        "clients",
        "clientLogos",
        "caseStudies",
        "about",
        "book",
        "contact",
        "schema",
        "brand",
        "settings",
        "posts",
        "wireframe",
        "navigation",
        "header",
        "footer",
      ];

      if (hash && validSections.includes(hash as SectionKey)) {
        setTab(hash as SectionKey);
        return;
      }

      // Fallback to localStorage
      try {
        const savedTab = localStorage.getItem("adminTab");
        if (savedTab && validSections.includes(savedTab as SectionKey)) {
          setTab(savedTab as SectionKey);
          // Update URL hash to match
          window.history.replaceState(null, "", `#${savedTab}`);
          return;
        }
      } catch (e) {
        // localStorage not available
      }

      // Default to hero and update URL
      setTab("hero");
      window.history.replaceState(null, "", "#hero");
    };

    initializeTab();
  }, []);

  // Update URL hash and localStorage when tab changes
  const setTabWithPersistence = (newTab: SectionKey) => {
    setTab(newTab);

    // Update URL hash
    window.history.replaceState(null, "", `#${newTab}`);

    // Save to localStorage
    try {
      localStorage.setItem("adminTab", newTab);
    } catch (e) {
      // localStorage not available
    }
  };

  const pushToast = (
    message: string,
    kind: "success" | "error" | "info" = "info"
  ) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      2800
    );
  };
  const closeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      const j = await res.json();
      setData(j);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!data) return;
    const section = (data as any)[tab] ?? {};
    setRawText(JSON.stringify(section, null, 2));
    setError(null);
    setMessage(null);
  }, [tab, data]);

  const onSave = async () => {
    setError(null);
    setMessage(null);
    let payload: any = (data || {})[tab] ?? {};
    if (raw) {
      try {
        payload = JSON.parse(rawText);
      } catch {
        setError("Invalid JSON");
        return;
      }
    }
    if (tab === "brand") {
      const sanitizeColor = (val: unknown) =>
        typeof val === "string" && /^#[0-9A-Fa-f]{6}$/.test(val) ? val : null;
      const sanitizeFont = (val: unknown) => {
        if (typeof val !== "string") return null;
        const trimmed = val.trim();
        if (!trimmed) return null;
        return /^[a-zA-Z0-9\s,"'\/\-:\(\)_]+$/.test(trimmed) ? trimmed : null;
      };

      const cleanedBrand = sanitizeColor(payload.brandColor);
      const cleanedButton = sanitizeColor(payload.primaryButtonColor);
      const cleanedHeading = sanitizeFont(payload.headingFontFamily);
      const cleanedBody = sanitizeFont(payload.bodyFontFamily);

      if (cleanedBrand) payload.brandColor = cleanedBrand;
      else delete payload.brandColor;

      if (cleanedButton) payload.primaryButtonColor = cleanedButton;
      else delete payload.primaryButtonColor;

      if (cleanedHeading) payload.headingFontFamily = cleanedHeading;
      else delete payload.headingFontFamily;

      if (cleanedBody) payload.bodyFontFamily = cleanedBody;
      else delete payload.bodyFontFamily;

      if (payload.fontFamily) delete payload.fontFamily;
    }
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: tab, data: payload }),
    });
    const j = await res.json();
    setSaving(false);
    if (!j.ok) {
      setError(j.error || "Failed to save.");
      pushToast(j.error || "Failed to save", "error");
      return;
    }
    setMessage("Saved!");
    pushToast("Saved successfully", "success");
    setData((prev: any) => ({ ...(prev || {}), [tab]: payload }));
    setRawText(JSON.stringify(payload, null, 2));

    // If brand settings were saved, propagate theme updates immediately and notify main site
    if (tab === "brand" || tab === "settings") {
      try {
        const sanitizeColor = (val: unknown) =>
          typeof val === "string" && /^#[0-9A-Fa-f]{6}$/.test(val) ? val : null;
        const sanitizeFont = (val: unknown) => {
          if (typeof val !== "string") return null;
          const trimmed = val.trim();
          if (!trimmed) return null;
          return /^[a-zA-Z0-9\s,"'\/\-:\(\)_]+$/.test(trimmed) ? trimmed : null;
        };
        const safeBrand = sanitizeColor(payload.brandColor);
        const safeButton = sanitizeColor(payload.primaryButtonColor);
        const safeHeadingFont = sanitizeFont(payload.headingFontFamily);
        const safeBodyFont = sanitizeFont(payload.bodyFontFamily);
        const styles = getComputedStyle(document.documentElement);
        const liveBrand =
          styles.getPropertyValue("--brand-500").trim() || "#C62828";
        const liveHeading = styles.getPropertyValue("--font-heading").trim();
        const liveBody = styles.getPropertyValue("--font-body").trim();

        if (safeBrand) {
          document.documentElement.style.setProperty("--brand-500", safeBrand);
        } else if (!payload.brandColor) {
          document.documentElement.style.setProperty("--brand-500", "#C62828");
        }

        const nextButton = safeButton || safeBrand || liveBrand || "#C62828";
        document.documentElement.style.setProperty(
          "--button-primary",
          nextButton
        );

        if (safeHeadingFont) {
          payload.headingFontFamily = safeHeadingFont;
          if (safeHeadingFont !== liveHeading) {
            document.documentElement.style.setProperty(
              "--font-heading",
              safeHeadingFont
            );
          }
        } else {
          delete payload.headingFontFamily;
          document.documentElement.style.removeProperty("--font-heading");
        }

        if (safeBodyFont) {
          payload.bodyFontFamily = safeBodyFont;
          if (safeBodyFont !== liveBody) {
            document.documentElement.style.setProperty(
              "--font-body",
              safeBodyFont
            );
          }
        } else {
          delete payload.bodyFontFamily;
          document.documentElement.style.removeProperty("--font-body");
        }

        if (payload.fontFamily) delete payload.fontFamily;

        // Signal other tabs / the main site to refetch dynamic styles
        localStorage.setItem("brandColorUpdate", Date.now().toString());
      } catch (e) {
        // localStorage might not be available in some contexts
      }
    }
  };

  const sectionValue = useMemo(() => (data || {})[tab] ?? {}, [data, tab]);
  const setSection = (v: any) =>
    setData((prev: any) => ({ ...(prev || {}), [tab]: v }));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Toasts items={toasts} onClose={closeToast} />
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <button
            type="button"
            onClick={() => setRaw((r) => !r)}
            className="btn-secondary text-xs"
          >
            {raw ? "Form view" : "Raw JSON"}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Edit site content by section. Basic Auth protected via middleware (env
          ADMIN_USER / ADMIN_PASS).
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <aside className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/5">
            <Sidebar tab={tab} setTab={setTabWithPersistence} />
          </aside>
          <section className="md:col-span-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{getSectionLabel(tab)}</h2>
                <div className="text-xs text-gray-500">
                  Section key: <code>{tab}</code>
                </div>
              </div>
              <div className="mt-4">
                {loading ? (
                  <div className="text-sm text-gray-600">Loading…</div>
                ) : raw ? (
                  <Textarea
                    rows={20}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                  />
                ) : (
                  <div className="space-y-4">
                    {tab === "hero" && (
                      <HeroEditor value={sectionValue} onChange={setSection} />
                    )}
                    {tab === "marquee" && (
                      <div>
                        <Label>Capabilities</Label>
                        <ReorderablePillsEditor
                          value={
                            Array.isArray(sectionValue)
                              ? (sectionValue as any)
                              : Array.isArray(sectionValue?.items)
                              ? sectionValue.items
                              : []
                          }
                          onChange={(arr) => setSection(arr)}
                          placeholder="Add capability"
                        />
                      </div>
                    )}
                    {tab === "services" && (
                      <ServicesEditor
                        value={sectionValue}
                        onChange={setSection}
                      />
                    )}
                    {tab === "process" && (
                      <ProcessEditor
                        value={sectionValue}
                        onChange={setSection}
                      />
                    )}
                    {tab === "beliefs" && (
                      <BeliefsEditor
                        value={Array.isArray(sectionValue) ? sectionValue : []}
                        onChange={setSection}
                      />
                    )}
                    {tab === "clients" && (
                      <Field label="Heading title">
                        <TextInput
                          value={(sectionValue?.title ?? "") as any}
                          onChange={(e) =>
                            setSection({
                              ...(sectionValue || {}),
                              title: e.target.value,
                            })
                          }
                        />
                      </Field>
                    )}
                    {tab === "clientLogos" && (
                      <ClientLogosEditor
                        value={Array.isArray(sectionValue) ? sectionValue : []}
                        onChange={setSection}
                      />
                    )}
                    {tab === "caseStudies" && (
                      <CaseStudiesEditor
                        value={sectionValue}
                        onChange={setSection}
                      />
                    )}
                    {tab === "about" && (
                      <AboutEditor value={sectionValue} onChange={setSection} />
                    )}
                    {tab === "book" && (
                      <BookEditor value={sectionValue} onChange={setSection} />
                    )}
                    {tab === "contact" && (
                      <ContactEditor
                        value={sectionValue}
                        onChange={setSection}
                      />
                    )}
                    {tab === "schema" && (
                      <div>
                        <SchemaEditor
                          value={sectionValue}
                          onChange={setSection}
                          contextData={data}
                          onToast={pushToast}
                        />
                      </div>
                    )}
                    {tab === "brand" && (
                      <BrandEditor
                        value={sectionValue}
                        onChange={setSection}
                        fallback={data?.settings}
                      />
                    )}
                    {tab === "settings" && (
                      <SettingsEditor
                        value={sectionValue}
                        onChange={setSection}
                      />
                    )}
                    {tab === "navigation" && (
                      <NavigationEditor
                        value={Array.isArray(sectionValue) ? sectionValue : []}
                        onChange={setSection}
                      />
                    )}
                    {tab === "header" && (
                      <HeaderEditor
                        value={sectionValue}
                        onChange={setSection}
                      />
                    )}
                    {tab === "footer" && (
                      <FooterEditor
                        value={sectionValue}
                        onChange={setSection}
                      />
                    )}
                    {tab === "wireframe" && (
                      <WireframeViewer
                        data={data}
                        onSectionClick={(section) =>
                          setTabWithPersistence(section)
                        }
                        onDataUpdate={(newData) => setData(newData)}
                      />
                    )}
                    {tab === "posts" && <PostsEditor />}
                  </div>
                )}
              </div>
              {tab !== "wireframe" && tab !== "posts" && (
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={onSave}
                    disabled={saving}
                    className="btn-cta"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  {message && (
                    <span className="text-xs text-green-600">{message}</span>
                  )}
                  {error && (
                    <span className="text-xs text-red-600">{error}</span>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Uploads go to Supabase Storage (bucket: uploads) when configured, or
          to <code>/public/uploads</code> in local dev.
        </div>
      </div>
    </main>
  );
}
function Sidebar({
  tab,
  setTab,
}: {
  tab: SectionKey;
  setTab: (k: SectionKey) => void;
}) {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/5">
      <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
        Home
      </div>
      <ul className="space-y-1 text-sm">
        {HOME_SECTIONS.map((s) => (
          <li key={s.key}>
            <button
              onClick={() => setTab(s.key)}
              className={`w-full rounded-md px-3 py-2 text-left ${
                tab === s.key
                  ? "bg-brand-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
        Brand
      </div>
      <ul className="space-y-1 text-sm">
        <li>
          <button
            onClick={() => setTab("brand")}
            className={`w-full rounded-md px-3 py-2 text-left ${
              tab === "brand"
                ? "bg-brand-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Brand
          </button>
        </li>
      </ul>
      <div className="mt-3 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
        Blog
      </div>
      <ul className="space-y-1 text-sm">
        <li>
          <button
            onClick={() => setTab("posts")}
            className={`w-full rounded-md px-3 py-2 text-left ${
              tab === "posts"
                ? "bg-brand-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Posts
          </button>
        </li>
      </ul>
      <div className="mt-3 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
        Layout
      </div>
      <ul className="space-y-1 text-sm">
        <li>
          <button
            onClick={() => setTab("header")}
            className={`w-full rounded-md px-3 py-2 text-left ${
              tab === "header"
                ? "bg-brand-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Header
          </button>
        </li>
        <li>
          <button
            onClick={() => setTab("footer")}
            className={`w-full rounded-md px-3 py-2 text-left ${
              tab === "footer"
                ? "bg-brand-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Footer
          </button>
        </li>
      </ul>
      <div className="mt-3 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
        Other
      </div>
      <ul className="space-y-1 text-sm">
        <li>
          <button
            onClick={() => setTab("wireframe")}
            className={`w-full rounded-md px-3 py-2 text-left ${
              tab === "wireframe"
                ? "bg-brand-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Wireframe
          </button>
        </li>
        <li>
          <button
            onClick={() => setTab("navigation")}
            className={`w-full rounded-md px-3 py-2 text-left ${
              tab === "navigation"
                ? "bg-brand-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Navigation
          </button>
        </li>
        <li>
          <button
            onClick={() => setTab("schema")}
            className={`w-full rounded-md px-3 py-2 text-left ${
              tab === "schema"
                ? "bg-brand-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Schema (JSON‑LD)
          </button>
        </li>
        <li>
          <button
            onClick={() => setTab("settings")}
            className={`w-full rounded-md px-3 py-2 text-left ${
              tab === "settings"
                ? "bg-brand-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Settings
          </button>
        </li>
      </ul>
    </aside>
  );
}

function WireframeViewer({
  data,
  onSectionClick,
  onDataUpdate,
}: {
  data: any;
  onSectionClick: (section: SectionKey) => void;
  onDataUpdate: (newData: any) => void;
}) {
  const [saving, setSaving] = useState(false);

  const sections = [
    {
      key: "hero" as SectionKey,
      label: "Hero Section",
      description: "Main headline, subhead, stats, and hero image",
      required: true, // Hero is always required
    },
    {
      key: "marquee" as SectionKey,
      label: "Capabilities Marquee",
      description: "Scrolling list of your capabilities",
      required: false,
    },
    {
      key: "services" as SectionKey,
      label: "Services",
      description: "Your service offerings with icons and descriptions",
      required: false,
    },
    {
      key: "process" as SectionKey,
      label: "Process/Methodology",
      description: "Your workflow or system explanation",
      required: false,
    },
    {
      key: "caseStudies" as SectionKey,
      label: "Case Studies",
      description: "Portfolio projects with results",
      required: false,
    },
    {
      key: "beliefs" as SectionKey,
      label: "Beliefs/Philosophy",
      description: "Your company values and beliefs",
      required: false,
    },
    {
      key: "about" as SectionKey,
      label: "About Team",
      description: "Team information and company story",
      required: false,
    },
    {
      key: "clients" as SectionKey,
      label: "Client Logos",
      description: "Trusted client logo carousel",
      required: false,
    },
    {
      key: "book" as SectionKey,
      label: "Book a Call CTA",
      description: "Call-to-action for booking consultations",
      required: false,
    },
    {
      key: "contact" as SectionKey,
      label: "Contact",
      description: "Contact form and company details",
      required: true, // Contact is always required
    },
  ];

  const toggleSectionVisibility = async (
    sectionKey: SectionKey,
    visible: boolean
  ) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "sectionVisibility",
          data: {
            ...((data?.sectionVisibility as any) || {}),
            [sectionKey]: visible,
          },
        }),
      });
      const j = await res.json();
      if (j.ok) {
        // Update local data to reflect the change immediately
        const updatedData = {
          ...data,
          sectionVisibility: {
            ...((data?.sectionVisibility as any) || {}),
            [sectionKey]: visible,
          },
        };
        onDataUpdate(updatedData);
      }
    } catch (error) {
      console.error("Failed to update section visibility:", error);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/5">
        <h3 className="text-sm font-medium mb-2">Homepage Structure</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          This shows the order and structure of sections on your homepage. Click
          any section to edit it.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => {
          const hasContent = data?.[section.key];
          const isConfigured =
            hasContent &&
            (typeof hasContent === "object"
              ? Object.keys(hasContent).length > 0
              : Array.isArray(hasContent)
              ? hasContent.length > 0
              : true);

          // Get visibility status (default to true if not set)
          const sectionVisibility = data?.sectionVisibility || {};
          const isVisible = sectionVisibility[section.key] !== false;

          return (
            <div
              key={section.key}
              className={`group relative rounded-lg border p-4 transition hover:shadow-sm ${
                isVisible
                  ? "border-gray-200 bg-white hover:border-brand-500/30 dark:border-gray-800 dark:bg-white/5 dark:hover:border-brand-500/30"
                  : "border-gray-300 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-900/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {index + 1}
                    </span>
                    <h4
                      className={`font-medium ${
                        !isVisible ? "line-through" : ""
                      }`}
                    >
                      {section.label}
                    </h4>
                    <div
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                        isConfigured
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          isConfigured ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      {isConfigured ? "Configured" : "Default"}
                    </div>
                    {!isVisible && (
                      <div className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Hidden
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {section.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!section.required && (
                    <label className="inline-flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={(e) =>
                          toggleSectionVisibility(section.key, e.target.checked)
                        }
                        disabled={saving}
                        className="rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600"
                      />
                      <span className={saving ? "opacity-50" : ""}>
                        {isVisible ? "Show" : "Hide"}
                      </span>
                    </label>
                  )}
                  {section.required && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Required
                    </span>
                  )}
                  <button
                    onClick={() => onSectionClick(section.key)}
                    className="btn-secondary text-xs opacity-0 transition group-hover:opacity-100"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Visual wireframe representation */}
              <div className="mt-4 rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
                <div className="space-y-2">
                  {section.key === "hero" && (
                    <div className="space-y-2">
                      <div className="h-2 w-1/3 rounded bg-brand-500/20"></div>
                      <div className="h-3 w-2/3 rounded bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
                        <div className="h-8 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
                        <div className="h-8 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
                      </div>
                    </div>
                  )}
                  {section.key === "marquee" && (
                    <div className="flex gap-2 overflow-hidden">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-6 w-20 flex-shrink-0 rounded bg-gray-300 dark:bg-gray-600"
                        ></div>
                      ))}
                    </div>
                  )}
                  {section.key === "services" && (
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-1">
                          <div className="h-6 w-6 rounded bg-brand-500/30"></div>
                          <div className="h-2 w-full rounded bg-gray-300 dark:bg-gray-600"></div>
                          <div className="h-1 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.key === "process" && (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-brand-500/30"></div>
                          <div className="h-2 flex-1 rounded bg-gray-300 dark:bg-gray-600"></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.key === "caseStudies" && (
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="space-y-1">
                          <div className="aspect-video rounded bg-gray-300 dark:bg-gray-600"></div>
                          <div className="h-2 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
                          <div className="flex gap-1">
                            <div className="h-1 w-8 rounded bg-brand-500/30"></div>
                            <div className="h-1 w-8 rounded bg-brand-500/30"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.key === "beliefs" && (
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="space-y-1 rounded border border-gray-200 p-2 dark:border-gray-700"
                        >
                          <div className="h-2 w-1/2 rounded bg-brand-500/20"></div>
                          <div className="h-1 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-1 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.key === "about" && (
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
                        <div className="h-1 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-1 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                  )}
                  {section.key === "clients" && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-8 w-12 rounded bg-gray-300 dark:bg-gray-600"
                        ></div>
                      ))}
                    </div>
                  )}
                  {section.key === "book" && (
                    <div className="rounded border-2 border-brand-500/30 bg-brand-500/5 p-3 text-center">
                      <div className="mx-auto h-2 w-1/2 rounded bg-brand-500/40"></div>
                      <div className="mx-auto mt-2 h-6 w-20 rounded bg-brand-500"></div>
                    </div>
                  )}
                  {section.key === "contact" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="h-1 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
                        <div className="h-6 w-full rounded border border-gray-300 dark:border-gray-600"></div>
                        <div className="h-6 w-full rounded border border-gray-300 dark:border-gray-600"></div>
                        <div className="h-12 w-full rounded border border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
                        <div className="h-1 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-1 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
        <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            View Homepage
          </a>
          <a
            href="/blog"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            View Blog
          </a>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
        <h3 className="text-sm font-medium mb-2">Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>Configured - Content has been customized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span>Default - Using template content</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavigationEditor({
  value,
  onChange,
}: {
  value: any[];
  onChange: (v: any[]) => void;
}) {
  const list = Array.isArray(value)
    ? value
    : [
        { href: "/#services", label: "Services" },
        { href: "/#process", label: "Process" },
        { href: "/#case-studies", label: "Case Studies" },
        { href: "/#about", label: "About" },
        { href: "/blog", label: "Blog" },
        { href: "/#contact", label: "Contact" },
      ];

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const onDragStart = (idx: number, e: React.DragEvent) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch {}
  };

  const onDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (overIdx !== idx) setOverIdx(idx);
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIdx ?? Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    setDragIdx(null);
    setOverIdx(null);
    if (Number.isFinite(from) && Number.isFinite(to) && from !== to) {
      const next = [...list];
      const [moved] = next.splice(from as number, 1);
      next.splice(to, 0, moved);
      onChange(next);
    }
  };

  const onDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/5">
        <h3 className="text-sm font-medium mb-2">Header Navigation Menu</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Customize the navigation menu items that appear in the header. Drag to
          reorder, edit labels and links.
        </p>
      </div>

      <div className="space-y-3">
        {list.map((item, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => onDragStart(i, e)}
            onDragOver={(e) => onDragOver(i, e)}
            onDrop={(e) => onDrop(i, e)}
            onDragEnd={onDragEnd}
            className={
              (overIdx === i ? "border-brand-500 bg-brand-500/5 " : "") +
              "grid grid-cols-2 gap-2 rounded-md border border-gray-200 p-3 dark:border-gray-800"
            }
          >
            <div className="col-span-2 -mb-1 flex items-center gap-2 text-xs text-gray-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M8 6h.01M12 6h.01M16 6h.01M8 12h.01M12 12h.01M16 12h.01M8 18h.01M12 18h.01M16 18h.01" />
              </svg>
              Drag to reorder
            </div>
            <TextInput
              placeholder="Label"
              value={item.label || ""}
              onChange={(e) => {
                const arr = [...list];
                arr[i] = { ...arr[i], label: e.target.value };
                onChange(arr);
              }}
            />
            <TextInput
              placeholder="Link (/#section or /page)"
              value={item.href || ""}
              onChange={(e) => {
                const arr = [...list];
                arr[i] = { ...arr[i], href: e.target.value };
                onChange(arr);
              }}
            />
            <div className="col-span-2 flex justify-end">
              <IconButton
                title="Remove"
                onClick={() => onChange(list.filter((_, idx) => idx !== i))}
              >
                Remove
              </IconButton>
            </div>
          </div>
        ))}

        <IconButton
          title="Add"
          onClick={() => onChange([...list, { href: "", label: "" }])}
        >
          Add menu item
        </IconButton>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
        <h3 className="text-sm font-medium mb-2">Link Examples</h3>
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <strong>Section links:</strong> /#services, /#about, /#contact
          </div>
          <div>
            <strong>Page links:</strong> /blog, /custom-page
          </div>
          <div>
            <strong>External links:</strong> https://example.com
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/5">
        <h3 className="text-sm font-medium mb-2">Header Settings</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Customize the header appearance and call-to-action button.
        </p>
      </div>

      <Field label="Call-to-Action Button Text">
        <TextInput
          value={v.ctaText || "Book a call"}
          onChange={(e) => up("ctaText", e.target.value)}
          placeholder="Book a call"
        />
      </Field>

      <Field label="Call-to-Action Button URL">
        <TextInput
          value={v.ctaUrl || ""}
          onChange={(e) => up("ctaUrl", e.target.value)}
          placeholder="https://calendly.com/your-link"
        />
      </Field>

      <Field label="Logo Alt Text">
        <TextInput
          value={v.logoAlt || "Your Agency"}
          onChange={(e) => up("logoAlt", e.target.value)}
          placeholder="Your Agency"
        />
      </Field>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
        <h3 className="text-sm font-medium mb-2">Note</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Logo and navigation are managed in Settings and Navigation sections
          respectively.
        </p>
      </div>
    </div>
  );
}

function FooterEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const v = value || {};
  const up = (k: string, val: any) => onChange({ ...v, [k]: val });
  const footerLinks: any[] = Array.isArray(v.footerLinks)
    ? v.footerLinks
    : [
        { href: "#services", label: "Services" },
        { href: "#process", label: "Process" },
        { href: "#case-studies", label: "Case Studies" },
        { href: "#about", label: "About" },
        { href: "#contact", label: "Contact" },
      ];
  const socialLinks: any[] = Array.isArray(v.socialLinks)
    ? v.socialLinks
    : [
        { href: "#", label: "Instagram", icon: "instagram" },
        { href: "#", label: "LinkedIn", icon: "linkedin" },
        { href: "#", label: "Email", icon: "email" },
      ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/5">
        <h3 className="text-sm font-medium mb-2">Footer Settings</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Customize footer content, links, and company information.
        </p>
      </div>

      <Field label="Company Name">
        <TextInput
          value={v.companyName || "Your Agency"}
          onChange={(e) => up("companyName", e.target.value)}
          placeholder="Your Agency"
        />
      </Field>

      <Field label="Company Description">
        <Textarea
          rows={2}
          value={
            v.companyDescription ||
            "Professional web solutions for growing businesses."
          }
          onChange={(e) => up("companyDescription", e.target.value)}
          placeholder="Professional web solutions for growing businesses."
        />
      </Field>

      <Field label="Copyright Text">
        <TextInput
          value={v.copyrightText || "Your Agency"}
          onChange={(e) => up("copyrightText", e.target.value)}
          placeholder="Your Agency"
        />
      </Field>

      <div className="space-y-2">
        <Label>Footer Navigation Links</Label>
        {footerLinks.map((link, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <TextInput
              placeholder="Label"
              value={link.label || ""}
              onChange={(e) => {
                const arr = [...footerLinks];
                arr[i] = { ...arr[i], label: e.target.value };
                up("footerLinks", arr);
              }}
            />
            <TextInput
              placeholder="Link"
              value={link.href || ""}
              onChange={(e) => {
                const arr = [...footerLinks];
                arr[i] = { ...arr[i], href: e.target.value };
                up("footerLinks", arr);
              }}
            />
            <div className="col-span-2 flex justify-end">
              <IconButton
                title="Remove"
                onClick={() =>
                  up(
                    "footerLinks",
                    footerLinks.filter((_, idx) => idx !== i)
                  )
                }
              >
                Remove
              </IconButton>
            </div>
          </div>
        ))}
        <IconButton
          title="Add"
          onClick={() =>
            up("footerLinks", [...footerLinks, { href: "", label: "" }])
          }
        >
          Add footer link
        </IconButton>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
        <h3 className="text-sm font-medium mb-2">Contact Information</h3>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Email, phone, and social media links are managed in the{" "}
          <strong>Contact</strong> section. The footer will automatically
          display the contact information you set there.
        </div>
      </div>
    </div>
  );
}

function getSectionLabel(tab: SectionKey): string {
  const home = HOME_SECTIONS.find((s) => s.key === tab)?.label;
  if (home) return home;
  if (tab === "posts") return "Posts";
  if (tab === "wireframe") return "Homepage Wireframe";
  if (tab === "navigation") return "Navigation Menu";
  if (tab === "header") return "Header Settings";
  if (tab === "footer") return "Footer Settings";
  if (tab === "schema") return "Schema (JSON‑LD)";
  if (tab === "brand") return "Brand";
  if (tab === "settings") return "Settings";
  return String(tab);
}
