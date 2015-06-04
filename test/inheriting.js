import C3 from "../C3";
import { assert as assert } from "chai";

describe( "When inheriting using C3 -", ( ) => {

	it( "all classes should have a bases and supers array", ( ) => {

		const 
			O = class { },

			A = class extends O { },
			B = class extends O { },
			C = class extends O { },
			D = class extends O { },
			E = class extends O { };

		const
			K1 = class extends C3( A, B, C ){ },
			K2 = class extends C3( D, B, E ){ },
			K3 = class extends C3( D, A ){ },

			Z  = class extends C3( K1, K2, K3 ){ };


		for( let c of [ K1, K2, K3, Z ] ){

			assert( c, "class is undefined" );
		
			assert( c.supers, `[ ${c.name} ] doesn't have a supers array` );
			assert( c.bases, `[ ${c.name} ] doesn't have a bases array` );

			assert( c.supers.length, `[ ${c.name} ] supers is empty` );
			assert( c.bases.length, `[ ${c.name} ] bases is empty` );

			/*
			console.log( ""
				+ `[ ${c.name} ]`
				+ "\n\t supers :: " + c.supers.map( c => c.name || "<null>" ).join( ", " ) 
				+ "\n\t bases  :: " + c.bases.map( c => c.name || "<null>" ).join( ", " )
			);
			*/
		
		}			

		let k1_bases = [ A, B, C, O ].map( c => c.name ).join( "," ),
			k2_bases = [ D, B, E, O ].map( c => c.name ).join( "," ),
			k3_bases = [ D, A, O ].map( c => c.name ).join( "," ),
			z_bases  = [ K1, K2, K3, D, A, B, C, E, O ].map( c => c.name ).join( "," );

		assert( K1.bases.map( c => c.name ).join( "," ) === k1_bases, "Bases order of K1 is invalid" );
		assert( K2.bases.map( c => c.name ).join( "," ) === k2_bases, "Bases order of K2 is invalid" );
		assert( K3.bases.map( c => c.name ).join( "," ) === k3_bases, "Bases order of K3 is invalid" );

		assert( Z.bases.map( c => c.name ).join( "," ) === z_bases, "Bases order of Z is invalid" );

	});

	it( "base class methods should be callable", ( ) => {

		const 
			A = class { method( ){ return "method"; } },
			B = class extends C3( A ){ };

		let b = new B( );

		assert( b.method( ) === "method", "A#method() was never called or returned an invalid value" );

	})

	it( "methods should be chained the same way as without C3", ( ) => {

		const
			A = class           { method( ){ return [ "A" ]; } },
			B = class extends A { method( ){ return super.method( ).concat( [ "B" ] ); } },
			C = class extends B { method( ){ return super.method( ).concat( [ "C" ] ); } };

		const
			D = class                 { method( ){ return [ "D" ]; } },
			E = class extends C3( D ) { method( ){ return super.method( ).concat( [ "E" ] ); } },
			F = class extends C3( E ) { method( ){ return super.method( ).concat( [ "F" ] ); } };

		assert( ( new C( ) ).method( ).join( "" ) === "ABC", "Something is wrong with the ES6 classes" );
		assert( ( new F( ) ).method( ).join( "" ) === "DEF", "C3 didn't call the methods in the proper order" );


	});	

	it( "you can inherit from nothing", ( ) => {

		const A = class extends C3( ){ constructor( ){ super( ); this.value = "success"; } };

		assert( ( new A( ) ).value === "success", "The value property wasn't set or the constructor has malfunctioned somehow" );

	});

	//
	// We are going to skip the next few tests; Getting these to work in a way that makes sense is a lot
	// harder than it seems as ES6 will not allow us the fiddle around with the constructor. Its not
	// allowed to call a class function by using call and providing a scope. (same applies for apply
	// and bind) For more tests calling the supers of things (methods, initializators and constructors)
	// see the super.js file in the same directory as this one.
	//
	it.skip( "constructors should be chained the same way as without C3", ( ) => {

		const
			A = class           { constructor( ){                        this.chain = [ "A" ]; } },
			B = class extends A { constructor( ){ super( ...arguments ); this.chain.push( "B" ); } },
			C = class extends B { constructor( ){ super( ...arguments ); this.chain.push( "C" ); } };

		const 
			D = class                 { constructor( ){ this.chain = [ "D" ]; } },
			E = class extends C3( D ) { constructor( ){ super( ); this.chain.push( "E" ); } },
			F = class extends C3( E ) { constructor( ){ super( ); this.chain.push( "F" ); } };

		assert( ( new C( ) ).chain.join( "" ) === "ABC", "Something is wrong with the ES6 classes" );
		assert( ( new F( ) ).chain.join( "" ) === "DEF", "C3 didn't call the constructors in the proper order" );

	});

	it.skip( "we call the constructor and then call the appropiate initialization methods" , ( ) =>{

		class A {

			constructor( a ){ a.push( 1 ); }
			A( a ){ a.push( 2 ); }

		}

		class B extends C3( A ) {

			constructor( ){ super({ base : B }, ...Array.from( arguments ) ); }

			B( a ){ a.push( 3 ); }

		}

		let array    = [ 0 ],
			instance = new B( array );

		assert( array.join( "" ) === "0123", "The constructor and initialization function were not called or called in the wrong order" );

	});

	it.skip( "ommiting the constructor will cause the the initialization methods to be skipped", ( ) =>{
		class A {

			constructor( a ){ a.push( 1 ); }
			A( a ){ a.push( 2 ); }

		}

		class B extends C3( A ) {

			B( a ){ a.push( 3 ); }

		}

		let array    = [ 0 ],
			instance = new B( array );

		assert( array.join( "" ) === "012", "THe constructor and initialization function were not called or called in the wrong order" );

	});

});