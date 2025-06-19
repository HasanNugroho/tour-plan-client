"use client"

import React from "react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { TableFilters } from "@/components/filter-table"
import { requestAPI } from "@/lib/apiHelper"

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
            const isActiveFilter =
                filters.category === "true"
                    ? true
                    : filters.category === "false"
                        ? false
                        : undefined;

            const res = await requestAPI('get', '/tenants', {
                page,
                limit,
                order,
                orderBy,
                keyword,
                isActive: isActiveFilter
            }, { isPublic: false }) as {
                data: Tenant[],
                meta: { itemCount: number }
            }

            setData(res.data)
            setTotalItems(res.meta.itemCount)
        }

        fetchData()
    }, [page, limit, order, orderBy, keyword, filters])

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
                        {/* <TableFiltersDate
                            filters={filters}
                            onFilterChange={setFilters}
                        /> */}
                    </>
                }

            />
        </div>
    )
}
