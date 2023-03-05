import { CardDetail } from "@interfaces/card.ts";
import { HotelResponse } from "@interfaces/hotel.ts";

const endpointUrl = "http://localhost:3000/hotels/limit";

export async function fetchCardDetails(): Promise<CardDetail[] | undefined> {
  const url = new URL(endpointUrl);
  url.searchParams.append("limit", "2");

  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 5000);

  try {
    const res = await fetch(url.toString(), { signal: ctrl.signal, method: 'get' });
    if (!res.ok) {
      return;
    }

    clearTimeout(id);

    const json: HotelResponse = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return;
  }
}
