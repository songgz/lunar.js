/*
* lunar.js v1.0
* by Matthew Gipp (http://number61.net)
* Released under the WTFPL license (http://sam.zoy.org/wtfpl/)
* Updated: Friday, December 28 2012
*/
function Lunar() {
	var self = this;

	/*
	* Creates a Moon object.
	*
	* @param {object} date A JavaScript Date object. If omitted, defaults to today.
	* @return {object} A Moon object
	*
	*	0 => new moon
	*	1 => waxing crescent
	*	2 => first quarter
	*	3 => waxing gibbous
	*	4 => full moon
	*	5 => waning gibbous
	*	6 => third quarter
	*	7 => waning crescent
	*/
	this.Moon = function(config) {
		this.config = config || {};
		this.parent = self;
		
		this.init = function(date) {
			var jd;
			
			if (typeof date === 'number') {
				this.julianDay = date;
				this.date = new Date(this.parent.julianDayToUnixTimestamp(date));
			} else if (typeof date === 'object') {
				this.julianDay = this.parent.getJulianDay(date);
				this.date = date;
			} else {
				this.date = new Date();
				this.julianDay = this.parent.getJulianDay(this.date);
			}
			
			// Divide by the length of an average synodic month:
			jd = this.julianDay / 29.53;
			this.phase = ((jd - Math.floor(jd)) * 8 + 0.5) & 7;
		}

		this.init(this.config.date);
	}

	/*
	* Converts a JS Date object into a Julian day.
	*
	* @param {object} date A JavaScript Date object (optional - defaults to today if omitted)
	* @return {number} The Julian date
	*/
	this.getJulianDay = function(date) {
		var date = date || new Date();
		var month = date.getUTCMonth() + 1;
		var day = date.getUTCDate();
		var year = date.getUTCFullYear();
		var a = Math.floor((14 - month) / 12);
		var y = year + 4800 - a;
		var m = month + (12 * a) - 3;
		var jd = day + Math.floor((((153 * m) + 2) / 5)); 
		jd = jd + (365 * y);
		jd = jd + Math.floor(y / 4);
		jd = jd - Math.floor(y / 100);
		jd = jd + Math.floor(y / 400);
		jd = jd - 32045;	
		return jd;
	}


	this.julianDayToUnixTimestamp = function(jd) {
		var EPOCH = 2440588;
		return (jd - EPOCH) * 86400000;
	}


	/*
	* @param {object} from A JavaScript Date object
	* @param {object} to A JavaScript Date object
	* @return {array} An array populated with one Moon object per day between 'from' and 'to'
	*/
	this.getInterval = function(cfg) {
		var interval = [];
		var a = self.getJulianDay(new Date(cfg.from.year, (cfg.from.month - 1), cfg.from.day));
		var b = self.getJulianDay(new Date(cfg.to.year, (cfg.to.month - 1), cfg.to.day));

		// create one moon object per day
		// use Julian dates for super easy incrementing
		var x = a;
		for (x; x <= b; x++) {
			interval.push(new self.Moon({
				date: x
			}));
		}

		return interval;
	}
}

// instantiate a new Lunar object
var lunar = new Lunar();

// get an array of moon objects representing a given interval
var interval = lunar.getInterval({
	from: {
		day: '25',
		month: '12',
		year: '2012'
	},
	to: {
		day: '10',
		month: '1',
		year: '2013'
	}
});
//@ sourceURL=lunar.js