import { createStorage } from "../storage";

export function createTestTx() {
	return {
		find: async () => {
			return "find";
		},
	};
}

export function createTestClient(tx: ReturnType<typeof createTestTx>) {
	return {
		...tx,
		_transaction: async <O>(fn: (payload: typeof tx) => Promise<O>) => {
			return fn(tx);
		},
	};
}

export function createTestStorage(client: ReturnType<typeof createTestClient>) {
	return createStorage<typeof client>();
}

export function initTest() {
	const tx = createTestTx();
	const client = createTestClient(tx);

	const als = createTestStorage(client);

	return {
		tx,
		client,
		als,
	};
}
