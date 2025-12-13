import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, X, Filter, Calendar } from "lucide-react";
import { Button, DatePicker, SelectField } from "@/components/ui";

export interface PeriodOption {
  value: string;
  label: string;
}

export interface TableSearchProps {
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Date Range
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  showDateRange?: boolean;

  // Period Filter
  period?: string;
  onPeriodChange?: (period: string) => void;
  periodOptions?: PeriodOption[];
  showPeriod?: boolean;

  // Order By
  orderBy?: string;
  onOrderByChange?: (field: string) => void;
  orderByOptions?: { value: string; label: string }[];
  showOrderBy?: boolean;

  // Sort Direction
  sortDirection?: "ASC" | "DESC";
  onSortDirectionChange?: (direction: "ASC" | "DESC") => void;
  showSortDirection?: boolean;

  // Active Filter
  isActive?: boolean | null;
  onIsActiveChange?: (isActive: boolean | null) => void;
  showActiveFilter?: boolean;

  // Actions
  onSearch?: () => void;
  onReset?: () => void;

  // Styling
  className?: string;
  layout?: "vertical" | "horizontal";
}

const defaultPeriodOptions: PeriodOption[] = [
  { value: "", label: "Semua Periode" },
  { value: "Today", label: "Hari Ini" },
  { value: "ThisWeek", label: "Minggu Ini" },
  { value: "LastWeek", label: "Minggu Lalu" },
  { value: "ThisMonth", label: "Bulan Ini" },
  { value: "LastMonth", label: "Bulan Lalu" },
  { value: "ThisYear", label: "Tahun Ini" },
  { value: "LastYear", label: "Tahun Lalu" },
  { value: "Last3Months", label: "3 Bulan Terakhir" },
  { value: "Last6Months", label: "6 Bulan Terakhir" },
];

export default function TableSearch({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Cari data...",
  startDate = "",
  endDate = "",
  onStartDateChange,
  onEndDateChange,
  showDateRange = false,
  period = "",
  onPeriodChange,
  periodOptions = defaultPeriodOptions,
  showPeriod = false,
  orderBy = "",
  onOrderByChange,
  orderByOptions = [],
  showOrderBy = false,
  sortDirection = "DESC",
  onSortDirectionChange,
  showSortDirection = false,
  isActive,
  onIsActiveChange,
  showActiveFilter = false,
  onSearch,
  onReset,
  className,
  layout = "vertical",
}: TableSearchProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setLocalSearch("");
    if (onReset) {
      onReset();
    }
  };

  const hasActiveFilters =
    (showDateRange && (startDate || endDate)) ||
    (showPeriod && period) ||
    (showOrderBy && orderBy) ||
    (showActiveFilter && isActive !== null);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            placeholder={searchPlaceholder}
            className={cn(
              "w-full pl-10 pr-10 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "placeholder:text-gray-400"
            )}
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="primary"
            onClick={handleSearch}
            leftIcon={Search}
          >
            Cari
          </Button>

          {(showDateRange ||
            showPeriod ||
            showOrderBy ||
            showSortDirection ||
            showActiveFilter) && (
            <Button
              type="button"
              variant={hasActiveFilters ? "primary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={Filter}
            >
              Filter
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-white text-blue-600 rounded-full text-xs font-semibold">
                  •
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Filter size={16} />
              Filter Pencarian
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div
            className={cn(
              "grid gap-4",
              layout === "horizontal"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2"
            )}
          >
            {/* Period Filter */}
            {showPeriod && (
              <SelectField
                label="Periode"
                value={period}
                onChange={(e) => onPeriodChange?.(e.target.value)}
                options={periodOptions}
                placeholder="Pilih periode"
              />
            )}

            {/* Date Range */}
            {showDateRange && (
              <>
                <DatePicker
                  label="Tanggal Mulai"
                  value={startDate}
                  onChange={(e) => onStartDateChange?.(e.target.value)}
                  showIcon
                />
                <DatePicker
                  label="Tanggal Akhir"
                  value={endDate}
                  onChange={(e) => onEndDateChange?.(e.target.value)}
                  showIcon
                />
              </>
            )}

            {/* Order By */}
            {showOrderBy && orderByOptions.length > 0 && (
              <SelectField
                label="Urutkan Berdasarkan"
                value={orderBy}
                onChange={(e) => onOrderByChange?.(e.target.value)}
                options={orderByOptions}
                placeholder="Pilih field"
              />
            )}

            {/* Sort Direction */}
            {showSortDirection && (
              <SelectField
                label="Arah Pengurutan"
                value={sortDirection}
                onChange={(e) =>
                  onSortDirectionChange?.(e.target.value as "ASC" | "DESC")
                }
                options={[
                  { value: "ASC", label: "A-Z (Ascending)" },
                  { value: "DESC", label: "Z-A (Descending)" },
                ]}
              />
            )}

            {/* Active Filter */}
            {showActiveFilter && (
              <SelectField
                label="Status Aktif"
                value={
                  isActive === null ? "" : isActive === true ? "true" : "false"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    onIsActiveChange?.(null);
                  } else {
                    onIsActiveChange?.(value === "true");
                  }
                }}
                options={[
                  { value: "", label: "Semua Status" },
                  { value: "true", label: "Aktif" },
                  { value: "false", label: "Tidak Aktif" },
                ]}
              />
            )}
          </div>

          {/* Apply Filters Button */}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(false)}
            >
              Tutup
            </Button>
            <Button type="button" variant="primary" onClick={handleSearch}>
              Terapkan Filter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
