(function($)
{

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

	/*******************************************************
		APP
	********************************************************/
	var App = window.App =
	{
		options: {

		},

		$W:			$(window),
		$B:			$('body'),
		$loader: 	$('#loader'),
		$header: 	$('#header'),
		$head: 		$('#header .row-main'),
		$main: 		$('#main'),

		run: function(options)
		{
			var app = this;

			app.options = $.extend(true, app.options, options);

			app.MQ = new sk.utils.MediaQueries({
				'selector' : $('<div id="mq" />').appendTo('body'),
				'queries': {
					'0px': {
						state: 'mobile',
						params: {
							// homeSlideshow: 0,
							// subSlideshow: 0
						}
					},
					'701px': {
						state: 'tablet',
						params: {
							// homeSlideshow: 0,
							// subSlideshow: 0
						}
					},
					'1001px': {
						state: 'desktop',
						params: {
							// homeSlideshow: 0,
							// subSlideshow: 0
						}
					}
				}
			});

			var thickbox = new sk.widgets.Skbox({
				'margin': [40, 40], // sum margin on x and y axis
				'padding': [130, 115], // sum padding on x and y axis
				'width': 10000,
				'height': 10000,
				'tpl': {
					'box': '\
						<div class="skbox-window"> \
							<div class="skbox-inner"> \
								<div class="skbox-slides"></div> \
								<span class="skbox-loader"></span> \
							</div> \
							<a href="#" class="skbox-prev"><span class="icon icon-crossroad-arrow-left"></span></a> \
							<a href="#" class="skbox-next"><span class="icon icon-crossroad-arrow-right"></span></a> \
							<div class="skbox-pages"></div> \
							<a href="#" class="skbox-close"><span class="icon icon-close"></span></a> \
						</div>'
				}
			}).init();

			// Toggle responsive menu
			$('#menu-main')
				.each(function(index, el)
				{
					var $menu = $(this).find('> ul');
					var $toggle = $('.toggle-menu');

					$toggle
						.on('click', function(event)
						{
							event.preventDefault();
							$('body').toggleClass('show-menu');
						});

					$(app.MQ)
						.on('changeMedia', function(event)
						{
							console.log(app.MQ.state)
							if( app.MQ.state == 'desktop')
							{
								$('body').removeClass('show-menu');
							}
						});

					$(document)
						.on('mousedown touchstart', function(event)
						{
							if( !$(event.target).closest('#header').length )
							{
								$('body').removeClass('show-menu');
							}
						});
				});



			// Header scroll animation
			// only if header is fixed
			// var $head = app.$head;
			// var $main = app.$main;
			// var headTop = parseInt( $head.css('padding-top') );
			// var headBottom = parseInt( $head.css('padding-top') );
			var getHeaderOffset = function(scroll)
			{
				if( app.$B.hasClass('no-fixed-header') )
				{
					return 0;
				}

				return app.$header.outerHeight();

				// var newTop = Math.max( headTop - scroll, 10 )
				// var newBottom = Math.max( headBottom - scroll, 10 )

				// return parseInt( app.$B.css('padding-top') ) + newTop + newBottom;
			}

			// if( !app.$B.hasClass('no-fixed-header') && !app.$B.hasClass('error404') && !Modernizr.touch )
			// {
			// 	$(window)
			// 		.on('scroll.head', function(event)
			// 		{
			// 			// fix for chrome negative scroll
			// 			var top = Math.max( $(this).scrollTop() , 0);

			// 			var newTop = Math.max( headTop - top, 10 )
			// 			var newBottom = Math.max( headBottom - top, 10 )

			// 			$head
			// 				.css({
			// 					'padding-top': newTop,
			// 					'padding-bottom': newBottom
			// 				});

			// 			$main
			// 				.css({
			// 					'padding-top': headTop + newBottom + 39
			// 				});
			// 		})
			// 		.trigger('scroll.head')
			// }


			// Lazy load
			// $('img').attr('src', function()
			// {
			// 	return $(this).attr('data-src');
			// });

			// 404
			$('body.error404')
				.each(function(index, el)
				{
					app.$W
						.on('resize.error404', function(event)
						{
							app.$main
								.css('height', '')
								.height( $(window).height() - $('#header').outerHeight(true) - $('#footer').outerHeight(true) );
						})
						.trigger('resize.error404')
				})

			// Hide unused wp calendar tfoot
			$('#wp-calendar tfoot').each(function(index, el)
			{
				if( !$.trim( $(this).text() ) )
				{
					$(this).hide();
				}
			});

			// Section slider
			$('.section-slider, .box-slides')
				.each(function()
				{
					var $box = $(this);

					$box
						.cycle({
							slides: '.section-slide, .slide',
						    prev: $box.find('.pager .prev'),
						    next: $box.find('.pager .next'),
						    pager: $box.find('.pager .pages'),
						    autoHeight: 'calc',
						    pagerTemplate: '<a href=#><span class="vhide">{{slideNum}}</span></a>',
						    pagerActiveClass: 'active',
						    swipe: true,
						    updateView: 0
						})
						.on('cycle-before', function(event, optionHash, outgoingSlideEl, incomingSlideEl)
						{
							setTimeout(function()
							{
								$(incomingSlideEl).find('.section-map, .box-map').trigger('recalcmap');
							}, 10)
						});
				});


			// Tabs
			$('.tabs-line')
				.each(function(i)
				{
					var $this = $(this),
						Tabs = new sk.widgets.Tabs($this, { tabHideClass: 'hide' }).init();

				});


			// Beautify OL
			$('ol[start]')
				.css('counter-reset', function()
				{
					 return 'item ' + ( $(this).prop('start') - 1 )
				})


			$(document)
			// Toggle
				.on('click', '.toggle-title', function(e)
				{
					$(this)
						.next()
							.slideToggle()
							.end()
						.toggleClass('open')

					e.preventDefault();
				})

			// Filter
				.on('click', '.box-filter a', function(event)
				{
					event.preventDefault();

					$.bbq.pushState({ 'filter': $(this).prop('hash').slice(1) });
				})
			// Message
				.on('click', '.message .close', function(event)
				{
					event.preventDefault();

					$(this).closest('.message').fadeTo(200, 0).slideUp(200);
				});

			$(window)
			// Change filter
				.on('hashchange', function(event)
				{
					var filter = $.bbq.getState( 'filter' );

					if(!filter)
					{
						filter = 'all'
					}

					// menu
					$('.box-filter a[href="#'+ filter +'"]').addClass('active').siblings().removeClass('active')

					// items
					var $box = $('.box-filter + .crossroad-portfolio');
					//var $wrap = $box.children();
					var $items = $box.children();


					if( filter === 'all' )
					{
						$items.fadeTo(400, 1);
					}
					else
					{
						$items.filter('.' + filter).fadeTo(400, 1);
						$items.not('.' + filter).fadeTo(400, .2);
					}

				})
				.trigger('hashchange')

				.on("pageshow", function(event)
				{
				    if (event.originalEvent.persisted)
				    {
				    	app.pageIn();
				    }
				})

			// Equalize slides height
				.on('resize.slide', function(event)
				{
					$('.section-slider')
						.each(function(index, el)
						{
							$('.section-holder', this)
								.css('height', '')
								.skGet('max', 'height', function(val)
								{
									this.css('height', val)
								})
						});

				})
				.on('load', function(event)
				{
					$(this).trigger('resize.slide')
					$(App.MQ).trigger('webload');
				})
				.trigger('resize.slide')




			$(document)
				.on('click.pageOut', 'a:not(.thickbox)', app.pageOut)
				//.on('click.pageOut', 'form :submit', app.pageOut);

			app.$W
				.on('load fontload', function(event)
				{
					var hash = location.hash.slice(1);

					if(hash && $('#' + hash).length)
					{
						var top = $('#' + hash).offset().top;
						var headHeight = getHeaderOffset( top );
						app.$W.scrollTop( top - headHeight );
					}
				});

			// protected form - custom
			$('.post-password-form input[type="submit"]').each(function(index, el)
			{
				$(this).replaceWith('<button class="btn" type="submit" name="'+this.name+'"><span>'+ this.value +'</span></button>');
			});


			// Async loads
			// Share
			if( $('.box-likes').length )
			{
				// Facebook
				yepnope.injectJs('//connect.facebook.net/en_EN/all.js#xfbml=1&appId=166438113373362');
				// Google+
				yepnope.injectJs('https://apis.google.com/js/plusone.js');
				// Twitter
				yepnope.injectJs('//platform.twitter.com/widgets.js');
			}

			// Section map
			if( $('.section-map, .box-map').length )
			{
				yepnope.injectJs('//maps.google.com/maps/api/js?sensor=false&callback=App.mapInit');
			}

			// Load fonts
			if( typeof Typekit !== 'undefined')
			{
				var fontLoad = function()
				{
					if( $('html').hasClass('wf-active') )
					{
						app.$W
							.trigger('resize.slide')
							.trigger('fontload');

						$(App.MQ)
							.trigger('fontload');

						return;
					}
					setTimeout(fontLoad, 50);
				}
				fontLoad();
			}

			// Grid image size
			$(App.MQ)
				.on('resizeMedia changeMedia fontload webload', function(event)
				{
					$('.grid .col')
						// what, not in-row, css rule, return new value
						.EqHeightRow(['.img-content:only-child'], false, 'height', false);
				});

			// Scroll To
			app.$B
				.on('click', 'a[href^="#"]:not(.noscroll)', function(event)
				{
					var hash = $(this).prop('hash').slice(1);

					if(hash && $('#' + hash).length)
					{
						event.preventDefault();

						var top = $('#' + hash).offset().top;
						var headHeight = getHeaderOffset( top );
						$('body, html').animate({scrollTop: top - headHeight}, 300);
					}
				});

			app.MQ.init();

			// Page load
			app.pageIn()
		},

		pageIn: function()
		{
			setTimeout(function()
			{
				App.$loader
					.fadeOut(350)
			}, 300)
		},

		pageOut: function(event)
		{
			var $this = $(this);
			var href = $this.attr('href');

			// not hash
			if( href.search('#') === 0 || location.hostname !== $this.prop('hostname') )
			{
				return;
			}

			event && event.preventDefault();


			$(window)
				.off('scroll.head')
			$(document)
				.off('.pageOut')

			// App.$head
			// 	.animate({
			// 		'padding-top': 25,
			// 		'padding-bottom': 25
			// 	}, 350);

			App.$loader
				.fadeIn(350, function()
				{
					if( $this.is('a') )
					{
						window.location = $this.attr('href');
					}
				})

			//return false
		},

		mapInit: function()
		{
			$('.section-map, .box-map')
				.each(function()
				{
					var _this = this;
					var data = $(this).data();

					var getLatLngFromAddress = function(address, attempt)
					{
						var params = { 'address': address },
							geocoder = new google.maps.Geocoder(),
							queryLimit = {
								attempt: 5,
								delay: 250,
								random: 250
							};

						if (!attempt){
							var attempt = 0;
						}

						geocoder.geocode(
							params,
							function(results, status)
							{
								if (status === google.maps.GeocoderStatus.OK)
								{
									var latLng = results[0].geometry.location;

									var googlemap = new google.maps.Map( _this, {
										backgroundColor: '#eeeeee',
										center: latLng,
										zoom: data.mapZoom,
										mapTypeId: google.maps.MapTypeId.ROADMAP,
										scrollwheel: false,
										draggable: navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? false : true,
										'styles': data.mapStyles
									});

									var marker = new google.maps.Marker({
										map: googlemap,
										position: latLng
									});

									$(_this)
										.one('recalcmap', function()
										{
											google.maps.event.trigger(googlemap, 'resize');
										});

									google.maps.event.addDomListener(window, 'resize', function() {
									    googlemap.setCenter(latLng);
									});
								}
								else if ((status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) && (attempt < queryLimit.attempt))
								{
									setTimeout(function()
										{
											getLatLngFromAddress(address, attempt+1);
										},
										queryLimit.delay + Math.floor(Math.random() * queryLimit.random)
									);
								}
								else
								{
									return;
								}
							}
						);
					};

					getLatLngFromAddress(data.mapAddress);

				});
		}
	};
})(jQuery)
