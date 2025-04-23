import React from "react"
import { LoginForm } from "@/components/login-form"
import Modal from "@/components/animata/overlay/modal";

export default function Page() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Modal>
                    <LoginForm />
                </Modal>
            </div>
        </div>
    )
}
