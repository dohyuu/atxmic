export const IsolationLevel = {
	Default: "Default",
	ReadCommitted: "ReadCommitted",
	ReadUncommitted: "ReadUncommitted",
	RepeatableRead: "RepeatableRead",
	Serializable: "Serializable",
	Snapshot: "Snapshot",
} as const;

export type IsolationLevel =
	(typeof IsolationLevel)[keyof typeof IsolationLevel];
