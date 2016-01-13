(function(sk, $){

    /*
        Vytvořil:
        12.06.2012 | Michal Matuška

        Změny:
        -

        Opravené bugy:
        -

        Vyžaduje:
        - jquery

        Popis
        -

    */

    sk.utils.MediaQueries = function(options)
    {
        this.options = $.extend({
            'selector': '#mq',
            'property': 'left',
            'timer': 150,
            'queries': {}
        }, options);

        return this;
    }

    // PROTOTYPE
    var _fn = sk.utils.MediaQueries.prototype;

    _fn.init = function()
    {
        var o = this.options;

        this.$w = $(window);
        this.selector =  o.selector.jquery ? o.selector : $(o.selector);
        this.property = o.property;
        this.queries =o.queries;
        this.state = null;
        this.params = null;
        this.timer = null;

        this.$w
            .on('resize.MediaQueries', $.proxy(this.check, this))
            .trigger('resize');



        return this;
    };

    _fn.destroy = function()
    {
        this.$w
            .off('.MediaQueries');

        return this;
    };

     _fn.check = function()
    {
        if (!this.timer)
        {


            var that = this;
            var fn = function()
            {

                var prop = that.selector.css(that.property);
                var un;
                var query = that.queries[prop];

                if(query !== un)
                {
                    if(that.state === query.state)
                    {
                        var e = $.Event('resizeMedia', { state: this.state, params: query.params });
                        $(that).trigger(e);
                    }
                    else
                    {
                        var e = $.Event('changeMedia', { state: query.state, fromState: that.state, params: query.params});
                        that.state = query.state;
                        that.params = query.params;
                        $(that).trigger(e);
                    }

                }

                that.timer = null;
            }

            if(this.state === null)
            {
                fn()
            }
            else
            {
                this.timer = setTimeout(function(){ fn() }, this.options.timer);
            }

        }
    };


})(sk, jQuery);



