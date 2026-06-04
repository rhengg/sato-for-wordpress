import React from 'react'
import { Outlet } from 'react-router-dom'
import AuthLayout from '../../layout/auth'

const Index = () => {
    return (
        <>
            <AuthLayout>
                <Outlet />
            </AuthLayout>
        </>
    )
}

export default Index