"use strict";

export default function Type({ prototype = null } = { }){

	let instance = new Function( "", "return this;" );
	
	instance.prototype = Object.create( prototype );
	instance.prototype.constructor = instance;

	return instance;

};
