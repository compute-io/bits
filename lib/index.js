'use strict';

// MODULES //

var pinf = require( 'const-pinf-float64' );
var ninf = require( 'const-ninf-float64' );
var abs = require( 'math-abs' );
var floor = require( 'math-floor' );
var rpad = require( 'utils-right-pad-string' );
var lpad = require( 'utils-left-pad-string' );
var repeat = require( 'utils-repeat-string' );
var div2 = require( './div2.js' );
var mult2 = require( './mult2.js' );


// CONSTANTS //

var BIAS = 1023; // exponent bias => (2**11)/2 - 1


// BITS //

/**
* FUNCTION: bits( x )
*	Returns a string giving the literal bit representation of a double-precision floating-point number.
*
* @param {Number} x - input value
* @returns {String} bit representation
*/
function bits( x ) {
	var nbits;
	var sign;
	var str;
	var exp;
	var n;
	var f;
	var i;

	// Check for a negative value or negative zero...
	if ( x < 0 || 1/x === ninf ) {
		sign = '1';
	} else {
		sign = '0';
	}
	// Special case: +- infinity
	if ( x === pinf || x === ninf ) {
		// Based on IEEE754-1985...
		exp = repeat( '1', 11 ); // all 1s
		str = repeat( '0', 52 ); // all 0s
		return sign + exp + str;
	}
	// Special case: NaN
	if ( x !== x ) {
		// Based on IEEE754-1985...
		exp = repeat( '1', 11 ); // all 1s
		str = '1' + repeat( '0', 51 ); // can't be all 0s
		return sign + exp + str;
	}
	// Special case: 0
	if ( x === 0 ) {
		// Based on IEEE754-1985...
		exp = repeat( '0', 11 ); // all 0s
		str = repeat( '0', 52 ); // all 0s
		return sign + exp + str;
	}
	// Use the normalized value to create a bit representation...
	x = abs( x );

	// Isolate the integer part (digits before the decimal):
	n = floor( x );

	// Isolate the fractional part (digits after the decimal):
	f = x - n;

	// Convert the integer and fractional parts to bit strings:
	n = div2( n );
	f = mult2( f );

	// Determine the exponent needed to normalize the integer+fractional parts...
	if ( n ) {
		// Move the decimal `x` digits to the left:
		exp = n.length - 1;
	} else {
		// Find the first '1' bit...
		for ( i = 0; i < f.length; i++ ) {
			if ( f[ i ] === '1' ) {
				nbits = i + 1;
				break;
			}
		}
		// Move the decimal `x` digits to the right:
		exp = -nbits;
	}
	// Normalize the combined integer+fractional string...
	str = n + f;
	if ( exp < 0 ) {
		// Handle subnormals...
		if ( exp < -BIAS ) {
			// Cap the number of bits removed:
			nbits = BIAS - 1;
		}
		// Remove all leading zeros and the first '1' for normal values, and, for subnormals, remove at most BIAS-1 leading bits:
		str = str.substring( nbits );
	} else {
		// Remove the leading '1' (implicit/hidden bit):
		str = str.substring( 1 );
	}
	// Convert the exponent to a bit string:
	exp = div2( exp + BIAS );
	exp = lpad( exp, 11, '0' );

	// Fill in any trailing zeros and ensure we have only 52 fraction bits:
	str = rpad( str, 52, '0' ).substring( 0, 52 );

	// Return a bit representation:
	return sign + exp + str;
} // end FUNCTION bits()


// EXPORTS //

module.exports = bits;
