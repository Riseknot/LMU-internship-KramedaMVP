import { Edit, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

type EditFieldProps = {
  label: string;
  value: string;
  icon?: LucideIcon;
  field?: string;
  email?: string;
  onUpdateState?: (field: string, value: string) => void;
  displayValue?: string;
  placeholder?: string;
  editable?: boolean;
  underline?: boolean;
  showLabel?: boolean;
};

const ROW_BASE = "flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left text-neutral-800";
const ROW_HOVER = "transition-colors hover:bg-primary-50/60";
const TEXT_BASE = "text-sm leading-6 sm:text-[15px]";
const INPUT_BASE = "min-w-55 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500";
const BTN_PRIMARY = "btn-base btn-secondary px-3 py-1.5 text-xs";
const BTN_SECONDARY = "btn-base btn-ghost px-3 py-1.5 text-xs";

export default function EditField({
  label,
  value,
  icon: Icon,
  field,
  email,
  onUpdateState,
  displayValue,
  placeholder,
  editable = true,
  underline = false,
  showLabel = true,
}: EditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSave = async () => {
    if (!field || !email) return;

    try {
      const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: inputValue }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Update failed", errorData);
        return;
      }

      if (onUpdateState) onUpdateState(field, inputValue);

      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  const startEdit = () => {
    if (!editable) return;
    setIsEditing(true);
  };

  const shownValue = displayValue || value || "Nicht angegeben";
  const rowTextClass = `${TEXT_BASE} ${underline ? "underline decoration-neutral-400 underline-offset-2" : ""}`;
  const rowText = showLabel ? `${label}: ${shownValue}` : shownValue;
  const hasHeader = Boolean(Icon) || showLabel;

  return (
    <div className="space-y-2">
      {isEditing ? (
        <div className="space-y-2 rounded-xl border border-primary-200 bg-white p-3">
          {hasHeader && (
            <div className="flex items-center gap-3 text-neutral-800">
              {Icon && <Icon className="h-4 w-4 shrink-0 text-primary-700" />}
              {showLabel && <span className={rowTextClass}>{label}</span>}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className={INPUT_BASE}
            />
            <button type="button" onClick={handleSave} className={BTN_PRIMARY}>
              Speichern
            </button>
            <button type="button" onClick={handleCancel} className={BTN_SECONDARY}>
              Abbrechen
            </button>
          </div>
        </div>
      ) : editable ? (
        <button type="button" onClick={startEdit} className={`${ROW_BASE} ${ROW_HOVER}`}>
          {Icon && <Icon className="h-4 w-4 shrink-0 text-primary-700" />}
          <span className={`${rowTextClass} flex-1`}>
            {rowText}
          </span>
          <Edit className="h-3.5 w-3.5 text-primary-500" />
        </button>
      ) : (
        <div className={ROW_BASE}>
          {Icon && <Icon className="h-4 w-4 shrink-0 text-primary-700" />}
          <span className={rowTextClass}>
            {rowText}
          </span>
        </div>
      )}
    </div>
  );
}