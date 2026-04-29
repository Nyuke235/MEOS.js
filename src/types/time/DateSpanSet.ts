import type { Ptr, DateADT } from '../../core/functions';
import {
	datespanset_in,
	datespanset_out,
	spanset_from_hexwkb,
	span_to_spanset,
	datespanset_start_date,
	datespanset_end_date,
	datespanset_num_dates,
	datespanset_date_n,
	distance_datespanset_datespan,
	distance_datespanset_datespanset,
	datespanset_to_tstzspanset,
	datespanset_shift_scale,
} from '../../core/functions';
import { SpanSet } from '../base/SpanSet';
import { DateSpan } from './DateSpan';

export class DateSpanSet extends SpanSet<DateSpan> {
	protected _makeSpanSet(ptr: Ptr): this {
		return new DateSpanSet(ptr) as this;
	}

	protected _makeSpan(ptr: Ptr): DateSpan {
		return new DateSpan(ptr);
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): DateSpanSet {
		return new DateSpanSet(datespanset_in(str));
	}

	static fromHexWKB(hexwkb: string): DateSpanSet {
		return new DateSpanSet(spanset_from_hexwkb(hexwkb));
	}

	static fromSpan(span: DateSpan): DateSpanSet {
		return new DateSpanSet(span_to_spanset(span.inner));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	toString(): string {
		return datespanset_out(this._inner);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	/** Lower bound as days since 2000-01-01. */
	lower(): DateADT {
		return datespanset_start_date(this._inner);
	}

	/** Upper bound as days since 2000-01-01. */
	upper(): DateADT {
		return datespanset_end_date(this._inner);
	}

	/** Total number of distinct dates across all spans. */
	numDates(): number {
		return datespanset_num_dates(this._inner);
	}

	/** Start date of the spanset as days since 2000-01-01. */
	startDate(): DateADT {
		return datespanset_start_date(this._inner);
	}

	/** End date of the spanset as days since 2000-01-01. */
	endDate(): DateADT {
		return datespanset_end_date(this._inner);
	}

	/** Returns the n-th date (0-based index) as days since 2000-01-01. */
	dateN(n: number): DateADT {
		return datespanset_date_n(this._inner, n + 1);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	/** Distance in days between this and another DateSpan or DateSpanSet. */
	distance(other: DateSpan | DateSpanSet): number {
		if (other instanceof DateSpan)
			return distance_datespanset_datespan(this._inner, other.inner);
		return distance_datespanset_datespanset(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS & MATH
	// -------------------------------------------------------------------------

	/** Convert to a TsTzSpanSet (bounds become midnight UTC). Returns a raw Ptr. */
	toTsTzSpanSet(): Ptr {
		return datespanset_to_tstzspanset(this._inner);
	}

	/**
	 * Shift and/or scale the spanset.
	 * @param shift  days to shift (pass 0 and hasShift=false to skip)
	 * @param width  new width in days (pass 0 and hasWidth=false to skip)
	 */
	shiftScale(
		shift: number,
		width: number,
		hasShift = true,
		hasWidth = true
	): DateSpanSet {
		return new DateSpanSet(
			datespanset_shift_scale(this._inner, shift, width, hasShift, hasWidth)
		);
	}
}
