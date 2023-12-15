/*!
 * bootstrap-typeahead.js v0.0.5 (http://www.upbootstrap.com)
 * Copyright 2012-2015 Twitter Inc.
 * Licensed under MIT (https://github.com/biggora/bootstrap-ajax-typeahead/blob/master/LICENSE)
 * See Demo: http://plugins.upbootstrap.com/bootstrap-ajax-typeahead
 * Updated: 2015-04-05 11:43:56
 *
 * Modifications by Paul Warelis and Alexey Gordeyev
 */
!function ($) {
    
    "use strict"; // jshint ;_;

    /* TYPEAHEAD PUBLIC CLASS DEFINITION
     * ================================= */

    var Typeahead = function (element, options) {

        //deal with scrollBar
        var defaultOptions = $.fn.typeahead.defaults;
        if (options.scrollBar) {
            options.items = 100;
            options.menu = '<ul class="typeahead dropdown-menu" style="max-height:200px;overflow:auto;"></ul>';
        }

        var that = this;
        that.$element = $(element);
        that.options = $.extend({}, $.fn.typeahead.defaults, options);
        that.$menu = $(that.options.menu).insertAfter(that.$element);

        // Method overrides
        that.eventSupported = that.options.eventSupported || that.eventSupported;
        that.grepper = that.options.grepper || that.grepper;
        that.highlighter = that.options.highlighter || that.highlighter;
        that.lookup = that.options.lookup || that.lookup;
        that.matcher = that.options.matcher || that.matcher;
        that.render = that.options.render || that.render;
        that.onSelect = that.options.onSelect || null;
        that.sorter = that.options.sorter || that.sorter;
        that.source = that.options.source || that.source;
        that.displayField = that.options.displayField || that.displayField;
        that.valueField = that.options.valueField || that.valueField;
        that.Product = that.options.Product;

        if (that.options.ajax) {
            var ajax = that.options.ajax;

            if (typeof ajax === 'string') {
                that.ajax = $.extend({}, $.fn.typeahead.defaults.ajax, {
                    url: ajax
                });
            } else {
                if (typeof ajax.displayField === 'string') {
                    that.displayField = that.options.displayField = ajax.displayField;
                }
                if (typeof ajax.valueField === 'string') {
                    that.valueField = that.options.valueField = ajax.valueField;
                }

                that.ajax = $.extend({}, $.fn.typeahead.defaults.ajax, ajax);
            }

            if (!that.ajax.url) {
                that.ajax = null;
            }
            that.query = "";
        } else {
            that.source = that.options.source;
            that.ajax = null;
        }
        that.shown = false;
        that.listen();
    };

    Typeahead.prototype = {
        constructor: Typeahead,
        //=============================================================================================================
        //  Utils
        //  Check if an event is supported by the browser eg. 'keypress'
        //  * This was included to handle the "exhaustive deprecation" of jQuery.browser in jQuery 1.8
        //=============================================================================================================
        eventSupported: function (eventName) {
            var isSupported = (eventName in this.$element);

            if (!isSupported) {
                this.$element.setAttribute(eventName, 'return;');
                isSupported = typeof this.$element[eventName] === 'function';
            }

            return isSupported;
        },
        select: function () {

            var $selectedItem = this.$menu.find('.active');
            var value = $selectedItem.attr('data-value');
            var text = this.$menu.find('.active a').text();
            var city_code = $selectedItem.attr('data-citycode'); //Added by vijai to select city code
            var ContactNo = $selectedItem.attr('data-contactno');
            var MailId = $selectedItem.attr('data-MailID');
            var COMPID = $selectedItem.attr('data-COMPID');
            var Costcenter = $selectedItem.attr('data-Costcenter');
            var USDCODE = $selectedItem.attr('data-USDCODE');
            var clientDetails = $selectedItem.attr('data-clientDetails');
            if (this.options.onSelect) {
                this.options.onSelect({
                    value: value,
                    text: text,
                    citycode: city_code,
                    Contact: ContactNo,  //Added by vijai to select city code
                    MailID: MailId,
                    COMPID: COMPID,
                    Costcenter: Costcenter,
                    USDCODE: USDCODE,
                    clientDetails: clientDetails
                });
            }
            var checkflage = false;
            if (value.indexOf('-') > 0) {
                if (Number(value.split('-')[1])) {
                    checkflage = true;
                } else {
                    checkflage = false;
                }


                this.$element
                .val(this.updater(checkflage == true ? value.split('-')[0] : value)) //commented and updated by saranraj on 20170123...   .val(this.updater(value.split('~')[0])) //
                    .change();
                return this.hide();
            }
            else if (MailId != "" && MailId != null && MailId != undefined && MailId != "undefined") {
                this.$element
                   .val(this.updater(MailId)) //commented and updated by saranraj on 20170123...   .val(this.updater(value.split('~')[0])) //
                       .change();
                return this.hide();
            }
            else if (COMPID != "" && COMPID != null && COMPID != undefined && COMPID != "undefined") {
                this.$element
                 .val(this.updater(COMPID.split("|")[0])) //commented and updated by sarath on 20182606...   
                     .change();
                return this.hide();
            }
            else {
                this.$element
                    .val(this.updater(text)) //commented and updated by saranraj on 20170123...   .val(this.updater(value.split('~')[0])) //
                        .change();
                return this.hide();
            }
        },
        updater: function (item) {
            return item;
        },
        show: function () {
            var pos = $.extend({}, this.$element.position(), {
                height: this.$element[0].offsetHeight
            });

            this.$menu.css({
                top: pos.top + pos.height,
                left: pos.left
            });

            if (this.options.alignWidth) {
                var width = $(this.$element[0]).outerWidth();
                this.$menu.css({
                    width: width
                });
            }

            this.$menu.show();
            this.shown = true;
            return this;
        },
        hide: function () {
            this.$menu.hide();
            this.shown = false;
            return this;
        },
        ajaxLookup: function () {

            var query = $.trim(this.$element.val());

            if (query === this.query) {
                return this;
            }

            // Query changed
            this.query = query;

            // Cancel last timer if set
            if (this.ajax.timerId) {
                clearTimeout(this.ajax.timerId);
                this.ajax.timerId = null;
            }

            if (!query || query.length < this.ajax.triggerLength) {
                
                // cancel the ajax callback if in progress
                if (this.ajax.xhr) {
                    this.ajax.xhr.abort();
                    this.ajax.xhr = null;
                    this.ajaxToggleLoadClass(false);
                }

                return this.shown ? this.hide() : this;
            }

            function execute() {
                this.ajaxToggleLoadClass(true);

                // Cancel last call if already in progress
                if (this.ajax.xhr)
                    this.ajax.xhr.abort();

                var params = this.ajax.preDispatch ? this.ajax.preDispatch(query) : query;
                var par_split = params.search.split("~");
                var strID = this.ajax.source;
                
                this.ajax.xhr = $.ajax({
                    url: this.ajax.url,
                    contentType: "application/json; charset=utf-8",
                    data: "{'query':'" + par_split[0] + "','Compamyid':'" + par_split[1] + "'}",
                    success: $.proxy(this.ajaxSource, this),
                    error: function (e) {
                        
                       // alert("No Records found.");
                    },
                    type: this.ajax.method || 'post',
                    dataType: 'json'
                });
                this.ajax.timerId = null;
            }

            // Query is good to send, set a timer
            this.ajax.timerId = setTimeout($.proxy(execute, this), this.ajax.timeout);

            return this;
        },
        ajaxSource: function (data) {
            
            this.ajaxToggleLoadClass(false);
            var that = this, items;
            if (!that.ajax.xhr)
                return;
            if (that.ajax.preProcess) {
                data = that.ajax.preProcess(data);
            }
            // Save for selection retreival
            that.ajax.data = data;

            // Manipulate objects
            items = that.grepper(that.ajax.data) || [];
            if (!items.length) {
              
                if (items.length < 1 && data[0].REMOVE != "Remove") {
                    var norecorde = { CODE: "No Results Found..", MAILID: "", NAME: "" }
                    items.push(norecorde);
                }
                else {
                    return that.shown ? that.hide() : that;
                }
            }

            that.ajax.xhr = null;
            
            return that.render(items.slice(0, that.options.items)).show();
        },
        ajaxToggleLoadClass: function (enable) {
            if (!this.ajax.loadingClass)
                return;
            this.$element.toggleClass(this.ajax.loadingClass, enable);
        },
        lookup: function (event, eve) {
            var that = this, items;
            if (that.ajax) {
                that.ajaxer();
            }
            else {
                that.query = that.$element.val();

                if (event == "Keypress") {
                    if (!that.query) {
                        return that.shown ? that.hide() : that;
                    }
                }
                else {
                    if (that.query != "") {
                        return that.shown ? that.hide() : that;
                    }
                }
                
                items = that.grepper(that.source);


                if (!items) {
                    return that.shown ? that.hide() : that;
                }
                //Bhanu added a custom message- Result not Found when no result is found
                if (items.length == 0) {
                    items[0] = { 'id': -21, 'name': "Result not Found" }
                }
                return that.render(items.slice(0, that.options.items)).show();
            }
        },
        matcher: function (item) {
            if (item.toLowerCase == undefined) {
                return item != null ? ~item.USD_MAILID().indexOf(this.query.toLowerCase()) : "";
            } else {
                return item != null ? ~item.toLowerCase().indexOf(this.query.toLowerCase()) : ""; //Condition check 
            }
        },
        sorter: function (items) {
            if (!this.options.ajax) {
                var beginswith = [],
                    caseSensitive = [],
                    caseInsensitive = [],
                    item;

                while (item = items.shift()) {
                    if (!item.toLowerCase().indexOf(this.query.toLowerCase()))
                        beginswith.push(item);
                    else if (~item.indexOf(this.query))
                        caseSensitive.push(item);
                    else
                        caseInsensitive.push(item);
                }

                return beginswith.concat(caseSensitive, caseInsensitive);
            } else {
                return items;
            }
        },
        
        highlighter: function (item, check) {

            try {
                if (typeof item === "object") {
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    return item.CLTNAME.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                        return '<strong>' + match + '</strong>';
                    });
                }
                else if (item != null) {
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                        return '<strong>' + match + '</strong>';
                    });

                    //return item.replace(new RegExp('(' + query + ')'), function ($1, match) {
                    //    return '<strong>' + match + '</strong>';
                    //});

                } else {


                    return check != "USD_MAILID" ? '<strong>' + "No Results Found.." + '</strong>' : "";
                }
            } catch (e) {
                console.log(e.toString())
                return '<strong>' + "No Results Found.." + '</strong>';
            }
           
           
        },
        
        render: function (items) {

            var that = this, display, isString = typeof that.options.displayField === 'string';
          
            
            items = $(items).map(function (i, item) {
                display = item;
                
                try {
                    if (typeof item === 'object') {
                        i = $(that.options.item).attr('data-value', item.CLTNAME).attr('data-clientDetails', JSON.stringify(item)) //.attr('data-citycode', item.split('~')[0])
                    }

                    else if (item.indexOf("SK_MAIL_NAME") != -1) {
                        //  display = isString ? item[that.options.displayField] : that.options.displayField(item);
                        //  i = $(that.options.item).attr('data-value', item[that.options.valueField]).attr('data-citycode', item[that.options.valueField]).attr('data-contactno', item["CONTACTNO"]); // Added by vijai
                        i = $(that.options.item).attr('data-value', item.split('~')[1]).attr('data-uniqflag', item.split('~')[2]).attr('data-COMPID', item.split('~')[3]);
                    } else {


                        var typecheckflag = false;

                        if (Number(item.split("-")[1])) {
                            typecheckflag = true;
                        } else {
                            typecheckflag = false;
                        }

                        display = item != null && item.indexOf("-") != -1 ? typecheckflag == true ? item.split("-")[0] : item : item;//added by udhaya for the perpose of packages hide the codes 
                        if (item.indexOf("CO-ORDINATOR") != -1) {
                            i = $(that.options.item).attr('data-value', item.split('~')[0]).attr('data-MailID', item.split('~')[2].split("(")[0]).attr('data-contactno', item.split('~')[3]).attr('data-USDCODE', item.split("~")[5]);
                        }
                        else if (item.indexOf("Retrive_emp") != -1) {
                      // display = item.split('~')[0] + item.split('~')[1]+"~"+ item.split('~')[3]+"~" + item.split('~')[4]+"~" + item.split('~')[5]+"~" + item.split('~')[6];
                            i = $(that.options.item).attr('data-value', item.split('~')[1]).attr('data-MailID', item.split('~')[1]).attr('data-USDCODE', item.split('~')[2]).attr('data-Costcenter', item.split('~')[3]).attr('data-COMPID', item.split('~')[4]).attr('data-contactno', item.split('~')[5]);
                        }
                        else if (item.indexOf("(") != -1 || item.indexOf(")") != -1) {
                            i = $(that.options.item).attr('data-value', item.split('~')[0]).attr('data-citycode', item.split('~')[0].split("(")[1].split(")")[0]); // Added by vijai
                        }

                        else {
                            i = $(that.options.item).attr('data-value', item.split('~')[0]).attr('data-citycode', item.split('~')[0])
                        }

                    }
                } catch (e) {
                    display = item;
                    i = item
                    console.log(e.toString())
                }
               

                //Added by saranraj on 20170123...
             
                var replacebold = that.highlighter(display, that.displayField);
                    replacebold = replacebold.split('~');
                    var sb = '';
                    if (replacebold[0] == "") {
                        if (items[0].name == "Result not Found" && that.options.displayField == "USD_MAILID") { // For Retrieve PNR
                            try {
                                return that.shown ? that.hide() : that;
                            } catch (e) {

                            }
                           
                        } else {
                            replacebold[0] = "No Results Found..";
                        }
                       
                    }
                    sb += '<div class="clstyphead"><span class="clsthmail">' + replacebold[0] + '</span>';
                    if (replacebold[2] == "SK_MAIL_NAME") {
                        sb += '<span class="clsthright">' + replacebold[1] + '</span>';
                    }
                  else if (replacebold[1] == "TC" || replacebold[1] == "BC") {
                        sb += '<span class="clsthright">' + replacebold[1] + '</span>' + '<span class="' + replacebold[1].toUpperCase() + '"></span>';
                  }
                  else if (replacebold[6] == "Retrive_emp") {
                      sb += '<span class="clsthright">' + replacebold[7] + '</span>' + '<span class="' + replacebold[7].toUpperCase() + '"></span>';
                  }
                  else if (replacebold.length > 1) {                                               //This span for country images, for this need to add country_flag image and css file... by saranraj on 20170921 (#TBMT)
                      sb += '<span class="clsthright">' + replacebold[1] + '</span>' + '<span class="clsthrightflg country-flg ' + replacebold[1].toLowerCase() + '"></span>';
                  }

                    if (replacebold[6] == "Retrive_emp") {
                        sb += '<p>' + replacebold[1] + '</p>';
                    }
                    if (replacebold[2] == "SK_MAIL_NAME") {
                        sb += '<p>' + replacebold[1] + '</p>';
                    }
                if (replacebold.length > 2 && replacebold.indexOf("SK_MAIL_NAME") == -1 && replacebold.indexOf("Retrive_emp") == -1)
                        sb += '<p>' + replacebold[2].split("(")[0] + '</p>';
                    sb += '</div>';
                //End...


                   //i.find('a').html(that.highlighter(display)); //Commented by Saranraj on 20170123...
                    i.find('a').html(sb); //Added by Saranraj on 20170123...
                    i.find('a').attr("data-title", display);
                    return i[0];
            });

            items.first().addClass('active');

            this.$menu.html(items);
            return this;
        },
        //------------------------------------------------------------------
        //  Filters relevent results
        //
        grepper: function (data) {

            var that = this, items, display, isString = typeof that.options.displayField === 'string';

            if (isString && data && data.length) {
                if (data[0].hasOwnProperty(that.options.displayField)) {
                    items = $.grep(data, function (item) {
                        display = isString ? item[that.options.displayField] : that.options.displayField(item);
                        //Note: if Uncomment below line and Comment next 2 lines means we can compare typed text with whole line...
                        return that.matcher(display);   //Commented by saranraj on 20161026 for compare Starting string alone...

                        //Added by saranraj on 20161026 for compare Starting string alone...
                       // var strsubstring = item.NAME.substring(0, that.query.length);
                       // return strsubstring.toLowerCase() == that.query.toLowerCase();
                        //End

                    });
                } else if (typeof data[0] === 'string') {
                    if (that.query.length == 3) { //If search with 3 letter means First search be City code and then search be city name... by saranraj on 20170921 (#TBMT)
                        
                        var items_1 = $.grep(data, function (item) { //Step1: Search by City Code...
                            if ((item.indexOf('(') != -1) && (item.indexOf(')') != -1)) {
                                return item.split("(")[1].split(')')[0].toLowerCase() === that.query.toLowerCase().trim();
                            }
                            else {
                                return that.matcher(item);
                            }
                        });
                        var items_2 = $.grep(data, function (item) { //Step2: Search by City Name... 
                            if ((item.indexOf('(') != -1) && (item.indexOf(')') != -1)) {
                                return (item.split("(")[1].split(')')[0].toLowerCase() !== that.query.toLowerCase().trim()) && (item.substring(0, that.query.trim().length).toLowerCase() === (that.query.toLowerCase().trim()));
                            }
                            else {
                                return that.matcher(item);
                            }
                        });
                        items = items_1.concat(items_2); //Step3: Contat both values (get from step1 and step2)...   by saranraj on 20170921 (#TBMT)
                    }
                    else {
                        items = $.grep(data, function (item) {
                            //Note: if Uncomment below line and Comment next 2 lines means we can compare typed text with whole line...
                            ////if (that.query.length != 3) {
                                return that.matcher(item);    //Commented by saranraj on 20161026 for compare Starting string alone...
                            ////}
                            ////else {
                            ////    if ((item.indexOf('(') != -1) && (item.indexOf(')') != -1))
                            ////        return that.matcher(item.split("(")[1].split(')')[0]);
                            ////    else
                            ////        return that.matcher(item);
                            ////}

                            //Added by saranraj on 20161026 for compare Starting string alone...
                            //var strsubstring = item.substring(0, that.query.length);
                            //return strsubstring.toLowerCase() == that.query.toLowerCase();
                            //End

                        });
                    }
                }
                else if (typeof data[0] === 'object') {
                    items = $.grep(data, function (item) {
                        return that.matcher(item.CLTNAME);
                    });
                }
                else {
                    return null;
                }
            } else {
                return null;
            }
            return this.sorter(items);
        },
        next: function (event) {
            var active = this.$menu.find('.active').removeClass('active'),
                next = active.next();

            if (!next.length) {
                next = $(this.$menu.find('li')[0]);
            }

            if (this.options.scrollBar) {
                var index = this.$menu.children("li").index(next);
                if (index % 8 == 0) {
                    this.$menu.scrollTop(index * 26);
                }
            }

            next.addClass('active');
        },
        prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active'),
                prev = active.prev();

            if (!prev.length) {
                prev = this.$menu.find('li').last();
            }

            if (this.options.scrollBar) {

                var $li = this.$menu.children("li");
                var total = $li.length - 1;
                var index = $li.index(prev);

                if ((total - index) % 8 == 0) {
                    this.$menu.scrollTop((index - 7) * 26);
                }

            }

            prev.addClass('active');

        },
        listen: function () {
            this.$element
                .on('focus', $.proxy(this.focus, this))
                .on('blur', $.proxy(this.blur, this))
                .on('keypress', $.proxy(this.keypress, this))
                .on('keyup', $.proxy(this.keyup, this));

            if (this.eventSupported('keydown')) {
                this.$element.on('keydown', $.proxy(this.keydown, this))
            }

            this.$menu
                .on('click', $.proxy(this.click, this))
                .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
                .on('mousedown', $.proxy(this.mousedown))
                .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
        },
        move: function (e) {
            if (!this.shown)
                return

            switch (e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault();
                    break

                case 38: // up arrow
                    e.preventDefault()
                    this.prev()
                    break

                case 40: // down arrow
                    e.preventDefault()
                    this.next()
                    break
            }

            e.stopPropagation();
        },
        keydown: function (e) {
            this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27])
            this.move(e)
        },
        keypress: function (e) {
            if (this.suppressKeyPressRepeat)
                return
            this.move(e)
        },
        keyup: function (e) {
            switch (e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break

                case 9: // tab
                case 13: // enter
                    if (!this.shown)
                        return
                    this.select()
                    break

                case 27: // escape
                    if (!this.shown)
                        return
                    this.hide()
                    break

                default:
                    if (this.ajax)
                        this.ajaxLookup()
                    else
                        this.lookup("Keypress")
            }

            e.stopPropagation()
            e.preventDefault()
        },
        focus: function (e) {
            this.focused = true
            if (e.currentTarget.className.indexOf("txtemployefetchonbackcls") == -1)
            this.lookup("", "empty")

        },
        blur: function (e) {
            this.focused = false
            if (!this.mousedover && this.shown)
                this.hide()
        },
        click: function (e) {
            e.stopPropagation()
            e.preventDefault()
            this.select()
            this.$element.focus()
        },
        mouseenter: function (e) {
            this.mousedover = true
            this.$menu.find('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
        },
        mouseleave: function (e) {
            if (!this.checkieborwser()) {
                this.mousedover = false
                if (!this.focused && this.shown)
                    this.hide()
            }
        },
        mousedown: function (e) {
            e.preventDefault()
        },
        checkieborwser: function (e) {
            var ms_ie = false;
            var ua = window.navigator.userAgent;
            var old_ie = ua.indexOf('MSIE '); //Upto IE 10
            var new_ie = ua.indexOf('Trident/');//IE 11
            var latest_id = ua.indexOf('Edge/'); // >IE 11
            if ((old_ie > -1) || (new_ie > -1) || (latest_id > -1)) {
                ms_ie = true;
            }
            return ms_ie;
        },
        destroy: function () {
            this.$element
                .off('focus', $.proxy(this.focus, this))
                .off('blur', $.proxy(this.blur, this))
                .off('keypress', $.proxy(this.keypress, this))
                .off('keyup', $.proxy(this.keyup, this));

            if (this.eventSupported('keydown')) {
                this.$element.off('keydown', $.proxy(this.keydown, this))
            }

            this.$menu
                .off('click', $.proxy(this.click, this))
                .off('mouseenter', 'li', $.proxy(this.mouseenter, this))
                .off('mouseleave', 'li', $.proxy(this.mouseleave, this))
            this.$element.removeData('typeahead');
        }
    };


    /* TYPEAHEAD PLUGIN DEFINITION
     * =========================== */

    $.fn.typeahead = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('typeahead'),
                options = typeof option === 'object' && option;
            if (!data)
                $this.data('typeahead', (data = new Typeahead(this, options)));
            if (typeof option === 'string')
                data[option]();
        });
    };

    $.fn.typeahead.defaults = {
        source: [],
        items: 8,
        scrollBar: true,
        alignWidth: true,
        menu: '<ul class="typeahead dropdown-menu"></ul>',
        item: '<li><a href="#"></a></li>',
        valueField: 'CODE',
        displayField: 'NAME',
        Product: "",
        onSelect: function () {
        },
        ajax: {
            url: null,
            timeout: 300,
            method: 'get',
            triggerLength: 1,
            loadingClass: null,
            preDispatch: null,
            preProcess: null
        }
    };

    $.fn.typeahead.Constructor = Typeahead;

    /* TYPEAHEAD DATA-API
     * ================== */

    $(function () {
        $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
            var $this = $(this);
            if ($this.data('typeahead'))
                return;
            e.preventDefault();
            $this.typeahead($this.data());
        });
    });

}(window.jQuery);