# To run this script, `cd` to the `./test/fixtures` directory and then, from the Julia terminal, `include("./runner.jl")`.

import JSON

# Small values:
x = linspace( 1e-200, 1e-308, 1007 )

y = Array( Any, length(x) )
for i in eachindex(x)
	y[i] = bits( x[i] )
end

data = Dict([
	("x", x),
	("expected", y)
])

outfile = open("bits_1e-200_1e-308.json", "w")
write( outfile, JSON.json(data) )
close( outfile );


# Medium values:
x = linspace( -1e3, 1e3, 1007 )

y = Array( Any, length(x) )
for i in eachindex(x)
	y[i] = bits( x[i] )
end

data = Dict([
	("x", x),
	("expected", y)
])

outfile = open("bits_-1e3_1e3.json", "w")
write( outfile, JSON.json(data) )
close( outfile );


# Large values:
x = linspace( 1e200, 1e308, 1007 )

y = Array( Any, length(x) )
for i in eachindex(x)
	y[i] = bits( x[i] )
end

data = Dict([
	("x", x),
	("expected", y)
])

outfile = open("bits_1e200_1e308.json", "w")
write( outfile, JSON.json(data) )
close( outfile );


# Subnormal values:
x = linspace( 1.12e-308, 5e-324, 1007 )

y = Array( Any, length(x) )
for i in eachindex(x)
	y[i] = bits( x[i] )
end

data = Dict([
	("x", x),
	("expected", y)
])

outfile = open("bits_1e-308_5e-324.json", "w")
write( outfile, JSON.json(data) )
close( outfile );
