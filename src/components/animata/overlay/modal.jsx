import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

// lg, sm
export default function Modal({ modalSize = "lg", children }) {
    return (
        <div>
            <AnimatePresence>
                <div
                    className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-y-scroll bg-slate-900/20 p-8 backdrop-blur"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "180deg" }}
                        animate={{
                            scale: 1,
                            rotate: "0deg",
                            transition: {
                                type: "spring",
                                bounce: 0.25,
                            },
                        }}
                        exit={{ scale: 0, rotate: "180deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            "relative w-full max-w-lg cursor-default overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 p-6 text-white shadow-2xl",
                            {
                                "max-w-sm": modalSize === "sm",
                            },
                        )}
                    >
                        {children}
                    </motion.div>
                </div>
            </AnimatePresence>
        </div>
    );
}
