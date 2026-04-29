import type { Ptr } from '../../core/functions';
import {
	spanset_copy,
	spanset_as_hexwkb,
	spanset_hash,
	spanset_lower_inc,
	spanset_upper_inc,
	spanset_num_spans,
	spanset_span,
	spanset_span_n,
	spanset_start_span,
	spanset_end_span,
	adjacent_spanset_span,
	adjacent_spanset_spanset,
	contained_spanset_span,
	contained_spanset_spanset,
	contains_spanset_span,
	contains_spanset_spanset,
	overlaps_spanset_span,
	overlaps_spanset_spanset,
	left_spanset_span,
	left_spanset_spanset,
	overleft_spanset_span,
	overleft_spanset_spanset,
	right_spanset_span,
	right_spanset_spanset,
	overright_spanset_span,
	overright_spanset_spanset,
	intersection_span_spanset,
	intersection_spanset_spanset,
	minus_spanset_span,
	minus_spanset_spanset,
	union_spanset_span,
	union_spanset_spanset,
	spanset_eq,
	spanset_ne,
	spanset_lt,
	spanset_le,
	spanset_gt,
	spanset_ge,
	meos_free,
} from '../../core/functions';
import { Span } from './Span';

export abstract class SpanSet<S extends Span> {
	protected readonly _inner: Ptr;

	constructor(inner: Ptr) {
		this._inner = inner;
	}

	/** Subclass must return a new SpanSet instance wrapping the given pointer. */
	protected abstract _makeSpanSet(ptr: Ptr): this;
	/** Subclass must return a new companion Span instance wrapping the given pointer. */
	protected abstract _makeSpan(ptr: Ptr): S;

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
		return this._makeSpanSet(spanset_copy(this._inner));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	abstract toString(): string;
	asHexWKB(variant = 4): string {
		return spanset_as_hexwkb(this._inner, variant);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	abstract lower(): number;
	abstract upper(): number;
	lowerInc(): boolean {
		return spanset_lower_inc(this._inner);
	}
	upperInc(): boolean {
		return spanset_upper_inc(this._inner);
	}
	numSpans(): number {
		return spanset_num_spans(this._inner);
	}
	hash(): number {
		return spanset_hash(this._inner);
	}

	boundingSpan(): S {
		return this._makeSpan(spanset_span(this._inner));
	}
	startSpan(): S {
		return this._makeSpan(spanset_start_span(this._inner));
	}
	endSpan(): S {
		return this._makeSpan(spanset_end_span(this._inner));
	}
	spanN(n: number): S {
		return this._makeSpan(spanset_span_n(this._inner, n + 1));
	}

	// -------------------------------------------------------------------------
	// TOPOLOGICAL PREDICATES
	// -------------------------------------------------------------------------

	isAdjacent(other: S | this): boolean {
		if (other instanceof Span) return adjacent_spanset_span(this._inner, other.inner);
		return adjacent_spanset_spanset(this._inner, other.inner);
	}
	isContainedIn(other: S | this): boolean {
		if (other instanceof Span) return contained_spanset_span(this._inner, other.inner);
		return contained_spanset_spanset(this._inner, other.inner);
	}
	contains(other: S | this): boolean {
		if (other instanceof Span) return contains_spanset_span(this._inner, other.inner);
		return contains_spanset_spanset(this._inner, other.inner);
	}
	overlaps(other: S | this): boolean {
		if (other instanceof Span) return overlaps_spanset_span(this._inner, other.inner);
		return overlaps_spanset_spanset(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// POSITION PREDICATES
	// -------------------------------------------------------------------------

	isBefore(other: S | this): boolean {
		if (other instanceof Span) return left_spanset_span(this._inner, other.inner);
		return left_spanset_spanset(this._inner, other.inner);
	}
	isOverOrBefore(other: S | this): boolean {
		if (other instanceof Span) return overleft_spanset_span(this._inner, other.inner);
		return overleft_spanset_spanset(this._inner, other.inner);
	}
	isAfter(other: S | this): boolean {
		if (other instanceof Span) return right_spanset_span(this._inner, other.inner);
		return right_spanset_spanset(this._inner, other.inner);
	}
	isOverOrAfter(other: S | this): boolean {
		if (other instanceof Span) return overright_spanset_span(this._inner, other.inner);
		return overright_spanset_spanset(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// DISTANCE
	// -------------------------------------------------------------------------

	abstract distance(other: S | this): number;

	// -------------------------------------------------------------------------
	// SET OPERATIONS
	// -------------------------------------------------------------------------

	intersection(other: S | this): this | null {
		const ptr =
			other instanceof Span
				? intersection_span_spanset(other.inner, this._inner)
				: intersection_spanset_spanset(this._inner, other.inner);
		return ptr === 0 ? null : this._makeSpanSet(ptr);
	}
	minus(other: S | this): this | null {
		const ptr =
			other instanceof Span
				? minus_spanset_span(this._inner, other.inner)
				: minus_spanset_spanset(this._inner, other.inner);
		return ptr === 0 ? null : this._makeSpanSet(ptr);
	}
	union(other: S | this): this {
		const ptr =
			other instanceof Span
				? union_spanset_span(this._inner, other.inner)
				: union_spanset_spanset(this._inner, other.inner);
		return this._makeSpanSet(ptr);
	}

	// -------------------------------------------------------------------------
	// COMPARISONS
	// -------------------------------------------------------------------------

	eq(other: this): boolean {
		return spanset_eq(this._inner, other.inner);
	}
	ne(other: this): boolean {
		return spanset_ne(this._inner, other.inner);
	}
	lt(other: this): boolean {
		return spanset_lt(this._inner, other.inner);
	}
	le(other: this): boolean {
		return spanset_le(this._inner, other.inner);
	}
	gt(other: this): boolean {
		return spanset_gt(this._inner, other.inner);
	}
	ge(other: this): boolean {
		return spanset_ge(this._inner, other.inner);
	}
}
