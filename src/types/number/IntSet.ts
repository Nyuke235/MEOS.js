import type { Ptr } from '../../core/functions';
import {
	intset_in,
	intset_out,
	set_from_hexwkb,
	intset_start_value,
	intset_end_value,
	intset_value_n,
	distance_intset_intset,
	intset_to_floatset,
	intset_shift_scale,
} from '../../core/functions';
import { MeoSet } from '../base/MeoSet';

export class IntSet extends MeoSet<number> {
	protected _make(ptr: Ptr): this {
		return new IntSet(ptr) as this;
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): IntSet {
		return new IntSet(intset_in(str));
	}

	static fromHexWKB(hexwkb: string): IntSet {
		return new IntSet(set_from_hexwkb(hexwkb));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	toString(): string {
		return intset_out(this._inner);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	startValue(): number {
		return intset_start_value(this._inner);
	}

	endValue(): number {
		return intset_end_value(this._inner);
	}

	/** Returns the n-th value (0-based index). */
	valueN(n: number): number {
		return intset_value_n(this._inner, n + 1);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	distance(other: IntSet): number {
		return distance_intset_intset(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS & MATH
	// -------------------------------------------------------------------------

	/** Returns a new FloatSet converting each integer value to float (raw Ptr). */
	toFloatSet(): Ptr {
		return intset_to_floatset(this._inner);
	}

	/**
	 * Shift and/or scale the set.
	 * @param shift  amount to shift (pass 0 and hasShift=false to skip)
	 * @param width  new width (pass 0 and hasWidth=false to skip)
	 */
	shiftScale(shift: number, width: number, hasShift = true, hasWidth = true): IntSet {
		return new IntSet(intset_shift_scale(this._inner, shift, width, hasShift, hasWidth));
	}
}
