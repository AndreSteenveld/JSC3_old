
function mixin( child, parent ){

	Object.defineProperties( 

		child.prototype, 
	
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
			// TODOC: All the edgecases we are not catching by executing the parent constructor out of
			//        scope and what we can do against it. 
			//
			.filter( ( identifier ) => identifier !== "constructor" )

			// Now create a map with which we can extend our child.prototype so it all the super calls will
			// resolve as expected.
			.reduce( 
				( map, identifier ) => ( map[ identifier ] = Object.getOwnPropertyDescriptor( parent.prototype, identifier ) ) && map,
				Object.create( null )
			)

	);

	return class extends child {

		// Ok we don't want the parent-supers to be called N times as this would mean the constructor of
		// Object for example might be called a few times. A constructor can set an object in a specific
		// state and calling it multiple times might be harmfull. So in the case that we are inheriting
		// from a non-C3 class we will not call the constructor at all.
		//
		// According to the ES6 spec it isn't allowed to call a class/constructor as a function anymore
		// which would have fixed our problem so we could to something along the lines of:
		//
		//		parent.call( this, ...Array.from( arguments ) );
		//
		//Object.assign( this, Object.create( Object.getPrototypeOf( parent ) ) );

	};

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

			let args = base === null ? Array.from( arguments ) : rest;
			
			super( ...args );

			//console.log( bases.map( b => b.name ).join( ", " ) );

			for( let base of bases )
				typeof this[ base.name ] === "function" && this[ base.name ]( ...args );

			base !== null
				&& typeof base.prototype[ base.name ] === "function" 
				&& base.prototype[ base.name ].apply( this, args );

		}
	};

}


