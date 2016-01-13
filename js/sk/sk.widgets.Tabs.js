(function(sk, $){

	/*
	 *  Konstruktor pro Záložky
	 */
	 /*
	 	TODO: regulár na komplikovanější hash (#hash1&hash2&tab=test)
	 */


	sk.widgets.Tabs = function(element, options){
		this.$element = element.jquery ? element : $(element);
		this.options = $.extend({
			current: 0,
			item: 'a',
			eventName: 'click touchstart',
			tabHideClass: 'sk-tab-hide',
			menuActiveClass: 'active',
			onActiveTab: function(){},
			history: false
		}, options);
		this.startIndex = this.currentIndex = this.options.current;
		this.currentId = null;
		// tabs menu
		this.$menu = this.$element.find(this.options.item);
		// tabs fragment
		this.$tabs = $( this.$menu.map(function(){ return $(this).prop('hash') }).get().join(', ') );

		return this;
	};

	sk.widgets.Tabs.prototype.init = function()
	{
		if(!this.$element.length){
			return this;
		}

		this.$activeTab = null;

		var o = this.options;
		this.$menu.bind(o.eventName, $.proxy(this.handle, this));

		$(window).on('resize', $.proxy(this.handleResize, this));

		// určování která záložka má být defaultně aktivní
		if(o.history)
		{
			this.hash();
		}
		else
		{
			this.set(this.currentIndex);
		}

		return this;
	};

	sk.widgets.Tabs.prototype.hash = function()
	{
		var o = this.options;
		// určování která záložka má být defaultně aktivní
		var tab = '';
		var scroll = '';

		var hash = location.hash.slice(1);
		if(hash)
		{

	        hash = hash.split('tab=');
	       	hash = hash[hash.length - 1];
	       	hash = hash.replace(/^.[^a-z]/g, '');
			this.$tabs.each(function()
			{
		        if($(this).is('#'+hash)){
		        	tab = '#' + $(this).attr('id');

		        	if(location.hash.indexOf('tab=') == -1){

						scroll = '#' + hash;
					}
		        }
		        else if($(this).find('#'+ hash).length){
		        	tab = '#' + $(this).attr('id');
		        	scroll = '#' + hash;
		        }
			})
		}
		// pokud není žádný hash vrátit do startovní záložky
		else if(!/#$/.test(location.href))
		{
			this.currentIndex = this.startIndex;
		}

		this.set(tab || this.currentIndex, scroll);
	};

	sk.widgets.Tabs.prototype.handle = function(e)
	{
		var $target = $(e.currentTarget),
			href = $target.prop('hash').slice(1);

		if(this.options.history)
		{
		    // pokud záložka již není aktivní tak nastavit
		    if(!$target.hasClass(this.options.menuActiveClass))
		    {
		   		location.hash = '#tab=' + href;
		   	}
		}
		else
		{
		   	this.set('#'+href);
		}

		e.preventDefault();
	};

	sk.widgets.Tabs.prototype.set = function(current, scroll)
	{
		var id = typeof current == 'number' ? this.$menu.eq(current).prop('hash') : current;

		if(this.currentId !== id){
			this.currentIndex = this.$menu.filter(function(){ return $(this).prop('hash') === id }).index();
			this.currentId = id;
			this.setTab(id);
			this.setMenu(id);

			scroll && $('html, body').animate({'scrollTop': $(scroll).offset().top}, 500);
		}
	};

	sk.widgets.Tabs.prototype.setTab = function(id)
	{
		if(!this.$activeTab)
		{
			this.$tabs.addClass('js-hide');
			this.$activeTab = this.$tabs.filter(id).removeClass('js-hide');

			this.$activeTab.parent().height( this.$activeTab.outerHeight() )

			return;
		}

		$(this).trigger('beforeActivate');

		this.$activeTab.fadeOut(400)
		this.$activeTab = this.$tabs.filter(id).hide().removeClass('js-hide').fadeIn(400)

		this.$activeTab.parent().animate({ 'height': this.$activeTab.outerHeight() }, 400, $.proxy(function()
		{
			$(this).trigger('activate');
		}, this));

	};

	sk.widgets.Tabs.prototype.setMenu = function(id){
		this.$menu
			.removeClass(this.options.menuActiveClass)
			.filter(function(){ return $(this).prop('hash') === id })
			.addClass(this.options.menuActiveClass);
	};

	sk.widgets.Tabs.prototype.handleResize = function()
	{
		this.$activeTab.parent().height( this.$activeTab.outerHeight() )
	}

})(sk, jQuery);