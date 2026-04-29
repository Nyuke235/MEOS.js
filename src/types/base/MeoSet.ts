import type { Ptr } from '../../core/functions';
import {
	set_copy,
	set_from_hexwkb,
	set_as_hexwkb,
	set_num_values,
	set_hash,
	set_to_span,
	set_to_spanset,
	contained_set_set,
	contains_set_set,
	overlaps_set_set,
	left_set_set,
	overleft_set_set,
	right_set_set,
	overright_set_set,
	intersection_set_set,
	minus_set_set,
	union_set_set,
	set_eq,
	set_ne,
	set_lt,
	set_le,
	set_gt,
	set_ge,
	meos_free,
} from '../../core/functions';

export abstract class MeoSet<T> {
	protected readonly _inner: Ptr;

	constructor(inner: Ptr) {
		this._inner = inner;
	}

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
		return this._make(set_copy(this._inner));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	abstract toString(): string;

	asHexWKB(variant = 4): string {
		return set_as_hexwkb(this._inner, variant);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	numValues(): number {
		return set_num_values(this._inner);
	}

	hash(): number {
		return set_hash(this._inner);
	}

	toSpan(): Ptr {
		return set_to_span(this._inner);
	}

	toSpanSet(): Ptr {
		return set_to_spanset(this._inner);
	}

	abstract startValue(): T;
	abstract endValue(): T;
	abstract valueN(n: number): T;

	// -------------------------------------------------------------------------
	// TOPOLOGICAL PREDICATES
	// -------------------------------------------------------------------------

	isContainedIn(other: this): boolean {
		return contained_set_set(this._inner, other.inner);
	}

	contains(other: this): boolean {
		return contains_set_set(this._inner, other.inner);
	}

	overlaps(other: this): boolean {
		return overlaps_set_set(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// POSITION PREDICATES
	// -------------------------------------------------------------------------

	isBefore(other: this): boolean {
		return left_set_set(this._inner, other.inner);
	}

	isOverOrBefore(other: this): boolean {
		return overleft_set_set(this._inner, other.inner);
	}

	isAfter(other: this): boolean {
		return right_set_set(this._inner, other.inner);
	}

	isOverOrAfter(other: this): boolean {
		return overright_set_set(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	abstract distance(other: this): number;

	// -------------------------------------------------------------------------
	// SET OPERATIONS
	// -------------------------------------------------------------------------

	intersection(other: this): this | null {
		const ptr = intersection_set_set(this._inner, other.inner);
		return ptr === 0 ? null : this._make(ptr);
	}

	minus(other: this): this | null {
		const ptr = minus_set_set(this._inner, other.inner);
		return ptr === 0 ? null : this._make(ptr);
	}

	union(other: this): this {
		return this._make(union_set_set(this._inner, other.inner));
	}

	// -------------------------------------------------------------------------
	// COMPARISONS
	// -------------------------------------------------------------------------

	eq(other: this): boolean {
		return set_eq(this._inner, other.inner);
	}

	ne(other: this): boolean {
		return set_ne(this._inner, other.inner);
	}

	lt(other: this): boolean {
		return set_lt(this._inner, other.inner);
	}

	le(other: this): boolean {
		return set_le(this._inner, other.inner);
	}

	gt(other: this): boolean {
		return set_gt(this._inner, other.inner);
	}

	ge(other: this): boolean {
		return set_ge(this._inner, other.inner);
	}
}
