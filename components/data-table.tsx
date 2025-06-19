"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    NoInfer,
    useReactTable,
} from "@tanstack/react-table"

import { ArrowUpDown, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]

    page: number

    limit: number
    onLimitChange: (limit: number) => void

    totalItems: number
    onPageChange: (page: number) => void

    orderBy: string
    order: "ASC" | "DESC"
    onSortChange: (orderBy: string, order: "ASC" | "DESC") => void

    keyword: string
    onKeywordChange: (value: string) => void

    filters?: Record<string, string>
    onFilterChange?: (filters: Record<string, string>) => void

    filterPlaceholder?: string
    toolbar?: React.ReactNode
}

export function DataTable<TData, TValue>({
    columns,
    data,
    page,
    limit,
    onLimitChange,
    totalItems,
    onPageChange,
    orderBy,
    order,
    onSortChange,
    keyword,
    onKeywordChange,
    filters,
    onFilterChange,
    filterPlaceholder = "Search...",
    toolbar,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder={filterPlaceholder}
                    value={keyword}
                    onChange={(e) => onKeywordChange(e.target.value)}
                    className="max-w-sm"
                />

                {toolbar ?? null}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible?.()}
                                onCheckedChange={(value) => column.toggleVisibility?.(!!value)}
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-sm border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            header.column.getCanSort() ? (
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        const current = header.column.id
                                                        const nextOrder =
                                                            orderBy === current && order === "ASC" ? "DESC" : "ASC"
                                                        onSortChange(current, nextOrder)
                                                    }}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    <ArrowUpDown className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {data.length ? (
                            data.map((_, rowIndex: number) => {
                                const row = table.getRowModel().rows[rowIndex]
                                return (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </div>

            <div className="flex items-center justify-between py-4 text-sm text-muted-foreground">
                <div>
                    Page {page} of {Math.ceil(totalItems / limit)} — Showing {data.length} item(s)
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows per page
                        </Label>
                        <Select
                            value={`${limit}`}
                            onValueChange={(value: string) => {
                                const newLimit = Number(value)
                                onLimitChange(newLimit)
                                onPageChange(1)
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue placeholder={limit} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page * limit >= totalItems}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}