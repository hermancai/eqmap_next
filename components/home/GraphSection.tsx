import { useState, ReactNode, useEffect } from "react";
import { EarthquakeData } from "@/types/USGS";
import { Collapse } from "@mui/material";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    BarElement,
    Tooltip,
    TimeScale,
    CategoryScale,
} from "chart.js";
import { Scatter, Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
    LinearScale,
    PointElement,
    BarElement,
    Tooltip,
    TimeScale,
    CategoryScale
);

type GraphSectionProps = {
    data: EarthquakeData[];
};

type GraphContainerProps = {
    title: string;
    children: ReactNode;
};

const GraphContainer = ({ title, children }: GraphContainerProps) => {
    const [showGraph, setShowGraph] = useState(true);

    return (
        <div className="bg-white overflow-hidden border border-slate-800 md:rounded md:shadow-sm md:shadow-black">
            <div
                className={`flex flex-row gap-2 items-center cursor-pointer p-2 sm:px-4 bg-slate-800 text-white ${
                    showGraph ? "" : ""
                } hover:text-orange-400 transiton-colors duration-200`}
                onClick={() => setShowGraph(!showGraph)}
            >
                <ChevronUpIcon
                    className={`h-5 ${
                        showGraph ? "rotate-0" : "rotate-180"
                    } transform duration-300`}
                    aria-expanded={showGraph}
                    aria-label="show graph"
                />
                <p>{title}</p>
            </div>
            <Collapse in={showGraph}>
                <div className="p-4 relative w-full min-h-[24rem]">
                    {children}
                </div>
            </Collapse>
        </div>
    );
};

const GraphSection = ({ data }: GraphSectionProps) => {
    const [graph2Data, setGraph2Data] = useState<{ x: number; y: number }[]>(
        []
    );

    // Create new list of magnitude count
    useEffect(() => {
        // For bar graph x-axis. Chartjs does not natively support histogram
        const newData = [
            { x: 0.5, y: 0 },
            { x: 1.5, y: 0 },
            { x: 2.5, y: 0 },
            { x: 3.5, y: 0 },
            { x: 4.5, y: 0 },
            { x: 5.5, y: 0 },
            { x: 6.5, y: 0 },
            { x: 7.5, y: 0 },
            { x: 8.5, y: 0 },
            { x: 9.5, y: 0 },
        ];
        data.forEach((entry) => {
            newData[Math.trunc(entry.properties.mag)].y += 1;
        });
        setGraph2Data(newData);
    }, [data]);

    return (
        <div className="w-full md:w-[768px] flex flex-col gap-10">
            <GraphContainer title="Time vs. Magnitude">
                <Scatter
                    data={{ datasets: [{ data: data }] }}
                    options={{
                        parsing: {
                            xAxisKey: "properties.time",
                            yAxisKey: "properties.mag",
                        },
                        scales: {
                            x: {
                                type: "time",
                                title: {
                                    text: "Time",
                                    display: true,
                                    color: "black",
                                },
                                ticks: { maxTicksLimit: 11, color: "black" },
                                bounds: "ticks",
                                border: {
                                    color: "black",
                                },
                            },
                            y: {
                                title: {
                                    text: "Magnitude",
                                    display: true,
                                    color: "black",
                                },
                                ticks: { stepSize: 1, color: "black" },
                                min: 0,
                                max: 10,
                                border: {
                                    color: "black",
                                },
                            },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        elements: {
                            point: {
                                radius: 5,
                                hoverRadius: 5,
                                borderColor: "rgba(0,0,0,0.5)",
                                backgroundColor: "rgba(34,197,94,0.5)",
                            },
                        },
                        plugins: {
                            tooltip: {
                                displayColors: false,
                                animation: false,
                                callbacks: {
                                    label: (context) => {
                                        const entry =
                                            context.raw as EarthquakeData;
                                        return [
                                            `Magnitude: ${entry.properties.mag}`,
                                            new Date(
                                                entry.properties.time
                                            ).toLocaleString(),
                                            entry.properties.place || "N/A",
                                        ];
                                    },
                                },
                            },
                        },
                    }}
                />
            </GraphContainer>
            <GraphContainer title="Magnitude vs. Count">
                <Bar
                    data={{
                        datasets: [
                            {
                                data: graph2Data,
                                barPercentage: 1,
                                categoryPercentage: 1,
                                hoverBorderWidth: 1,
                                hoverBorderColor: "black",
                                hoverBackgroundColor: "rgba(34,197,94,0.5)",
                                backgroundColor: "rgba(34,197,94,0.5)",
                            },
                        ],
                    }}
                    options={{
                        scales: {
                            x: {
                                type: "linear",
                                offset: false,
                                grid: {
                                    offset: false,
                                },
                                ticks: {
                                    stepSize: 1,
                                    color: "black",
                                },
                                title: {
                                    text: "Magnitude",
                                    display: true,
                                    color: "black",
                                },
                                border: {
                                    color: "black",
                                },
                            },
                            y: {
                                title: {
                                    text: "Count",
                                    display: true,
                                    color: "black",
                                },
                                ticks: { color: "black", precision: 0 },
                                border: {
                                    color: "black",
                                },
                            },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                displayColors: false,
                                animation: false,
                                callbacks: {
                                    title: () => "",
                                    label: (context) => {
                                        const mag = Math.trunc(
                                            context.parsed.x
                                        );
                                        return [
                                            `Magnitude: ${mag} - ${mag + 1}`,
                                            `Count: ${context.parsed.y}`,
                                        ];
                                    },
                                },
                            },
                        },
                    }}
                />
            </GraphContainer>
        </div>
    );
};

export default GraphSection;
