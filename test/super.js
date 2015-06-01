import C3 from "../C3";
import { assert as assert } from "chai";

describe( "Calling super methods and constructor should just work", ( ) => {

	class O { 
		O( a ){ a.push( "O#O" ); }
		method( a ){ a.push( "O#method" ); }
		constructor( a ){ a.push( "O#constructor"); }		
	}

	class A extends O { 
		A( a ){ a.push( "A#A" ); }
		method( a ){ super.method( a ); a.push( "A#method" ); }			
		constructor( a ){ super( a ); a.push( "A#constructor"); }		
	}

	class B extends O { 
		B( a ){ a.push( "B#B" ); }
		method( a ){ super.method( a ); a.push( "B#method" ); }
		constructor( a ){ super( a ); a.push( "B#constructor"); }		
	}

	class C extends O { 
		C( a ){ a.push( "C#C" ); }
		method( a ){ super.method( a ); a.push( "C#method" ); }
		constructor( a ){ super( a ); a.push( "C#constructor"); }		
	}

	class D extends O { 
		D( a ){ a.push( "D#D" ); }
		method( a ){ super.method( a ); a.push( "D#method" ); }
		constructor( a ){ super( a ); a.push( "D#constructor"); }		
	}

	class E extends O { 
		E( a ){ a.push( "E#E" ); }
		method( a ){ super.method( a ); a.push( "E#method" ); }
		constructor( a ){ super( a ); a.push( "E#constructor"); }		
	}

	//
	// C3 classes
	//
	class K1 extends C3( A, B, C ){ 
		K1( a ){ a.push( "K1#K1" ); }
		method( a ){ super.method( a ); a.push( "K1#method" ); }
		constructor( a ){ super({ base : K1 }, a ); a.push( "K1#constructor"); }			
	}

	class K2 extends C3( D, B, E ){ 
		K2( a ){ a.push( "K2#K2" ); }
		method( a ){ super.method( a ); a.push( "K2#method" ); }
		constructor( a ){ super({ base : K2 }, a ); a.push( "K2#constructor"); }		
	}

	class K3 extends C3( D, A ){ 
		K3( a ){ a.push( "K3#K3" ); }
		method( a ){ super.method( a ); a.push( "K3#method" ); }
		constructor( a ){ super({ base : K3 }, a ); a.push( "K3#constructor"); }		
	}

	//
	// Inheriting from C3 classes
	//
	class Z extends C3( K1, K2, K3 ){ 
		Z( a ){ a.push( "Z#Z" ); }
		method( a ){ super.method( a ); a.push( "Z#method" ); }
		constructor( a ){ super({ base : Z }, a ); a.push( "Z#constructor"); }		
	}

	it( "calling :: K1 - constructors", ( ) => {
		let expectation = [ "O#constructor", "C#constructor", "B#constructor", "A#constructor", "O#O", "C#C", "B#B", "A#A", "K1#K1", "K1#constructor" ],
			callstack   = [ ],
			instance    = new K1( callstack );

		console.log( callstack );

		for( let i = 0; i < expectation.length - 1; i++ )
			assert.equal( callstack[ i ], expectation[ i ], `at [ ${i} ]` );
	});

});