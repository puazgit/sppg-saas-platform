/**
 * Searchable Select Component
 * Enhanced dropdown dengan search functionality untuk regions data
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Check, ChevronsUpDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface Option {
  id: string
  name: string
  code?: string
  type?: string
}

interface SearchableSelectProps {
  options: Option[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  loading?: boolean
  error?: boolean
  emptyText?: string
  className?: string
  showCode?: boolean
}

export function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  disabled = false,
  loading = false,
  error = false,
  emptyText = "Tidak ada data ditemukan",
  className,
  showCode = false
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  // Filter options berdasarkan search
  const filteredOptions = useMemo(() => {
    if (!searchValue) return options
    
    const searchLower = searchValue.toLowerCase()
    return options.filter(option => 
      option.name.toLowerCase().includes(searchLower) ||
      (option.code && option.code.toLowerCase().includes(searchLower))
    )
  }, [options, searchValue])

  // Get selected option
  const selectedOption = options.find(option => option.id === value)

  // Clear selection
  const clearSelection = () => {
    onValueChange("")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            error && "border-red-500",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          disabled={disabled || loading}
        >
          <div className="flex items-center gap-2 flex-1 text-left">
            {loading ? (
              <span className="text-muted-foreground">Memuat...</span>
            ) : selectedOption ? (
              <span className="truncate">
                {selectedOption.name}
                {showCode && selectedOption.code && (
                  <span className="text-muted-foreground ml-2">({selectedOption.code})</span>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {selectedOption && !disabled && (
              <X 
                className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation()
                  clearSelection()
                }}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-0 focus:ring-0 focus-visible:ring-0 shadow-none"
            />
          </div>
          
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={(currentValue: string) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchValue("")
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <span>{option.name}</span>
                    {showCode && option.code && (
                      <span className="text-muted-foreground ml-2">({option.code})</span>
                    )}
                    {option.type && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {option.type}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}