export interface MeosModule {
	ccall(
		ident: string,
		returnType: 'number' | 'string' | 'boolean' | null,
		argTypes: ('number' | 'string' | 'boolean' | 'bigint')[],
		args: unknown[]
	): unknown;

	cwrap(
		ident: string,
		returnType: 'number' | 'string' | 'boolean' | null,
		argTypes: ('number' | 'string' | 'boolean' | 'bigint')[]
	): (...args: unknown[]) => unknown;
}

declare function createMeosModule(moduleArg?: object): Promise<MeosModule>;

export default createMeosModule;
