import Link from "next/link";

export const Navbar: React.FC = () => {
	return (
		<nav className="navbar bg-neutral">
			<Link
				href={"/"}
				className="text-3xl font-bold">
				Typet
			</Link>
		</nav>
	);
};
