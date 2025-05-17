import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isValid, getDaysInMonth, getDay, getMonth, getYear, addMonths, subMonths } from "date-fns";
import { cn } from "~/lib/utils";
import { Button } from "./button";

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | null;
  onSelect?: (date: Date | null) => void;
  disabled?: (date: Date) => boolean;
  initialFocus?: boolean;
};

export function Calendar({
  className,
  mode = "single",
  selected,
  onSelect,
  disabled,
  initialFocus,
  ...props
}: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(() => {
    if (mode === "single" && selected instanceof Date && isValid(selected)) {
      return selected;
    }
    return new Date();
  });

  const daysInMonth = getDaysInMonth(viewDate);
  const startDay = getDay(new Date(getYear(viewDate), getMonth(viewDate), 1));
  const days = React.useMemo(() => {
    const days = [];
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(getYear(viewDate), getMonth(viewDate), i));
    }
    return days;
  }, [viewDate, startDay, daysInMonth]);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setViewDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => addMonths(prev, 1));
  };

  const isSelected = (date: Date) => {
    if (!selected) return false;
    if (mode === "single" && selected instanceof Date) {
      return (
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      );
    }
    return false;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleSelectDate = (date: Date) => {
    if (disabled?.(date)) return;
    onSelect?.(date);
  };

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {format(viewDate, "MMMM yyyy")}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }

          const isDisabled = disabled?.(day) || false;
          const isDateSelected = isSelected(day);
          const isCurrentDay = isToday(day);

          return (
            <Button
              key={day.toString()}
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 p-0 font-normal",
                isDateSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isCurrentDay && !isDateSelected && "border border-primary",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={isDisabled}
              onClick={() => handleSelectDate(day)}
            >
              {day.getDate()}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
