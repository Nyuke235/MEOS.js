import type { Ptr, TimestampTz } from '../../core/functions';
import {
	tstzspanset_in,
	tstzspanset_out,
	spanset_from_hexwkb,
	span_to_spanset,
	tstzspanset_num_timestamps,
	tstzspanset_lower,
	tstzspanset_upper,
	tstzspanset_duration_us,
	tstzspanset_timestamptz_n,
	distance_tstzspanset_tstzspan,
	distance_tstzspanset_tstzspanset,
} from '../../core/functions';
import { SpanSet } from '../base/SpanSet';
import { TsTzSpan } from './TsTzSpan';

export class TsTzSpanSet extends SpanSet<TsTzSpan> {
	protected _makeSpanSet(ptr: Ptr): this {
		return new TsTzSpanSet(ptr) as this;
	}
	protected _makeSpan(ptr: Ptr): TsTzSpan {
		return new TsTzSpan(ptr);
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): TsTzSpanSet {
		return new TsTzSpanSet(tstzspanset_in(str));
	}
	static fromHexWKB(hexwkb: string): TsTzSpanSet {
		return new TsTzSpanSet(spanset_from_hexwkb(hexwkb));
	}
	static fromSpan(span: TsTzSpan): TsTzSpanSet {
		return new TsTzSpanSet(span_to_spanset(span.inner));
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	toString(): string {
		return tstzspanset_out(this._inner);
	}
	lower(): TimestampTz {
		return tstzspanset_lower(this._inner);
	}
	upper(): TimestampTz {
		return tstzspanset_upper(this._inner);
	}

	numTimestamps(): number {
		return tstzspanset_num_timestamps(this._inner);
	}
	startTimestamp(): TimestampTz {
		return tstzspanset_lower(this._inner);
	}
	endTimestamp(): TimestampTz {
		return tstzspanset_upper(this._inner);
	}
	timestampN(n: number): TimestampTz {
		return tstzspanset_timestamptz_n(this._inner, n + 1);
	}

	/**
	 * Duration in milliseconds.
	 * @param boundSpan false (default) -> sum of individual durations; true -> bounding span duration
	 */
	durationMs(boundSpan = false): number {
		return tstzspanset_duration_us(this._inner, boundSpan) / 1000;
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	distance(other: TsTzSpan | TsTzSpanSet): number {
		if (other instanceof TsTzSpan)
			return distance_tstzspanset_tstzspan(this._inner, other.inner);
		return distance_tstzspanset_tstzspanset(this._inner, other.inner);
	}
}
