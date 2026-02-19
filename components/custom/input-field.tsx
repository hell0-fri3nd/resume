import React from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

interface InputFieldProps {
  label?: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  type?: React.HTMLInputTypeAttribute
  className?: string
  disabled?: boolean
}

const InputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    type = "text",
    className = "",
    disabled = false
}: InputFieldProps) => {
    return (
        <div className="space-y-2">
            {label && (
                <Label className="text-foreground font-semibold">
                {label} {required && <span className="text-red-500">*</span>}
                </Label>
            )}
            <Input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`bg-background border-border ${className}`}
            disabled={disabled}
            />
        </div>
    )
}

export default InputField
