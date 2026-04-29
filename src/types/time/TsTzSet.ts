import type { Ptr, TimestampTz } from '../../core/functions';
import {
	tstzset_in,
	tstzset_out,
	set_from_hexwkb,
	tstzset_start_value,
	tstzset_end_value,
	tstzset_value_n,
	distance_tstzset_tstzset,
	tstzset_to_dateset,
} from '../../core/functions';
import { MeoSet } from '../base/MeoSet';

export class TsTzSet extends MeoSet<TimestampTz> {
	protected _make(ptr: Ptr): this {
		return new TsTzSet(ptr) as this;
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	/**
	 * Parse a TsTzSet from a WKT string.
	 * Example: `"{2001-01-01, 2001-01-02, 2001-01-03}"`
	 */
	static fromString(str: string): TsTzSet {
		return new TsTzSet(tstzset_in(str));
	}

	static fromHexWKB(hexwkb: string): TsTzSet {
		return new TsTzSet(set_from_hexwkb(hexwkb));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	toString(): string {
		return tstzset_out(this._inner);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	/** First timestamp as microseconds since 2000-01-01 UTC. */
	startValue(): TimestampTz {
		return tstzset_start_value(this._inner);
	}

	/** Last timestamp as microseconds since 2000-01-01 UTC. */
	endValue(): TimestampTz {
		return tstzset_end_value(this._inner);
	}

	/**
	 * Returns the n-th timestamp (0-based index) as microseconds since 2000-01-01 UTC.
	 * MEOS: tstzset_value_n (1-based internally).
	 */
	valueN(n: number): TimestampTz {
		return tstzset_value_n(this._inner, n + 1);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	/** Distance in microseconds between two disjoint TsTzSets (0 if they share a value). */
	distance(other: TsTzSet): number {
		return distance_tstzset_tstzset(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS
	// -------------------------------------------------------------------------

	/** Convert to a DateSet by truncating timestamps to dates (raw Ptr). */
	toDateSet(): Ptr {
		return tstzset_to_dateset(this._inner);
	}
}
