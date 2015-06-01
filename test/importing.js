import C3 from "../C3";
import { assert as assert } from "chai";

describe( "Import the C3 package", ( ) => {

	it( "should export a default C3 function", ( ) => {

		assert.isFunction( C3, "C3 is not a function" );

	});

});