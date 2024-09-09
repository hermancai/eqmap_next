"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

interface AboutSectionProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AboutSection({ show, setShow }: AboutSectionProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "100%", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-0 w-full bg-white p-8 gap-6 flex flex-col"
                >
                    <div className="flex flex-col gap-3">
                        <p className="text-xl">Search Parameters</p>
                        <p>
                            Start/End:{" "}
                            <span className="font-light">
                                Choose a date range. The start date must be
                                earlier than today. The end date must be after
                                the start date.
                            </span>
                        </p>
                        <p>
                            Magnitude Range:{" "}
                            <span className="font-light">
                                Choose a range of minimum and maximum
                                magnitudes.
                            </span>
                        </p>
                        <p>
                            Search Radius:{" "}
                            <span className="font-light">
                                Choose a radius in kilometers, represented by
                                the gray circle around the map pin. The Earth
                                has a circumference of about 40,000 kilometers.
                            </span>
                        </p>
                        <p>
                            Results:{" "}
                            <span className="font-light">
                                Choose a limit on the number of earthquakes to
                                be found. Priority is given to events with
                                higher magnitude.
                            </span>
                        </p>
                    </div>

                    <span className="h-0 border-t w-full border-slate-300" />

                    <p>
                        Data Source: U.S. Geological Survey
                        <br />
                        <span className="font-light">Built by </span>
                        <Link
                            href="https://hermancai.dev"
                            target="_blank"
                            className="underline cursor-pointer"
                        >
                            Herman Cai
                        </Link>
                    </p>

                    <ArrowDownIcon
                        className="h-7 shrink-0 self-end mt-auto text-slate-500 cursor-pointer hover:text-slate-800 transition-colors duration-200"
                        onClick={() => setShow(!show)}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
