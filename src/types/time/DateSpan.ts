import type { Ptr, DateADT } from '../../core/functions';
import {
	datespan_in,
	datespan_out,
	datespan_make,
	datespan_lower,
	datespan_upper,
	span_from_hexwkb,
	distance_datespan_datespan,
	datespan_to_tstzspan,
} from '../../core/functions';
import { Span } from '../base/Span';

export class DateSpan extends Span {
	protected _make(ptr: Ptr): this {
		return new DateSpan(ptr) as this;
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): DateSpan {
		return new DateSpan(datespan_in(str));
	}
	/**
	 * @param lower  DateADT — days since 2000-01-01
	 * @param upper  DateADT — days since 2000-01-01
	 */
	static fromBounds(
		lower: DateADT,
		upper: DateADT,
		lowerInc = true,
		upperInc = false
	): DateSpan {
		return new DateSpan(datespan_make(lower, upper, lowerInc, upperInc));
	}
	static fromHexWKB(hexwkb: string): DateSpan {
		return new DateSpan(span_from_hexwkb(hexwkb));
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	toString(): string {
		return datespan_out(this._inner);
	}
	lower(): DateADT {
		return datespan_lower(this._inner);
	}
	upper(): DateADT {
		return datespan_upper(this._inner);
	}
	durationDays(): number {
		return this.upper() - this.lower();
	}

	// -------------------------------------------------------------------------
	// TOPOLOGICAL PREDICATES
	// -------------------------------------------------------------------------

	isAdjacent(other: this): boolean {
		return (
			(this.upper() === other.lower() && this.upperInc() !== other.lowerInc()) ||
			(other.upper() === this.lower() && other.upperInc() !== this.lowerInc())
		);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	distance(other: this): number {
		return distance_datespan_datespan(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS
	// -------------------------------------------------------------------------

	/** Convert to a TsTzSpan (bounds become midnight UTC). Returns a raw Ptr. */
	toTsTzSpan(): Ptr {
		return datespan_to_tstzspan(this._inner);
	}
}
