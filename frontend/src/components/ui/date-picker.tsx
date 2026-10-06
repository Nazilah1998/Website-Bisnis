"use client"

import * as React from "react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  name: string
  defaultValue?: string
  required?: boolean
  className?: string
}

export function DatePicker({ name, defaultValue, required, className }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined
  )

  // hidden input value mapping format yyyy-MM-dd
  const stringValue = date ? format(date, "yyyy-MM-dd") : ""

  return (
    <div className="relative">
      <input 
        type="hidden" 
        name={name} 
        value={stringValue} 
        required={required} 
      />
      <Popover>
        <PopoverTrigger render={
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal border-zinc-200 dark:border-zinc-800 bg-transparent h-9",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "d MMMM yyyy", { locale: localeId }) : <span>Pilih tanggal</span>}
          </Button>
        } />
        <PopoverContent className="w-auto p-0 border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
