import type { Ptr } from '../../core/functions';
import {
	intspanset_in,
	intspanset_out,
	spanset_from_hexwkb,
	span_to_spanset,
	intspanset_lower,
	intspanset_upper,
	intspanset_width,
	distance_intspanset_intspan,
	distance_intspanset_intspanset,
	intspanset_to_floatspanset,
	intspanset_shift_scale,
} from '../../core/functions';
import { SpanSet } from '../base/SpanSet';
import { IntSpan } from './IntSpan';

export class IntSpanSet extends SpanSet<IntSpan> {
	protected _makeSpanSet(ptr: Ptr): this {
		return new IntSpanSet(ptr) as this;
	}

	protected _makeSpan(ptr: Ptr): IntSpan {
		return new IntSpan(ptr);
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): IntSpanSet {
		return new IntSpanSet(intspanset_in(str));
	}

	static fromHexWKB(hexwkb: string): IntSpanSet {
		return new IntSpanSet(spanset_from_hexwkb(hexwkb));
	}

	static fromSpan(span: IntSpan): IntSpanSet {
		return new IntSpanSet(span_to_spanset(span.inner));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	toString(): string {
		return intspanset_out(this._inner);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	lower(): number {
		return intspanset_lower(this._inner);
	}

	upper(): number {
		return intspanset_upper(this._inner);
	}

	/**
	 * Total width (sum of individual span widths).
	 * @param boundSpan false (default) -> sum; true -> bounding span width
	 */
	width(boundSpan = false): number {
		return intspanset_width(this._inner, boundSpan);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	distance(other: IntSpan | IntSpanSet): number {
		if (other instanceof IntSpan)
			return distance_intspanset_intspan(this._inner, other.inner);
		return distance_intspanset_intspanset(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS & MATH
	// -------------------------------------------------------------------------

	/** Returns a FloatSpanSet converting each span's bounds to float (raw Ptr). */
	toFloatSpanSet(): Ptr {
		return intspanset_to_floatspanset(this._inner);
	}

	/**
	 * Shift and/or scale the spanset.
	 * @param shift  amount to shift (pass 0 and hasShift=false to skip)
	 * @param width  new width (pass 0 and hasWidth=false to skip)
	 */
	shiftScale(shift: number, width: number, hasShift = true, hasWidth = true): IntSpanSet {
		return new IntSpanSet(
			intspanset_shift_scale(this._inner, shift, width, hasShift, hasWidth)
		);
	}
}
