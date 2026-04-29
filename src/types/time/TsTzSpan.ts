import type { Ptr, TimestampTz } from '../../core/functions';
import {
	tstzspan_in,
	tstzspan_out,
	tstzspan_make,
	tstzspan_lower,
	tstzspan_upper,
	span_from_hexwkb,
	adjacent_span_span,
	distance_tstzspan_tstzspan,
} from '../../core/functions';
import { Span } from '../base/Span';

export class TsTzSpan extends Span {
	protected _make(ptr: Ptr): this {
		return new TsTzSpan(ptr) as this;
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): TsTzSpan {
		return new TsTzSpan(tstzspan_in(str));
	}
	/**
	 * @param lower  TimestampTz - microseconds since 2000-01-01 UTC
	 * @param upper  TimestampTz - microseconds since 2000-01-01 UTC
	 */
	static fromTimestamps(
		lower: TimestampTz,
		upper: TimestampTz,
		lowerInc = true,
		upperInc = false
	): TsTzSpan {
		return new TsTzSpan(tstzspan_make(lower, upper, lowerInc, upperInc));
	}
	static fromHexWKB(hexwkb: string): TsTzSpan {
		return new TsTzSpan(span_from_hexwkb(hexwkb));
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	toString(): string {
		return tstzspan_out(this._inner);
	}
	lower(): TimestampTz {
		return tstzspan_lower(this._inner);
	}
	upper(): TimestampTz {
		return tstzspan_upper(this._inner);
	}

	durationMs(): number {
		return (this.upper() - this.lower()) / 1000;
	}

	// -------------------------------------------------------------------------
	// TOPOLOGICAL PREDICATES
	// -------------------------------------------------------------------------

	isAdjacent(other: this): boolean {
		return adjacent_span_span(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	distance(other: this): number {
		return distance_tstzspan_tstzspan(this._inner, other.inner);
	}
}
