'use strict';

var round = require( 'math-round' );
var pow = require( 'math-power' );
var abs = require( 'math-abs' );
var smallest = require( 'const-smallest-float64' );
var bits = require( './../lib' );

var frac;
var sign;
var exp;
var b;
var x;
var i;

// Convert random numbers to literal bit representations...
for ( i = 0; i < 100; i++ ) {
	if ( Math.random() < 0.5 ) {
		sign = -1;
	} else {
		sign = 1;
	}
	frac = Math.random() * 10;
	exp = round( Math.random()*100 );
	if ( Math.random() < 0.5 ) {
		exp = -exp;
	}
	x = sign * frac * pow( 2, exp );
	b = bits( x );
	log( x, b );
}

function log( x, b ) {
	var sign;
	var frac;
	var tmp;
	var exp;

	console.log( '%d => %s', x, b );

	tmp = b.substring( 0, 1 );
	sign = ( tmp === '1' ) ? -1 : 1;
	console.log( 'sign: %s', tmp );

	tmp = b.substring( 1, 12 );
	exp = parseInt( tmp, 2 )-1023;
	console.log( 'exp: %s => %d', tmp, exp );

	tmp = b.substring( 12 );
	frac = parseInt( tmp, 2 );
	console.log( 'frac: %s => %d', tmp, frac );

	frac = tmp;
	if ( abs(x) < smallest.VALUE ) {
		frac = '0.' + frac;
		exp = -1022; // subnormals are special
	} else {
		frac = '1.' + frac;
	}
	x = sign * frac2double( frac ) * pow( 2, exp );

	console.log( '%d*%s*2^%d = %d\n', sign, frac, exp, x );
}

function frac2double( frac ) {
	var sum;
	var i;
	if ( frac[ 0 ] === '1' ) {
		sum = 1; // 2^0
	} else {
		sum = 0; // subnormals
	}
	for ( i = 2; i < frac.length; i++ ) {
		if ( frac[ i ] === '1' ) {
			sum += pow( 2, -(i-1) );
		}
	}
	return sum;
}
