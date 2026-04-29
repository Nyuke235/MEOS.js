import type { Ptr } from '../../core/functions';
import {
	floatspan_in,
	floatspan_out,
	floatspan_make,
	floatspan_lower,
	floatspan_upper,
	floatspan_width,
	span_from_hexwkb,
	distance_floatspan_floatspan,
	floatspan_to_intspan,
	floatspan_expand,
	floatspan_ceil,
	floatspan_floor,
	floatspan_round,
	floatspan_degrees,
	floatspan_radians,
} from '../../core/functions';
import { Span } from '../base/Span';

export class FloatSpan extends Span {
	protected _make(ptr: Ptr): this {
		return new FloatSpan(ptr) as this;
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): FloatSpan {
		return new FloatSpan(floatspan_in(str));
	}
	static fromBounds(
		lower: number,
		upper: number,
		lowerInc = true,
		upperInc = false
	): FloatSpan {
		return new FloatSpan(floatspan_make(lower, upper, lowerInc, upperInc));
	}
	static fromHexWKB(hexwkb: string): FloatSpan {
		return new FloatSpan(span_from_hexwkb(hexwkb));
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	/** @param maxdd decimal digits of precision (default 15) */
	toString(maxdd = 15): string {
		return floatspan_out(this._inner, maxdd);
	}
	lower(): number {
		return floatspan_lower(this._inner);
	}
	upper(): number {
		return floatspan_upper(this._inner);
	}
	width(): number {
		return floatspan_width(this._inner);
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
		return distance_floatspan_floatspan(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS & MATH
	// -------------------------------------------------------------------------

	toIntSpan(): Ptr {
		return floatspan_to_intspan(this._inner);
	}
	expand(value: number): FloatSpan {
		return new FloatSpan(floatspan_expand(this._inner, value));
	}
	ceil(): FloatSpan {
		return new FloatSpan(floatspan_ceil(this._inner));
	}
	floor(): FloatSpan {
		return new FloatSpan(floatspan_floor(this._inner));
	}
	round(maxdd: number): FloatSpan {
		return new FloatSpan(floatspan_round(this._inner, maxdd));
	}
	degrees(normalize = false): FloatSpan {
		return new FloatSpan(floatspan_degrees(this._inner, normalize));
	}
	radians(): FloatSpan {
		return new FloatSpan(floatspan_radians(this._inner));
	}
}
