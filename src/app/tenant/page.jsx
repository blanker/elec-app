'use client'
import { useEffect } from 'react'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useShallow } from 'zustand/react/shallow'
import useTenantStore from '@/store/useTenantStore';

export default function DemoPage() {

    const {
        tenants,
        fetchTenants,
        loading,
        error,
    } = useTenantStore(
        useShallow((state) => ({
            tenants: state.tenants,
            fetchTenants: state.fetchTenants,
            loading: state.loading,
            error: state.error,
        }))
    );

    useEffect(() => {
        fetchTenants();
    }, []);

    return (
        <div className="container mx-auto p-10">
            <DataTable columns={columns} data={tenants} />
        </div>
    )
}
