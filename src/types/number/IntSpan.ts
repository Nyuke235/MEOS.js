import type { Ptr } from '../../core/functions';
import {
	intspan_in,
	intspan_out,
	intspan_make,
	intspan_lower,
	intspan_upper,
	intspan_width,
	span_from_hexwkb,
	distance_intspan_intspan,
	intspan_to_floatspan,
	intspan_expand,
} from '../../core/functions';
import { Span } from '../base/Span';

export class IntSpan extends Span {
	protected _make(ptr: Ptr): this {
		return new IntSpan(ptr) as this;
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): IntSpan {
		return new IntSpan(intspan_in(str));
	}
	static fromBounds(
		lower: number,
		upper: number,
		lowerInc = true,
		upperInc = false
	): IntSpan {
		return new IntSpan(intspan_make(lower, upper, lowerInc, upperInc));
	}
	static fromHexWKB(hexwkb: string): IntSpan {
		return new IntSpan(span_from_hexwkb(hexwkb));
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	toString(): string {
		return intspan_out(this._inner);
	}
	lower(): number {
		return intspan_lower(this._inner);
	}
	upper(): number {
		return intspan_upper(this._inner);
	}
	width(): number {
		return intspan_width(this._inner);
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
		return distance_intspan_intspan(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS
	// -------------------------------------------------------------------------

	toFloatSpan(): Ptr {
		return intspan_to_floatspan(this._inner);
	}
	expand(value: number): IntSpan {
		return new IntSpan(intspan_expand(this._inner, value));
	}
}
