export interface KVPair {
	key: string;
	value: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ConfigManagerOptions {
	dbPath?: string;
}
