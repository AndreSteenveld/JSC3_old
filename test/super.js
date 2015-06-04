import C3 from "../C3";
import { assert as assert } from "chai";

describe( "Calling the super -", ( ) => {

	function test_constructor_callstack( klass, expectation ){

		let callstack = [ ],
			instance  = new klass( callstack );

		assert( 
			callstack.join( ", " ) === expectation.join( ", " ), 
			  `Calling the constructors for ${klass.name} has failed`
			+ `\n        Expecting :: ${expectation}`
			+ `\n        Callstack :: ${callstack}`
		)

	}

	function test_method_callstack( klass, expectation ){
		let callstack = [ ],
			instance  = new klass( [ ] );

		instance.method( callstack );

		assert(
			callstack.join( ", " ) === expectation.join( ", " ),
			  `Calling the methods on ${klass.name} has failed`
			+ `\n        Expecting :: ${expectation}`
			+ `\n        Callstack :: ${callstack}`	
		)
	}

	class O { 
		O( a ){ a.push( "O#O" ); }
		method( a ){ a.push( "O#method" ); }
		constructor( ){ throw new Error( "O#constructor" ); }
	}

	class A extends O { 
		A( a ){ a.push( "A#A" ); }
		method( a ){ super.method( a ); a.push( "A#method" ); }
		constructor( ){ throw new Error( "A#constructor" ); super( ); }
	}

	class B extends O { 
		B( a ){ a.push( "B#B" ); }
		method( a ){ super.method( a ); a.push( "B#method" ); }	
		constructor( ){ throw new Error( "B#constructor" ); super( ); }
	}

	class C extends O { 
		C( a ){ a.push( "C#C" ); }
		method( a ){ super.method( a ); a.push( "C#method" ); }		
		constructor( ){ throw new Error( "C#constructor" ); super( ); }
	}

	class D extends O { 
		D( a ){ a.push( "D#D" ); }
		method( a ){ super.method( a ); a.push( "D#method" ); }	
		constructor( ){ throw new Error( "D#constructor" ); super( ); }
	}

	class E extends O { 
		E( a ){ a.push( "E#E" ); }
		method( a ){ super.method( a ); a.push( "E#method" ); }
		constructor( ){ throw new Error( "E#constructor" ); super( ); }
	}

	//
	// C3 classes
	//
	class K1 extends C3( A, B, C ){ 
		K1( a ){ a.push( "K1#K1" ); }
		method( a ){ super.method( a ); a.push( "K1#method" ); }
		constructor( a ){ super({ base : K1 }, a ); }			
	}

	class K2 extends C3( D, B, E ){ 
		K2( a ){ a.push( "K2#K2" ); }
		method( a ){ super.method( a ); a.push( "K2#method" ); }
		constructor( a ){ super({ base : K2 }, a ); }		
	}

	class K3 extends C3( D, A ){ 
		K3( a ){ a.push( "K3#K3" ); }
		method( a ){ super.method( a ); a.push( "K3#method" ); }
		constructor( a ){ super({ base : K3 }, a ); }		
	}

	//
	// Inheriting from C3 classes
	//
	class Z extends C3( K1, K2, K3 ){ 
		Z( a ){ a.push( "Z#Z" ); }
		method( a ){ super.method( a ); a.push( "Z#method" ); }
		constructor( a ){ super({ base : Z }, a ); }		
	}

	it( 
		"constructor for K1", 
		test_constructor_callstack.bind( null, K1, [ "O#O", "C#C", "B#B", "A#A", "K1#K1" ] ) 
	);

	it( 
		"constructors for K2", 
		test_constructor_callstack.bind( null, K2, [ "O#O", "E#E", "B#B", "D#D", "K2#K2" ] )
	);

	it( 
		"constructors for K3", 
		test_constructor_callstack.bind( null, K3, [ "O#O", "A#A", "D#D", "K3#K3" ] )
	);

	it( 
		"constructors for Z", 
		test_constructor_callstack.bind( null, Z, [ "O#O", "E#E", "C#C", "B#B", "A#A", "D#D", "K3#K3", "K2#K2", "K1#K1", "Z#Z" ] )
	);

	it(
		"methods for K1",
		test_method_callstack.bind( null, K1, [ "O#method", "C#method", "B#method", "A#method", "K1#method" ] )
	);
	
	it( 
		"methods for K2", 
		test_method_callstack.bind( null, K2, [ "O#method", "E#method", "B#method", "D#method", "K2#method" ] )
	);
	
	it( 
		"methods for K3", 
		test_method_callstack.bind( null, K3, [ "O#method", "A#method", "D#method", "K3#method" ] )
	);
	
	it( 
		"methods for Z", 
		test_method_callstack.bind( null, Z, [ "O#method", "E#method", "C#method", "B#method", "A#method", "D#method", "K3#method", "K2#method", "K1#method", "Z#method" ] )
	);

});