import type { Ptr, DateADT } from '../../core/functions';
import {
	dateset_in,
	dateset_out,
	set_from_hexwkb,
	dateset_start_value,
	dateset_end_value,
	dateset_value_n,
	distance_dateset_dateset,
	dateset_to_tstzset,
	dateset_shift_scale,
} from '../../core/functions';
import { MeoSet } from '../base/MeoSet';

export class DateSet extends MeoSet<DateADT> {
	protected _make(ptr: Ptr): this {
		return new DateSet(ptr) as this;
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): DateSet {
		return new DateSet(dateset_in(str));
	}

	static fromHexWKB(hexwkb: string): DateSet {
		return new DateSet(set_from_hexwkb(hexwkb));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	toString(): string {
		return dateset_out(this._inner);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	/** First date as days since 2000-01-01. */
	startValue(): DateADT {
		return dateset_start_value(this._inner);
	}

	/** Last date as days since 2000-01-01. */
	endValue(): DateADT {
		return dateset_end_value(this._inner);
	}

	/** Returns the n-th date (0-based index) as days since 2000-01-01. */
	valueN(n: number): DateADT {
		return dateset_value_n(this._inner, n + 1);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	/** Distance in days between two disjoint DateSets (0 if they share a date). */
	distance(other: DateSet): number {
		return distance_dateset_dateset(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS & MATH
	// -------------------------------------------------------------------------

	/** Convert to a TsTzSet (bounds become midnight UTC). Returns a raw Ptr. */
	toTsTzSet(): Ptr {
		return dateset_to_tstzset(this._inner);
	}

	/**
	 * Shift and/or scale the set.
	 * @param shift  days to shift (pass 0 and hasShift=false to skip)
	 * @param width  new width in days (pass 0 and hasWidth=false to skip)
	 */
	shiftScale(shift: number, width: number, hasShift = true, hasWidth = true): DateSet {
		return new DateSet(
			dateset_shift_scale(this._inner, shift, width, hasShift, hasWidth)
		);
	}
}
