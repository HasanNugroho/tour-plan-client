"use client"

import React from "react"
import axios from "axios"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { TableFilters, TableFiltersDate } from "@/components/filter-table"

export type Tenant = {
    id: string
    name: string
    code: string
    description: string
    address: string
    contactInfo: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export default function TenantsPage() {
    const [data, setData] = React.useState<Tenant[]>([])
    const [page, setPage] = React.useState(1)
    const [limit, setLimit] = React.useState(10)
    const [totalItems, setTotalItems] = React.useState(0)

    const [keyword, setKeyword] = React.useState("")
    const [orderBy, setOrderBy] = React.useState("updated_at")
    const [order, setOrder] = React.useState<"ASC" | "DESC">("ASC")
    const [filters, setFilters] = React.useState<Record<string, string>>({})

    React.useEffect(() => {
        const fetchData = async () => {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNkMWIyMzRiLWMwYzUtNGU3ZC04ZGNiLWU0N2IwNjcxZmNjMCIsImlhdCI6MTc1MDMwNjcwNiwiZXhwIjoxNzUwMzEzOTA2fQ.aaLyrX1_BxNU3vy8NMTzXD-mSVhXtDGnjRoKdOeWamg'
            const isActiveFilter =
                filters.category === "true"
                    ? true
                    : filters.category === "false"
                        ? false
                        : undefined;
            console.log(isActiveFilter)
            const res = await axios.get("http://localhost:3001/api/tenants", {
                params: {
                    page,
                    limit,
                    order,
                    orderBy,
                    keyword,
                    isActive: isActiveFilter

                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setData(res.data.data)
            setTotalItems(res.data.meta.itemCount)
        }

        fetchData()
    }, [page, limit, keyword, orderBy, order, filters])

    return (
        <div className="p-4">
            <DataTable
                columns={columns}
                data={data}
                page={page}
                limit={limit}
                onLimitChange={setLimit}
                totalItems={totalItems}
                onPageChange={setPage}
                orderBy={orderBy}
                order={order}
                onSortChange={(by: string, ord: "ASC" | "DESC") => {
                    setOrderBy(by)
                    setOrder(ord)
                }}
                keyword={keyword}
                onKeywordChange={(value: string) => {
                    setPage(1)
                    setKeyword(value)
                }}
                filters={filters}
                onFilterChange={(newFilters: Record<string, string>) => {
                    setFilters(newFilters)
                    setPage(1)
                }}
                toolbar={
                    <>
                        <TableFilters
                            filters={filters}
                            onFilterChange={setFilters}
                            categories={[
                                { label: "Active", value: "true" },
                                { label: "InActive", value: "false" },
                            ]}
                        />
                        <TableFiltersDate
                            filters={filters}
                            onFilterChange={setFilters}
                        />
                    </>
                }

            />
        </div>
    )
}
