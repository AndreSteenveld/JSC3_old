
import Type from "./Type";

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
	let parent = "bases" in child
			? child
			: Object.getPrototypeOf( child );

	if( typeof parent !== "function" || parent.name === "Empty" ) 
		return [ ];

	if( "bases" in parent )
		return parent.bases;

	return [ parent ].concat( parents( parent ) );				

}

export class Base extends Type {
	
	constructor( supers, bases ){

		return class extends super( ) {

			static get bases( ){ return Array.from( bases ).reverse( ); }	
			static get supers( ){ return Array.from( supers ); }

			constructor( ){

				super( );

				for( let base of bases )
					typeof this[ base.name ] === "function" && this[ base.name ].apply( this, Array.from( arguments ) );

				let name = Object.getPrototypeOf( this ).constructor.name;

				typeof this[ name ] === "function"
					&& this[ name ].apply( this, Array.from( arguments ) );

			}	

			get super( ) {
				throw new Error( "Not implemented yet!" );
			}

		}

	}

}

export default class C3 extends Type {

	constructor( ...supers ){

		let instance  = super( ),
			sequences = supers.map( ( c ) => [ c ].concat( parents( c ) ) ),
			bases     = merge( Array.from( supers ), ...sequences ),
			base      = class extends new Base( supers, bases ) { };

		return class extends bases.reduce( mixin, base ) { };

	}

}

export function c3( ...supers ){

	return new C3( ...supers );

}


