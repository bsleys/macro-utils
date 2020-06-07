export function MacroUtils () {
	//takes two tokens of any size and calculates the distance between them
	function getDistance (t1, t2) {
		var x, x1, y, y1, d, r, segments=[], rdistance, distance;
		for (x = 0; x < t1.data.width; x++) {
			for (y = 0; y < t1.data.height; y++) {
		   		const origin = new PIXI.Point(...canvas.grid.getCenter(t1.data.x + (canvas.dimensions.size * x), t1.data.y + (canvas.dimensions.size * y)));
		    	for (x1 = 0; x1 < t2.data.width; x1++) {
		      		for (y1 = 0; y1 < t2.data.height; y1++){
				   		const dest = new PIXI.Point(...canvas.grid.getCenter(t2.data.x + (canvas.dimensions.size * x1), t2.data.y + (canvas.dimensions.size * y1)));
				   		segments.push({ray: new Ray(origin, dest)});
		    		}
				}
			}
		}
		rdistance = canvas.grid.measureDistances(segments, {gridSpaces:true});
		distance = rdistance[0];
		rdistance.forEach(d=> {if (d < distance) distance = d;});
		return distance;		
	};
	/** 
	*** The below functions are modified versions from Minor Quality of Life Module by tposney
	***/
	function getTraitMult(actor, dmgTypeString) {
	    if (dmgTypeString !== "") {
	      if (actor.data.data.traits.di.value.includes(dmgTypeString)) return 0;
	      if (actor.data.data.traits.dr.value.includes(dmgTypeString)) return 0.5;
	      if (actor.data.data.traits.dv.value.includes(dmgTypeString)) return 2;
	    }
	    if (dmgTypeString === "healing" || dmgTypeString === "temphp") return -1;
	  return 1;
	};
	// Calculate the hp/tempHP lost for an amount of damage of type
	function calculateDamage(a, appliedDamage) {
	  let value = Math.floor(appliedDamage);
	  var hp = a.data.data.attributes.hp, tmp = parseInt(hp.temp) || 0, dt = value > 0 ? Math.min(tmp, value) : 0;
	  var newTemp = tmp - dt;
	  var oldHP = hp.value;
	  var newHP = Math.clamped(hp.value - (value - dt), 0, hp.max);
	  return { tempDamage: dt, hpDamage: oldHP - newHP, oldTempHP: tmp, newTempHP: newTemp,
	          oldHP: oldHP, newHP: newHP};
	}
	/**
	*** end MQoL functions
	**/
	return {
		getDistance:getDistance,
		getTraitMult:getTraitMult,
		calculateDamage:calculateDamage,
	};
};

Hooks.once("init", async  function() {
	console.log(`Init Macro-Utils`);
	window.MacroUtils = MacroUtils();
});
