import LinkButton from "@components/LinkButton.tsx";
import Link from '@components/Link.tsx'

export default function Header() {
	return (
		<div class="w-full px-4 py-10 flex flex-row justify-between items-center">
			<div class="flex items-center">
				<i class="ti ti-building-community text-3xl md:text-4xl" />
				<span class="ml-3 font-medium text-md md:text-lg">
					<p>Akkor Hotel</p>
				</span>
			</div>
			<div class="space-x-2 md:space-x-4">
				<Link title="login" href="/login">
					Login
				</Link>
				<Link
					title="register"
					href="/register"
				>
					Register
				</Link>
			</div>
		</div>
	);
}
