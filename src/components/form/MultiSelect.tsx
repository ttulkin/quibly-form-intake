
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

const MultiSelect = ({ 
  options, 
  selected, 
  onChange, 
  placeholder = "Select items", 
  allowCustom = false 
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else {
      onChange([...selected, item]);
    }
    // Keep focus on input
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRemove = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && inputValue && allowCustom && !options.includes(inputValue) && !selected.includes(inputValue)) {
      e.preventDefault();
      onChange([...selected, inputValue]);
      setInputValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left h-auto min-h-10 px-3 py-2"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selected.map((item) => (
              <Badge key={item} variant="secondary" className="mr-1 mb-1">
                {item}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                >
                  <X size={14} />
                </Button>
              </Badge>
            ))}
          </div>
          <ChevronsUpDown size={16} className="flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command onKeyDown={handleKeyDown}>
          <CommandInput 
            placeholder="Search..." 
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {allowCustom ? (
                <div className="px-2 py-3">
                  <div className="text-sm text-muted-foreground mb-1">No item found.</div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      if (inputValue && !selected.includes(inputValue)) {
                        onChange([...selected, inputValue]);
                        setInputValue("");
                      }
                    }}
                  >
                    Add "{inputValue}"
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-center text-sm">No results found.</div>
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options
                .filter(option => !inputValue || option.toLowerCase().includes(inputValue.toLowerCase()))
                .map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className="flex items-center justify-between"
                  >
                    <span>{option}</span>
                    {selected.includes(option) && (
                      <Check size={16} className="text-primary" />
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
