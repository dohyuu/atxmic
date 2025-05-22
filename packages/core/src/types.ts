export type Identified<T extends Record<string, unknown>> = T & {
	id: string;
};
