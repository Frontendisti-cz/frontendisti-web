$.fn.skGet = function(get, dimension, callback) {
	if(!this.length){
		return this;
	}

	var result;
	var m = Math[get];
	this.each(function(index) {
		var newResult = $(this)[dimension]();
		result = index ? m(result, newResult) : newResult;
	});

	if(typeof callback == 'function'){
		callback.call(this, result);
		return this;
	}

	return result;
};

$.fn.EqHeight = function(selector, rule, get)
{
	var ret;

	// Equalize height
	this
		.find(selector)
			.css(rule || 'min-height', '')
			.skGet('min', 'height', function(val)
			{
				this.css(rule || 'min-height', val)

				if( get )
				{
					ret = val;
				}
			});

	// return val or jQuery object
	return ret || this;
}


$.fn.EqHeightRow = function(equals, notRow, rule, get){

	var $items = this;
	var off = 0;
	var row = 0;
	var last = 0;
	var rows = [];
	var ret;

	if(this.length)
	{
		if( notRow )
		{
			// each items of array
			if($.isArray(equals))
			{
				for (var j = 0, l = equals.length; j < l; j++)
				{
					ret = $items.EqHeight( equals[j], rule, get );
				}
			}
			// string
			else
			{
				ret = $items.EqHeight( equals, rule, get );
			}
		}
		else
		{
			// Set row
			for (var i = 0, l = $items.length; i < l; i++)
			{
				newOff = $items[i].offsetTop;

				if(off !== newOff && i !==0 )
				{
					rows[row] = [last, i];
					last = i;
					row++;
				}

				if( i === l - 1)
				{
					rows[row] = [last, i + 1];
				}

				off = newOff;
			}

			// Each rows
			for (var i=0; i < rows.length; i++)
			{

				var $slice = $items.slice(rows[i][0], rows[i][1]);

				// each items of array
				if($.isArray(equals))
				{
					for (var j = 0, l = equals.length; j < l; j++)
					{
						ret = $slice.EqHeight( equals[j], rule, get );
					}
				}
				// string
				else
				{
					ret = $slice.EqHeight( equals, rule, get );
				}

			}
		}
	}

	// return val or jQuery object
	return ret && !ret.jquery ? ret : $items;
};
