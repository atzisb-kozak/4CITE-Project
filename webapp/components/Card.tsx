import { HotelCardDetail } from "@interfaces/card.ts";

export default function Card({ name, location, description }: HotelCardDetail) {
	return (
		<div class="px-8 py-4 w-80 md:w-96 h-32 flex flex-row justify-between items-center bg-card rounded-md shadow-sm">
			<span class="space-y-1">
				<p class="text-sm md:text-base">{name}</p>
				<p class="font-medium text-3xl md:text-4xl">
					{location}
					<span class="ml-1 text-sm md:text-base">{description}</span>
				</p>
			</span>
		</div>
	);
}
