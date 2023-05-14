import "@/app/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Roboto_Mono } from "next/font/google";

const roboto_mono = Roboto_Mono({ subsets: ["latin"] });

export const metadata = {
	title: "TypeTest",
	description: "TypeTest is a WPM and Accuracy tester for typing speed"
};

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`flex flex-col gap-4 ${roboto_mono.className}`}>
				<Navbar />
				<main className="flex-1 px-5">{children}</main>
				{/* <footer className="flex flex-col"></footer> */}
			</body>
		</html>
	);
}
