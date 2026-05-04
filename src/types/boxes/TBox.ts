import type { Ptr, TimestampTz } from '../../core/functions';
import { getModule } from '../../core/meos';
import {
	tbox_in,
	tbox_out,
	tbox_from_hexwkb,
	tbox_as_hexwkb,
	tbox_make,
	tbox_copy,
	tbox_hash,
	tbox_hast,
	tbox_hasx,
	tbox_xmin,
	tbox_xmax,
	tbox_xmin_inc,
	tbox_xmax_inc,
	tbox_tmin,
	tbox_tmax,
	tbox_tmin_inc,
	tbox_tmax_inc,
	tbox_to_intspan,
	tbox_to_floatspan,
	tbox_to_tstzspan,
	int_to_tbox,
	float_to_tbox,
	span_to_tbox,
	timestamptz_to_tbox,
	int_timestamptz_to_tbox,
	float_timestamptz_to_tbox,
	int_tstzspan_to_tbox,
	float_tstzspan_to_tbox,
	numspan_tstzspan_to_tbox,
	numspan_timestamptz_to_tbox,
	set_to_tbox,
	spanset_to_tbox,
	tintbox_expand,
	tfloatbox_expand,
	tbox_round,
	tintbox_shift_scale,
	tfloatbox_shift_scale,
	adjacent_tbox_tbox,
	contained_tbox_tbox,
	contains_tbox_tbox,
	overlaps_tbox_tbox,
	same_tbox_tbox,
	left_tbox_tbox,
	overleft_tbox_tbox,
	right_tbox_tbox,
	overright_tbox_tbox,
	before_tbox_tbox,
	overbefore_tbox_tbox,
	after_tbox_tbox,
	overafter_tbox_tbox,
	intersection_tbox_tbox,
	union_tbox_tbox,
	tbox_eq,
	tbox_ne,
	tbox_lt,
	tbox_le,
	tbox_gt,
	tbox_ge,
	tbox_cmp,
	meos_free,
} from '../../core/functions';

export class TBox {
	protected readonly _inner: Ptr;

	constructor(inner: Ptr) {
		this._inner = inner;
	}

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

	copy(): TBox {
		return new TBox(tbox_copy(this._inner));
	}

	// -------------------------------------------------------------------------
	// CONSTRUCTORS
	// -------------------------------------------------------------------------

	static fromString(str: string): TBox {
		return new TBox(tbox_in(str));
	}

	static fromHexWKB(hexwkb: string): TBox {
		return new TBox(tbox_from_hexwkb(hexwkb));
	}

	static fromInt(i: number): TBox {
		return new TBox(int_to_tbox(i));
	}

	static fromFloat(d: number): TBox {
		return new TBox(float_to_tbox(d));
	}

	static fromSpan(spanPtr: Ptr): TBox {
		return new TBox(span_to_tbox(spanPtr));
	}

	static fromTimestamp(t: TimestampTz): TBox {
		return new TBox(timestamptz_to_tbox(t));
	}

	static fromIntTimestamp(i: number, t: TimestampTz): TBox {
		return new TBox(int_timestamptz_to_tbox(i, t));
	}

	static fromFloatTimestamp(d: number, t: TimestampTz): TBox {
		return new TBox(float_timestamptz_to_tbox(d, t));
	}

	static fromIntTsTzSpan(i: number, tstzSpanPtr: Ptr): TBox {
		return new TBox(int_tstzspan_to_tbox(i, tstzSpanPtr));
	}

	static fromFloatTsTzSpan(d: number, tstzSpanPtr: Ptr): TBox {
		return new TBox(float_tstzspan_to_tbox(d, tstzSpanPtr));
	}

	static fromNumSpanTsTzSpan(numSpanPtr: Ptr, tstzSpanPtr: Ptr): TBox {
		return new TBox(numspan_tstzspan_to_tbox(numSpanPtr, tstzSpanPtr));
	}

	static fromNumSpanTimestamp(numSpanPtr: Ptr, t: TimestampTz): TBox {
		return new TBox(numspan_timestamptz_to_tbox(numSpanPtr, t));
	}

	static fromSet(setPtr: Ptr): TBox {
		return new TBox(set_to_tbox(setPtr));
	}

	static fromSpanSet(spanSetPtr: Ptr): TBox {
		return new TBox(spanset_to_tbox(spanSetPtr));
	}

	/**
	 * Build a TBox from a numeric span and/or a temporal span.
	 * Pass 0 for either argument to omit that dimension.
	 *
	 * @param xSpanPtr  IntSpan.inner or FloatSpan.inner (0 = no X dimension)
	 * @param tSpanPtr  TsTzSpan.inner (0 = no T dimension)
	 */
	static make(xSpanPtr: Ptr, tSpanPtr: Ptr): TBox {
		return new TBox(tbox_make(xSpanPtr, tSpanPtr));
	}

	// -------------------------------------------------------------------------
	// OUTPUT
	// -------------------------------------------------------------------------

	/** @param maxdd decimal digits for float values (default 15) */
	toString(maxdd = 15): string {
		return tbox_out(this._inner, maxdd);
	}

	asHexWKB(variant = 4): string {
		// tbox_as_hexwkb_w requires a valid size_t* output parameter (not NULL).
		// Allocate 8 bytes on the WASM heap as a sink, value is discarded.
		const sizePtr = (
			getModule() as unknown as { allocate(slab: Uint8Array, allocator: number): number }
		).allocate(new Uint8Array(8), 0) as Ptr;
		return tbox_as_hexwkb(this._inner, variant, sizePtr);
	}

	// -------------------------------------------------------------------------
	// ACCESSORS
	// -------------------------------------------------------------------------

	hash(): number {
		return tbox_hash(this._inner);
	}

	/** Whether this TBox has a numeric (X) dimension. */
	hasX(): boolean {
		return tbox_hasx(this._inner);
	}

	/** Whether this TBox has a temporal (T) dimension. */
	hasT(): boolean {
		return tbox_hast(this._inner);
	}

	/** Lower numeric bound (float). */
	xmin(): number {
		return tbox_xmin(this._inner);
	}

	/** Upper numeric bound (float). */
	xmax(): number {
		return tbox_xmax(this._inner);
	}

	/** Whether the lower numeric bound is inclusive. */
	xminInc(): boolean {
		return tbox_xmin_inc(this._inner);
	}

	/** Whether the upper numeric bound is inclusive. */
	xmaxInc(): boolean {
		return tbox_xmax_inc(this._inner);
	}

	/** Lower temporal bound as microseconds since 2000-01-01 UTC. */
	tmin(): TimestampTz {
		return tbox_tmin(this._inner);
	}

	/** Upper temporal bound as microseconds since 2000-01-01 UTC. */
	tmax(): TimestampTz {
		return tbox_tmax(this._inner);
	}

	/** Whether the lower temporal bound is inclusive. */
	tminInc(): boolean {
		return tbox_tmin_inc(this._inner);
	}

	/** Whether the upper temporal bound is inclusive. */
	tmaxInc(): boolean {
		return tbox_tmax_inc(this._inner);
	}

	// -------------------------------------------------------------------------
	// TOPOLOGICAL PREDICATES
	// -------------------------------------------------------------------------

	isAdjacent(other: TBox): boolean {
		return adjacent_tbox_tbox(this._inner, other.inner);
	}

	isContainedIn(other: TBox): boolean {
		return contained_tbox_tbox(this._inner, other.inner);
	}

	contains(other: TBox): boolean {
		return contains_tbox_tbox(this._inner, other.inner);
	}

	overlaps(other: TBox): boolean {
		return overlaps_tbox_tbox(this._inner, other.inner);
	}

	isSame(other: TBox): boolean {
		return same_tbox_tbox(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// POSITION ON X AXIS
	// -------------------------------------------------------------------------

	isLeft(other: TBox): boolean {
		return left_tbox_tbox(this._inner, other.inner);
	}

	isOverOrLeft(other: TBox): boolean {
		return overleft_tbox_tbox(this._inner, other.inner);
	}

	isRight(other: TBox): boolean {
		return right_tbox_tbox(this._inner, other.inner);
	}

	isOverOrRight(other: TBox): boolean {
		return overright_tbox_tbox(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// POSITION ON T AXIS
	// -------------------------------------------------------------------------

	isBefore(other: TBox): boolean {
		return before_tbox_tbox(this._inner, other.inner);
	}

	isOverOrBefore(other: TBox): boolean {
		return overbefore_tbox_tbox(this._inner, other.inner);
	}

	isAfter(other: TBox): boolean {
		return after_tbox_tbox(this._inner, other.inner);
	}

	isOverOrAfter(other: TBox): boolean {
		return overafter_tbox_tbox(this._inner, other.inner);
	}

	// -------------------------------------------------------------------------
	// SET OPERATIONS
	// -------------------------------------------------------------------------

	intersection(other: TBox): TBox | null {
		const ptr = intersection_tbox_tbox(this._inner, other.inner);
		return ptr === 0 ? null : new TBox(ptr);
	}

	/**
	 * Union of two TBoxes.
	 * @param strict if true, throws when the boxes do not overlap or touch
	 */
	union(other: TBox, strict = false): TBox {
		return new TBox(union_tbox_tbox(this._inner, other.inner, strict));
	}

	// -------------------------------------------------------------------------
	// CONVERSIONS
	// -------------------------------------------------------------------------

	toIntSpan(): Ptr {
		return tbox_to_intspan(this._inner);
	}

	toFloatSpan(): Ptr {
		return tbox_to_floatspan(this._inner);
	}

	toTsTzSpan(): Ptr {
		return tbox_to_tstzspan(this._inner);
	}

	// -------------------------------------------------------------------------
	// MATH
	// -------------------------------------------------------------------------

	expandInt(i: number): TBox {
		return new TBox(tintbox_expand(this._inner, i));
	}

	expandFloat(d: number): TBox {
		return new TBox(tfloatbox_expand(this._inner, d));
	}

	round(maxdd: number): TBox {
		return new TBox(tbox_round(this._inner, maxdd));
	}

	shiftScaleInt(shift: number, width: number, hasShift = true, hasWidth = true): TBox {
		return new TBox(tintbox_shift_scale(this._inner, shift, width, hasShift, hasWidth));
	}

	shiftScaleFloat(shift: number, width: number, hasShift = true, hasWidth = true): TBox {
		return new TBox(tfloatbox_shift_scale(this._inner, shift, width, hasShift, hasWidth));
	}

	// -------------------------------------------------------------------------
	// COMPARISONS
	// -------------------------------------------------------------------------

	eq(other: TBox): boolean {
		return tbox_eq(this._inner, other.inner);
	}

	ne(other: TBox): boolean {
		return tbox_ne(this._inner, other.inner);
	}

	lt(other: TBox): boolean {
		return tbox_lt(this._inner, other.inner);
	}

	le(other: TBox): boolean {
		return tbox_le(this._inner, other.inner);
	}

	gt(other: TBox): boolean {
		return tbox_gt(this._inner, other.inner);
	}

	ge(other: TBox): boolean {
		return tbox_ge(this._inner, other.inner);
	}

	/** Returns -1, 0, or 1. */
	cmp(other: TBox): number {
		return tbox_cmp(this._inner, other.inner);
	}
}
