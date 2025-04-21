"use client"

import React, { useEffect } from "react"
import { format, parseISO } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { zhCN as zhCNDayPicker } from "react-day-picker/locale";
import "react-day-picker/style.css";


export default function DateSelector({ date, setDate, disabledDays }) {
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[180px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        locale={zhCNDayPicker}
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={disabledDays}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </>
    )
}