"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
    iconMap,
    icons,
} from "./icons";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IconPickerProps {
    value?: string;
    onChange: (value: string) => void;
}

export function IconPicker({
    value,
    onChange,
}: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return icons.filter((icon) =>
            icon.label
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search]);

    const SelectedIcon = value
        ? iconMap[value]
        : null;

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        onClick={() => setOpen(true)} // Manually open dialog
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon className="mr-2 h-5 w-5" />
            {icons.find((icon) => icon.value === value)?.label}
          </>
        ) : (
          "Select icon"
        )}
      </Button>

            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Select Icon
                    </DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                        placeholder="Search icon..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="pl-9"
                    />
                </div>

                <ScrollArea className="h-96">
                    <div className="grid grid-cols-4 gap-3 p-1 md:grid-cols-6">
                        {filtered.map((item) => {
                            const Icon = item.icon;

                            const selected =
                                value === item.value;

                            return (
                                <Button
                                    key={item.value}
                                    type="button"
                                    variant={
                                        selected
                                            ? "default"
                                            : "outline"
                                    }
                                    className="relative h-20 flex-col gap-2"
                                    onClick={() => {
                                        onChange(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    {selected && (
                                        <Check className="absolute right-2 top-2 h-3 w-3" />
                                    )}

                                    <Icon className="h-6 w-6" />

                                    <span className="line-clamp-1 text-[10px]">
                                        {item.label}
                                    </span>
                                </Button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}