"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

/**
 * Lightweight phone input with country selector (default ZA).
 * - Stores value as E.164-like string (e.g. +27 82 123 4567).
 * - Formats basic spacing for ZA/BW/NA. Falls back to plain spacing for others.
 * - No external deps to keep the bundle small and mobile-friendly.
 */

type Country = {
  code: "ZA" | "BW" | "NA"
  name: string
  dial: string
  flag: string
  formatBlocks: number[] // how we group digits after the national leading zero is removed
}

const COUNTRIES: Country[] = [
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦", formatBlocks: [2, 3, 4] }, // 82 123 4567
  { code: "BW", name: "Botswana", dial: "+267", flag: "🇧🇼", formatBlocks: [2, 3, 3] }, // 71 234 567
  { code: "NA", name: "Namibia", dial: "+264", flag: "🇳🇦", formatBlocks: [2, 3, 4] }, // 81 123 4567
]

function formatLocalDigits(digits: string, blocks: number[]) {
  const parts: string[] = []
  let i = 0
  for (const block of blocks) {
    const end = i + block
    const chunk = digits.slice(i, end)
    if (!chunk) break
    parts.push(chunk)
    i = end
  }
  // append any remainder
  if (i < digits.length) parts.push(digits.slice(i))
  return parts.join(" ")
}

function toLocalDigits(raw: string) {
  return raw.replace(/\D/g, "")
}

export type PhoneInputValue = {
  country: Country["code"]
  e164: string // e.g. +27 82 123 4567 (kept with spaces for readability)
}

export function PhoneInput({
  id,
  label,
  helperText,
  value,
  onChange,
  required,
  className,
}: {
  id: string
  label: string
  helperText?: string
  value: PhoneInputValue
  onChange: (v: PhoneInputValue) => void
  required?: boolean
  className?: string
}) {
  const country = useMemo(() => COUNTRIES.find((c) => c.code === value.country) ?? COUNTRIES[0], [value.country])
  const [local, setLocal] = useState(() => {
    // derive local digits from e164 if present (best effort)
    const digits = value.e164.replace(/\D/g, "")
    const dialDigits = country.dial.replace(/\D/g, "")
    const stripped = digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits
    return stripped
  })

  const display = useMemo(() => {
    const clean = toLocalDigits(local)
    return `${country.dial} ${formatLocalDigits(clean, country.formatBlocks)}`
  }, [country, local])

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = toLocalDigits(e.target.value)
    setLocal(clean)
    onChange({
      country: country.code,
      e164: `${country.dial} ${formatLocalDigits(clean, country.formatBlocks)}`.trim(),
    })
  }

  const handleCountryChange = (code: Country["code"]) => {
    const next = COUNTRIES.find((c) => c.code === code) ?? country
    // remap formatting to new country blocks
    onChange({
      country: next.code,
      e164: `${next.dial} ${formatLocalDigits(toLocalDigits(local), next.formatBlocks)}`.trim(),
    })
  }

  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={id} className="text-gray-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </Label>
      <div className="mt-1 flex items-stretch gap-2">
        <Select value={country.code} onValueChange={(val) => handleCountryChange(val as Country["code"])}>
          <SelectTrigger className="w-[120px] rounded-xl">
            <SelectValue placeholder="Country" aria-label={`${country.name} ${country.dial}`}>
              <div className="flex items-center gap-2">
                <span aria-hidden>{country.flag}</span>
                <span className="text-sm">{country.dial}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <div className="flex items-center gap-2">
                  <span aria-hidden>{c.flag}</span>
                  <span>{c.name}</span>
                  <span className="ml-2 text-muted-foreground">{c.dial}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          id={id}
          inputMode="tel"
          autoComplete="tel"
          placeholder={`${country.dial} 82 123 4567`}
          value={display}
          onChange={handleLocalChange}
          className="rounded-xl flex-1"
          aria-describedby={`${id}-help`}
          required={required}
        />
      </div>
      {helperText ? (
        <p id={`${id}-help`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
