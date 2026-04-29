import type { Ptr } from '../../core/functions';
import {
	span_lower_inc,
	span_upper_inc,
	span_copy,
	span_hash,
	span_to_spanset,
	span_as_hexwkb,
	contained_span_span,
	contains_span_span,
	overlaps_span_span,
	left_span_span,
	overleft_span_span,
	right_span_span,
	overright_span_span,
	intersection_span_span,
	minus_span_span,
	union_span_span,
	span_eq,
	span_ne,
	span_lt,
	span_le,
	span_gt,
	span_ge,
	meos_free,
} from '../../core/functions';

export abstract class Span {
	protected readonly _inner: Ptr;

	constructor(inner: Ptr) {
		this._inner = inner;
	}

	/** Subclass must return a new instance of itself wrapping the given pointer. */
	protected abstract _make(ptr: Ptr): this;

	// -------------------------------------------------------------------------
	// LIFECYCLE
	// -------------------------------------------------------------------------

	get inner(): Ptr {
		return this._inner;
	}

	free(): void {
		meos_free(this._inner);
	}
	[Symbol.dispose](): void {
		this.free();
	}

	copy(): this {
		return this._make(span_copy(this._inner));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	abstract toString(): string;
	asHexWKB(variant = 4): string {
		return span_as_hexwkb(this._inner, variant);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	abstract lower(): number;
	abstract upper(): number;
	lowerInc(): boolean {
		return span_lower_inc(this._inner);
	}
	upperInc(): boolean {
		return span_upper_inc(this._inner);
	}
	hash(): number {
		return span_hash(this._inner);
	}
	toSpanSet(): Ptr {
		return span_to_spanset(this._inner);
	}

	// -------------------------------------------------------------------------
	// TOPOLOGICAL PREDICATES
	// -------------------------------------------------------------------------

	abstract isAdjacent(other: this): boolean;
	isContainedIn(other: this): boolean {
		return contained_span_span(this._inner, other.inner);
	}
	contains(other: this): boolean {
		return contains_span_span(this._inner, other.inner);
	}
	overlaps(other: this): boolean {
		return overlaps_span_span(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// POSITION PREDICATES
	// -------------------------------------------------------------------------

	isBefore(other: this): boolean {
		return left_span_span(this._inner, other.inner);
	}
	isOverOrBefore(other: this): boolean {
		return overleft_span_span(this._inner, other.inner);
	}
	isAfter(other: this): boolean {
		return right_span_span(this._inner, other.inner);
	}
	isOverOrAfter(other: this): boolean {
		return overright_span_span(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	abstract distance(other: this): number;

	// -------------------------------------------------------------------------
	// SET OPERATIONS
	// -------------------------------------------------------------------------

	intersection(other: this): this | null {
		const ptr = intersection_span_span(this._inner, other.inner);
		return ptr === 0 ? null : this._make(ptr);
	}
	minus(other: this): Ptr {
		return minus_span_span(this._inner, other.inner);
	}
	union(other: this): Ptr {
		return union_span_span(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// COMPARISONS
	// -------------------------------------------------------------------------

	eq(other: this): boolean {
		return span_eq(this._inner, other.inner);
	}
	ne(other: this): boolean {
		return span_ne(this._inner, other.inner);
	}
	lt(other: this): boolean {
		return span_lt(this._inner, other.inner);
	}
	le(other: this): boolean {
		return span_le(this._inner, other.inner);
	}
	gt(other: this): boolean {
		return span_gt(this._inner, other.inner);
	}
	ge(other: this): boolean {
		return span_ge(this._inner, other.inner);
	}
}
