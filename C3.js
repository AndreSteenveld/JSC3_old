
function mixin( child, parent ){

	[ ]
		.concat( Object.getOwnPropertyNames( parent.prototype ) )
		
		// TODO: I am not completly sure what O.getOwnPropertyDescriptor will do when it is fed a symbol
		//       and because currently nothing really implements symbols properly we are going to leave
		//       this untill a later time.
		// .concat( Object.getOwnPropertySymbols( parent.prototype ) )
	
		//
		// We filter out the constructor because this one is magically done by either the JS engine,
		// babel, traceur, etc. We will define our own constructor which initialize the parent and
		// extend the instance we are creating with stuff from that object.
		//
		.filter( ( identifier ) => identifier !== "constructor" )
		.forEach( ( identifier ) => {

			let descriptor = Object.getOwnPropertyDescriptor( parent.prototype, identifier );

			Object.defineProperty( child.prototype, identifier, descriptor );					

		});

	return class extends child { };

}

function merge( ...sequences ){ 

	let result = [ ]; 

	while( true ){

		sequences = sequences.filter( s => !!s.length );

		if( !sequences.length )
			return result;

		let candidate = null,
			sequence  = null;

		for( sequence of sequences ){

			candidate = sequence[ 0 ];

			let head = sequences.every( s => !s.includes( candidate, 1 )  );

			if( !head )
				candidate = null;
			else
				break;

		}

		if( null === candidate )
			throw new Error( "Inconsistent hierachy" );

		result.unshift( candidate );

		sequences.forEach( s => s[ 0 ] === candidate && s.shift( ) );		

	}

} 

function parents( child ){
	
	//
	// The goal of this function is to walk up the prototype chain untill it doesn't
	// make sense anymore. The moment we hit a C3 class we will take the array of
	// bases and not the class itself as that is just place holder to make inheritance
	// work. Based on the chain we will generate a completly new C3 class for this
	// specific case.
	//
	let parent = child.hasOwnProperty( "bases" )
			? child
			: Object.getPrototypeOf( child );

	if( typeof parent !== "function" || parent.name === "Empty" ) 
		return [ ];

	if( parent.hasOwnProperty( "bases" ) )
		return parent.bases;

	return [ parent ].concat( parents( parent ) );				

}


export default function( ...supers ){

	let sequences = supers.map( ( c ) => [ c ].concat( parents( c ) ) ),
		bases     = merge( Array.from( supers ), ...sequences ),
		base      = class { };

	for( let clazz of bases ){

		base = mixin( base, clazz );

	}

 	return class extends base {
		static get bases( ){ return Array.from( bases ).reverse( ); }	
		static get supers( ){ return Array.from( supers ); }

		constructor( { base = null } = { }, ...rest ){

			let args        = base === null ? Array.from( arguments ) : rest,
				args_length = args.length;
			
			// Babel makes a funny when trying to spread arguments over a super call, so just to prevent
			// everything blowing up while ES6 is nopt properly implmented yet we will spread the arguments
			// by hand. If there are more then 16 arguments (which is a A LOT!) everything will just blow up.			
			args_length ===  0 ? super( )
				: args_length ===  1 ? super( args[ 1 ] )
				: args_length ===  2 ? super( args[ 1 ], args[ 2 ] )
				: args_length ===  3 ? super( args[ 1 ], args[ 2 ], args[ 3 ] )
				: args_length ===  4 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ] )
				: args_length ===  5 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ] )
				: args_length ===  6 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ] )
				: args_length ===  7 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ] )
				: args_length ===  8 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args[ 8 ] )
				: args_length ===  9 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args[ 8 ], args[ 9 ] )
				: args_length === 10 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args[ 8 ], args[ 9 ], args[ 10 ] )
				: args_length === 11 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args[ 8 ], args[ 9 ], args[ 10 ], args[ 11 ] )
				: args_length === 12 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args[ 8 ], args[ 9 ], args[ 10 ], args[ 11 ], args[ 12 ] )
				: args_length === 13 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args[ 8 ], args[ 9 ], args[ 10 ], args[ 11 ], args[ 12 ], args[ 13 ] )
				: args_length === 14 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args[ 8 ], args[ 9 ], args[ 10 ], args[ 11 ], args[ 12 ], args[ 13 ], args[ 14 ] )
				: args_length === 15 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args[ 8 ], args[ 9 ], args[ 10 ], args[ 11 ], args[ 12 ], args[ 13 ], args[ 14 ], args[ 15 ] )
				: args_length === 16 ? super( args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args[ 8 ], args[ 9 ], args[ 10 ], args[ 11 ], args[ 12 ], args[ 13 ], args[ 14 ], args[ 15 ], args[ 16 ] )
				: null;

			for( let base of bases )
				typeof this[ base.name ] === "function" && this[ base.name ]( ...args );

			base !== null
				&& typeof base.prototype[ base.name ] === "function" 
				&& base.prototype[ base.name ].apply( this, args );

		}
	};

}


