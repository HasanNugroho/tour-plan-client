import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type FilterProps = {
    filters: Record<string, string>
    onFilterChange: (filters: Record<string, string>) => void
    categories?: { label: string; value: string }[]
}

export function TableFilters({ filters, onFilterChange, categories = [] }: FilterProps) {
    return (
        <div className="flex gap-2 flex-wrap">
            {categories.length > 0 && (
                <Select
                    value={filters?.category ?? ""}
                    onValueChange={(val) => onFilterChange({ ...filters, category: val })}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}
export function TableFiltersDate({ filters, onFilterChange }: FilterProps) {
    const dateValue: DateRange | undefined = filters.startDate && filters.endDate
        ? { from: new Date(filters.startDate), to: new Date(filters.endDate) }
        : undefined

    return (
        <div className="flex gap-2 flex-wrap">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn("w-[250px] justify-start text-left font-normal", !dateValue && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateValue?.from ? (
                            dateValue.to ? (
                                <>
                                    {format(dateValue.from, "dd MMM yyyy")} - {format(dateValue.to, "dd MMM yyyy")}
                                </>
                            ) : (
                                format(dateValue.from, "dd MMM yyyy")
                            )
                        ) : (
                            <span>Date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateValue?.from}
                        selected={dateValue}
                        onSelect={(range) => {
                            const start = range?.from?.toISOString() ?? ""
                            const end = range?.to?.toISOString() ?? ""
                            onFilterChange({ ...filters, startDate: start, endDate: end })
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
