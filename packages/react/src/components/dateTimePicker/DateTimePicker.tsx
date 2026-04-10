import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

import { DateTimePickerProps as CoreDateTimePickerProps } from "../../core-types/dateTimePicker/date-time-picker.interface";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import { concatClassNames } from "../utils";

import styles from "./DateTimePicker.module.scss";

interface DateTimePickerProps
  extends CoreDateTimePickerProps, Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "onChange"> {}

const WEEK_DAYS = ["lu", "ma", "me", "je", "ve", "sa", "di"];
const MONTH_NAMES = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDate(date: Date, showTime: boolean): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  if (!showTime) return `${dd}/${mm}/${yyyy}`;
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}h${min}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      id,
      label,
      required = false,
      disabled = false,
      readOnly = false,
      value = null,
      onChange,
      showTime = false,
      placeholder,
      error = false,
      assistiveText,
      className,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const hoursListRef = useRef<HTMLDivElement>(null);
    const minutesListRef = useRef<HTMLDivElement>(null);

    const now = new Date();
    const [viewYear, setViewYear] = useState(value ? value.getFullYear() : now.getFullYear());
    const [viewMonth, setViewMonth] = useState(value ? value.getMonth() : now.getMonth());

    const [selectedDate, setSelectedDate] = useState<Date | null>(value);
    const [selectedHour, setSelectedHour] = useState(value ? value.getHours() : 0);
    const [selectedMinute, setSelectedMinute] = useState(value ? value.getMinutes() : 0);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    useEffect(() => {
      if (value) {
        setSelectedDate(value);
        setSelectedHour(value.getHours());
        setSelectedMinute(value.getMinutes());
        setViewYear(value.getFullYear());
        setViewMonth(value.getMonth());
      } else {
        setSelectedDate(null);
      }
    }, [value]);

    useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
      if (isOpen && hoursListRef.current) {
        const selectedEl = hoursListRef.current.querySelector("[data-selected='true']");
        if (selectedEl) selectedEl.scrollIntoView({ block: "center" });
      }
      if (isOpen && minutesListRef.current) {
        const selectedEl = minutesListRef.current.querySelector("[data-selected='true']");
        if (selectedEl) selectedEl.scrollIntoView({ block: "center" });
      }
    }, [isOpen]);

    const handleToggle = () => {
      if (disabled || readOnly) return;
      setIsOpen((prev) => !prev);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedDate(null);
      setSelectedHour(0);
      setSelectedMinute(0);
      onChange?.(null);
      setIsOpen(false);
    };

    const handlePrevMonth = () => {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((y) => y - 1);
      } else {
        setViewMonth((m) => m - 1);
      }
    };

    const handleNextMonth = () => {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      } else {
        setViewMonth((m) => m + 1);
      }
    };

    const handleDayClick = (day: number, month: number, year: number) => {
      const newDate = new Date(year, month, day, selectedHour, selectedMinute);
      setSelectedDate(newDate);
      if (!showTime) {
        onChange?.(newDate);
        setIsOpen(false);
      }
    };

    const handleHourClick = (hour: number) => {
      setSelectedHour(hour);
      if (selectedDate) {
        const newDate = new Date(selectedDate);
        newDate.setHours(hour);
        setSelectedDate(newDate);
      }
    };

    const handleMinuteClick = (minute: number) => {
      setSelectedMinute(minute);
      if (selectedDate) {
        const newDate = new Date(selectedDate);
        newDate.setMinutes(minute);
        setSelectedDate(newDate);
      }
    };

    const handleConfirm = () => {
      if (selectedDate) {
        const finalDate = new Date(selectedDate);
        finalDate.setHours(selectedHour);
        finalDate.setMinutes(selectedMinute);
        onChange?.(finalDate);
      }
      setIsOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const renderCalendarDays = () => {
      const daysInMonth = getDaysInMonth(viewYear, viewMonth);
      const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

      const days: React.ReactNode[] = [];

      for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        days.push(
          <button
            key={`prev-${day}`}
            type="button"
            className={styles.day}
            data-outside="true"
            onClick={() => handleDayClick(day, prevMonth, prevYear)}
          >
            {day}
          </button>,
        );
      }

      const today = new Date();
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = isSameDay(new Date(viewYear, viewMonth, day), today);
        const isSelected = selectedDate ? isSameDay(new Date(viewYear, viewMonth, day), selectedDate) : false;
        days.push(
          <button
            key={`cur-${day}`}
            type="button"
            className={styles.day}
            data-today={isToday}
            data-selected={isSelected}
            onClick={() => handleDayClick(day, viewMonth, viewYear)}
          >
            {day}
          </button>,
        );
      }

      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const remaining = 42 - days.length;
      for (let day = 1; day <= remaining; day++) {
        days.push(
          <button
            key={`next-${day}`}
            type="button"
            className={styles.day}
            data-outside="true"
            onClick={() => handleDayClick(day, nextMonth, nextYear)}
          >
            {day}
          </button>,
        );
      }

      return days;
    };

    const displayValue = value ? formatDate(value, showTime) : null;
    const defaultPlaceholder = showTime ? "JJ/MM/AAAA HHhMM" : "JJ/MM/AAAA";

    return (
      <div
        ref={mergedRef}
        id={id}
        className={concatClassNames(styles.dateTimePicker, className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {label && (
          <div className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </div>
        )}

        <div
          className={styles.inputContainer}
          data-open={isOpen}
          data-error={error}
          data-disabled={disabled}
          onClick={handleToggle}
        >
          {displayValue ? (
            <span className={styles.inputValue}>{displayValue}</span>
          ) : (
            <span className={styles.inputPlaceholder}>{placeholder || defaultPlaceholder}</span>
          )}
          <div className={styles.inputIcons}>
            {value && !disabled && !readOnly && (
              <button type="button" className={styles.iconButton} onClick={handleClear} aria-label="Effacer">
                <Icon name="cancel" size={16} />
              </button>
            )}
            <span className={styles.iconButton}>
              <Icon name="calendar-today-outlined" size={20} />
            </span>
          </div>
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={handlePrevMonth}
                  aria-label="Mois précédent"
                >
                  <Icon name="arrow-chevron-left" size={20} />
                </button>
                <span className={styles.calendarTitle}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button type="button" className={styles.navButton} onClick={handleNextMonth} aria-label="Mois suivant">
                  <Icon name="arrow-chevron-right" size={20} />
                </button>
              </div>

              <div className={styles.weekDays}>
                {WEEK_DAYS.map((d) => (
                  <div key={d} className={styles.weekDay}>
                    {d}
                  </div>
                ))}
              </div>

              <div className={styles.days}>{renderCalendarDays()}</div>
            </div>

            {showTime && (
              <div className={styles.timePicker}>
                <div className={styles.timePickerTitle}>Sélectionner l&apos;heure</div>
                <div className={styles.timeColumns}>
                  <div className={styles.timeColumn}>
                    <div className={styles.timeColumnLabel}>Heures</div>
                    <div className={styles.timeList} ref={hoursListRef}>
                      {HOURS.map((h) => (
                        <button
                          key={h}
                          type="button"
                          className={styles.timeItem}
                          data-selected={h === selectedHour}
                          onClick={() => handleHourClick(h)}
                        >
                          {String(h).padStart(2, "0")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.timeSeparator}>:</div>
                  <div className={styles.timeColumn}>
                    <div className={styles.timeColumnLabel}>Minutes</div>
                    <div className={styles.timeList} ref={minutesListRef}>
                      {MINUTES.map((m) => (
                        <button
                          key={m}
                          type="button"
                          className={styles.timeItem}
                          data-selected={m === selectedMinute}
                          onClick={() => handleMinuteClick(m)}
                        >
                          {String(m).padStart(2, "0")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.confirmButton}>
                  <Button variant="primary" label="Confirmer" onClick={handleConfirm} size="s" />
                </div>
              </div>
            )}
          </div>
        )}

        {assistiveText && (
          <div className={styles.assistiveText} data-error={error}>
            {assistiveText}
          </div>
        )}
      </div>
    );
  },
);

export default DateTimePicker;
