export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> &
			Partial<Record<Exclude<Keys, K>, undefined>>
	}[Keys]

export type ObjectId<T> = T & { _id: string }

export type RequireField<T, K extends keyof T> = Required<Pick<T, K>> &
	Partial<Omit<T, K>>
