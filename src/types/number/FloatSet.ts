import type { Ptr } from '../../core/functions';
import {
	floatset_in,
	floatset_out,
	set_from_hexwkb,
	floatset_start_value,
	floatset_end_value,
	floatset_value_n,
	distance_floatset_floatset,
	floatset_to_intset,
	floatset_ceil,
	floatset_floor,
	floatset_degrees,
	floatset_radians,
	floatset_shift_scale,
} from '../../core/functions';
import { MeoSet } from '../base/MeoSet';

export class FloatSet extends MeoSet<number> {
	protected _make(ptr: Ptr): this {
		return new FloatSet(ptr) as this;
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): FloatSet {
		return new FloatSet(floatset_in(str));
	}

	static fromHexWKB(hexwkb: string): FloatSet {
		return new FloatSet(set_from_hexwkb(hexwkb));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	/** @param maxdd decimal digits of precision (default 15) */
	toString(maxdd = 15): string {
		return floatset_out(this._inner, maxdd);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	startValue(): number {
		return floatset_start_value(this._inner);
	}

	endValue(): number {
		return floatset_end_value(this._inner);
	}

	/** Returns the n-th value (0-based index). */
	valueN(n: number): number {
		return floatset_value_n(this._inner, n + 1);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	distance(other: FloatSet): number {
		return distance_floatset_floatset(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS & MATH
	// -------------------------------------------------------------------------

	/** Returns a new IntSet truncating each value to integer (raw Ptr). */
	toIntSet(): Ptr {
		return floatset_to_intset(this._inner);
	}

	ceil(): FloatSet {
		return new FloatSet(floatset_ceil(this._inner));
	}

	floor(): FloatSet {
		return new FloatSet(floatset_floor(this._inner));
	}

	degrees(normalize = false): FloatSet {
		return new FloatSet(floatset_degrees(this._inner, normalize));
	}

	radians(): FloatSet {
		return new FloatSet(floatset_radians(this._inner));
	}

	/**
	 * Shift and/or scale the set.
	 * @param shift  amount to shift (pass 0 and hasShift=false to skip)
	 * @param width  new width (pass 0 and hasWidth=false to skip)
	 */
	shiftScale(shift: number, width: number, hasShift = true, hasWidth = true): FloatSet {
		return new FloatSet(
			floatset_shift_scale(this._inner, shift, width, hasShift, hasWidth)
		);
	}
}
