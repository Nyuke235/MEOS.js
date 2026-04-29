import type { Ptr } from '../../core/functions';
import {
	floatspanset_in,
	floatspanset_out,
	spanset_from_hexwkb,
	span_to_spanset,
	floatspanset_lower,
	floatspanset_upper,
	floatspanset_width,
	distance_floatspanset_floatspan,
	distance_floatspanset_floatspanset,
	floatspanset_to_intspanset,
	floatspanset_ceil,
	floatspanset_floor,
	floatspanset_degrees,
	floatspanset_radians,
	floatspanset_round,
	floatspanset_shift_scale,
} from '../../core/functions';
import { SpanSet } from '../base/SpanSet';
import { FloatSpan } from './FloatSpan';

export class FloatSpanSet extends SpanSet<FloatSpan> {
	protected _makeSpanSet(ptr: Ptr): this {
		return new FloatSpanSet(ptr) as this;
	}

	protected _makeSpan(ptr: Ptr): FloatSpan {
		return new FloatSpan(ptr);
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): FloatSpanSet {
		return new FloatSpanSet(floatspanset_in(str));
	}

	static fromHexWKB(hexwkb: string): FloatSpanSet {
		return new FloatSpanSet(spanset_from_hexwkb(hexwkb));
	}

	static fromSpan(span: FloatSpan): FloatSpanSet {
		return new FloatSpanSet(span_to_spanset(span.inner));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	/** @param maxdd decimal digits of precision (default 15) */
	toString(maxdd = 15): string {
		return floatspanset_out(this._inner, maxdd);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	lower(): number {
		return floatspanset_lower(this._inner);
	}

	upper(): number {
		return floatspanset_upper(this._inner);
	}

	/**
	 * Total width (sum of individual span widths).
	 * @param boundSpan false (default) -> sum; true -> bounding span width
	 */
	width(boundSpan = false): number {
		return floatspanset_width(this._inner, boundSpan);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	distance(other: FloatSpan | FloatSpanSet): number {
		if (other instanceof FloatSpan)
			return distance_floatspanset_floatspan(this._inner, other.inner);
		return distance_floatspanset_floatspanset(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS & MATH
	// -------------------------------------------------------------------------

	/** Returns an IntSpanSet truncating each span's bounds to integer (raw Ptr). */
	toIntSpanSet(): Ptr {
		return floatspanset_to_intspanset(this._inner);
	}

	ceil(): FloatSpanSet {
		return new FloatSpanSet(floatspanset_ceil(this._inner));
	}

	floor(): FloatSpanSet {
		return new FloatSpanSet(floatspanset_floor(this._inner));
	}

	degrees(normalize = false): FloatSpanSet {
		return new FloatSpanSet(floatspanset_degrees(this._inner, normalize));
	}

	radians(): FloatSpanSet {
		return new FloatSpanSet(floatspanset_radians(this._inner));
	}

	round(maxdd: number): FloatSpanSet {
		return new FloatSpanSet(floatspanset_round(this._inner, maxdd));
	}

	/**
	 * Shift and/or scale the spanset.
	 * @param shift  amount to shift (pass 0 and hasShift=false to skip)
	 * @param width  new width (pass 0 and hasWidth=false to skip)
	 */
	shiftScale(
		shift: number,
		width: number,
		hasShift = true,
		hasWidth = true
	): FloatSpanSet {
		return new FloatSpanSet(
			floatspanset_shift_scale(this._inner, shift, width, hasShift, hasWidth)
		);
	}
}
