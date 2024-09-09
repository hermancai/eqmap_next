import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "Earthquake Map",
    description:
        "Search for past earthquake events based on location, date, and magnitude.",
    authors: [{ name: "Herman Cai https://hermancai.dev" }],
    robots: "follow, index",
    manifest: "manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#f1f5f9",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
