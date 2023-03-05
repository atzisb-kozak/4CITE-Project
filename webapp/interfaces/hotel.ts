interface Value {
	value: string;
}

export interface Binding {
	class: Value;
	count: Value;
	label?: Value;
}

export interface HotelResponse {
	results: {
		bindings: Binding[];
	};
}
