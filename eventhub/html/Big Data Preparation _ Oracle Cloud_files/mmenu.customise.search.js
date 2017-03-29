(function($) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_ = 'searchfieldtest';


	$[_PLUGIN_].addons[_ADDON_] = {

		//	_init: fired when (re)initiating the plugin
		_init: function($panels) {
			var that = this,
				opts = this.opts[_ADDON_],
				conf = this.conf[_ADDON_];


			//	Add the searchfield(s)
			if (opts.add) {
				switch (opts.addTo) {
					case 'menu':
						var $wrapper = this.$menu;
						break;

					case 'panels':
						var $wrapper = $panels;
						break;

					default:
						var $wrapper = $(opts.addTo, this.$menu).filter('.' + _c.panel);
						break;
				}

				if ($wrapper.length) {
					$wrapper.each(
						function() {
							//	Add the searchfield
							var $panl = $(this),
								_node = $panl.is('.' + _c.menu) ? (conf.form) ? 'form' : 'div' : 'li';

							if (!$panl.children(_node + '.' + _c.search).length) {
								if ($panl.is('.' + _c.menu)) {
									var $wrpr = that.$menu,
										insrt = 'prependTo';
								} else {
									var $wrpr = $panl.children().first(),
										insrt = ($wrpr.is('.' + _c.subtitle)) ? 'insertAfter' : 'insertBefore';
								}

								var $node = $('<' + _node + ' class="' + _c.search + '" />');

								if (_node == 'form' && typeof conf.form == 'object') {
									for (var f in conf.form) {
										$node.attr(f, conf.form[f]);
									}
								}

								$node.append('<form id="mMenuSearchForm" action="'+opts.formActionPage+'"><div class="mm-searchfield-input-block">'+
										'<input placeholder="' + opts.placeholder + '" type="text" user-scalable=0 name="queryStr" autocomplete="off" maxlength="128" />'+'</div>'+
										'<div class="mm-searchfield-icon-block"><div class="mm-searchfield-icon"></div></div><form>');
							  
								$node[insrt]($wrpr);
							}

							if (opts.noResults) {
								if ($panl.is('.' + _c.menu)) {
									$panl = $panl.children('.' + _c.panel).first();
								}
								_node = $panl.is('.' + _c.list) ? 'li' : 'div';

								if (!$panl.children(_node + '.' + _c.noresultsmsg).length) {
									$('<' + _node + ' class="' + _c.noresultsmsg + '" />')
										.html(opts.noResults)
										.appendTo($panl);
								}
							}
						}
					);
				}
			}

			if (this.$menu.children('.' + _c.search).length) {
				this.$menu.addClass(_c.hassearch);
			}

			//	Search through list items
			//console.log("search template");
			if (opts.search) {
				//console.log("need to go to the form to call search template");
				var $search = $('.' + _c.search, this.$menu);
				if ($search.length) {
					$search
						.each(
							function() {
								var $srch = $(this);

								if (opts.addTo == 'menu') {
									var $pnls = $('.' + _c.panel, that.$menu),
										$panl = that.$menu;
								} else {
									var $pnls = $srch.closest('.' + _c.panel),
										$panl = $pnls;
								}
								var $inpt = $srch.children('div').children('input'),
									$itms = that.__findAddBack($pnls, '.' + _c.list).children('li'),
									$lbls = $itms.filter('.' + _c.label),
									$rslt = $itms
									.not('.' + _c.subtitle)
									.not('.' + _c.label)
									.not('.' + _c.search)
									.not('.' + _c.noresultsmsg);

								var _searchText = '> a';
								if (!opts.showLinksOnly) {
									_searchText += ', > span';
								}

								$inpt
									.off(_e.keyup + ' ' + _e.change)
									.on(_e.keyup,
										function(e) {
											if (!preventKeypressSearch(e.keyCode)) {
												$srch.trigger(_e.search);
											}
										}
									)
									.on(_e.change,
										function(e) {
											$srch.trigger(_e.search);
										}
									);

								$srch
									.off(_e.reset + ' ' + _e.search)
									.on(_e.reset + ' ' + _e.search,
										function(e) {
											e.stopPropagation();
										}
									)
									.on(_e.reset,
										function(e) {
											$srch.trigger(_e.search, ['']);
										}
									)
									.on(_e.search,
										function(e, query) {
											if (typeof query == 'string') {
												$inpt.val(query);
											} else {
												query = $inpt.val();
											}
											query = query.toLowerCase();

											//	Scroll to top
											$pnls.scrollTop(0);

											//	Search through items
											$rslt
												.add($lbls)
												.addClass(_c.hidden);

											$rslt
												.each(
													function() {
														var $item = $(this);
														if ($(_searchText, $item).text().toLowerCase().indexOf(query) > -1) {
															$item.add($item.prevAll('.' + _c.label).first()).removeClass(_c.hidden);
														}
													}
												);

											//	Update parent for submenus
											$($pnls.get().reverse()).each(
												function(i) {
													var $panl = $(this),
														$prnt = $panl.data(_d.parent);

													if ($prnt) {
														var $i = $panl.add($panl.find('> .' + _c.list)).find('> li')
															.not('.' + _c.subtitle)
															.not('.' + _c.search)
															.not('.' + _c.noresultsmsg)
															.not('.' + _c.label)
															.not('.' + _c.hidden);

														if ($i.length) {
															$prnt
																.removeClass(_c.hidden)
																.removeClass(_c.nosubresults)
																.prevAll('.' + _c.label).first().removeClass(_c.hidden);
														} else if (opts.addTo == 'menu') {
															if ($panl.hasClass(_c.opened)) {
																//	Compensate the timeout for the opening animation
																setTimeout(
																	function() {
																		$prnt.trigger(_e.open);
																	}, (i + 1) * (that.conf.openingInterval * 1.5)
																);
															}
															$prnt.addClass(_c.nosubresults);
														}
													}
												}
											);

											//	Show/hide no results message
											$panl[$rslt.not('.' + _c.hidden).length ? 'removeClass' : 'addClass'](_c.noresults);

											// Update for other addons
											that._update();
										}
									);
							}
						);
				}
			} else if (opts.iconSearch) {
                //add the search icon click for the mmenu
                var $searchIc = $('.' + _c.search, this.$menu);
                if ($searchIc.length) {
                    $searchIc
                        .each(
                            function() {
                                var $srch = $(this);
                                //console.log($srch[0]);
                                if (opts.addTo == 'menu') {
                                    var $pnls = $('.' + _c.panel, that.$menu),
                                        $panl = that.$menu;
                                } else {
                                    var $pnls = $srch.closest('.' + _c.panel),
                                        $panl = $pnls;
                                }
                                var $inpt = $srch.children().children('div').children('input'),
                                    $itms = that.__findAddBack($pnls, '.' + _c.list).children('li'),
                                    $lbls = $itms.filter('.' + _c.label),
                                    $rslt = $itms
                                    .not('.' + _c.subtitle)
                                    .not('.' + _c.label)
                                    .not('.' + _c.search)
                                    .not('.' + _c.noresultsmsg);

                                var _searchText = '> a';
                                if (!opts.showLinksOnly) {
                                    _searchText += ', > span';
                                }
                                var $icon=$srch.children().children('div').children('.mm-searchfield-icon');
                                $icon
                                .off(_e.click)
                                .on(_e.click,
                                    function(e) {
                                        //$srch.trigger(_e.search);
                                        internalSearch();
                                    }
                                );
                                $inpt
									.off(_e.keyup)
									.on(_e.keyup,
										function(e) {
											if (enableKeyEnterSearch(e.keyCode)) {
												//$srch.trigger(_e.search);
												internalSearch();
											}
										}
									);
                                $srch
                                    .off(_e.reset + ' ' + _e.search)
                                    .on(_e.reset + ' ' + _e.search,
                                        function(e) {
                                            e.stopPropagation();
                                        }
                                    )
                                    .on(_e.reset,
                                        function(e) {
                                            $srch.trigger(_e.search, ['']);
                                        }
                                    )
                                    .on(_e.search,
                                        function(e, query) {
                                            if (typeof query == 'string') {
                                                $inpt.val(query);
                                            } else {
                                                query = $inpt.val();
                                            }
                                            query = query.toLowerCase();

                                            //	Scroll to top
                                            $pnls.scrollTop(0);

                                            //	Search through items
                                            $rslt
                                                .add($lbls)
                                                .addClass(_c.hidden);

                                            $rslt
                                                .each(
                                                    function() {
                                                        var $item = $(this);
                                                        if ($(_searchText, $item).text().toLowerCase().indexOf(query) > -1) {
                                                            $item.add($item.prevAll('.' + _c.label).first()).removeClass(_c.hidden);
                                                        }
                                                    }
                                                );

                                            //	Update parent for submenus
                                            $($pnls.get().reverse()).each(
                                                function(i) {
                                                    var $panl = $(this),
                                                        $prnt = $panl.data(_d.parent);

                                                    if ($prnt) {
                                                        var $i = $panl.add($panl.find('> .' + _c.list)).find('> li')
                                                            .not('.' + _c.subtitle)
                                                            .not('.' + _c.search)
                                                            .not('.' + _c.noresultsmsg)
                                                            .not('.' + _c.label)
                                                            .not('.' + _c.hidden);

                                                        if ($i.length) {
                                                            $prnt
                                                                .removeClass(_c.hidden)
                                                                .removeClass(_c.nosubresults)
                                                                .prevAll('.' + _c.label).first().removeClass(_c.hidden);
                                                        } else if (opts.addTo == 'menu') {
                                                            if ($panl.hasClass(_c.opened)) {
                                                                //	Compensate the timeout for the opening animation
                                                                setTimeout(
                                                                    function() {
                                                                        $prnt.trigger(_e.open);
                                                                    }, (i + 1) * (that.conf.openingInterval * 1.5)
                                                                );
                                                            }
                                                            $prnt.addClass(_c.nosubresults);
                                                        }
                                                    }
                                                }
                                            );

                                            //	Show/hide no results message
                                            $panl[$rslt.not('.' + _c.hidden).length ? 'removeClass' : 'addClass'](_c.noresults);

                                            // Update for other addons
                                            that._update();
                                        }
                                    );
                                //
                            }
                        );
                }
            }

		},

		//	_setup: fired once per menu
		_setup: function() {
			var that = this,
				opts = this.opts[_ADDON_],
				conf = this.conf[_ADDON_];


			//	Extend shortcut options
			if (typeof opts == 'boolean') {
				opts = {
					add: opts,
					search: opts
				};
			}
			if (typeof opts != 'object') {
				opts = {};
			}
			opts = $.extend(true, {}, $[_PLUGIN_].defaults[_ADDON_], opts);

			if (typeof opts.showLinksOnly != 'boolean') {
				opts.showLinksOnly = (opts.addTo == 'menu');
			}


			this.opts[_ADDON_] = opts;
		},

		//	_add: fired once per page load
		_add: function() {
			_c = $[_PLUGIN_]._c;
			_d = $[_PLUGIN_]._d;
			_e = $[_PLUGIN_]._e;

			_c.add('search hassearch noresultsmsg noresults nosubresults');
			_e.add('search reset change click');

			glbl = $[_PLUGIN_].glbl;
		}
	};


	//	Default options and configuration
	$[_PLUGIN_].defaults[_ADDON_] = {
		add: false,
		addTo: 'menu',
		search: false,
        iconSearch:true,
        formActionPage:'actionPage',
		//showLinksOnly	: true,
		placeholder: 'Search Oracle Cloud',
		noResults: 'No results found.'
	};
	$[_PLUGIN_].configuration[_ADDON_] = {
		form: false
	};



	var _c, _d, _e, glbl;


	function preventKeypressSearch(c) {
		switch (c) {
			case 9: //	tab
			case 16: //	shift
			case 17: //	control
			case 18: //	alt
			case 37: //	left
			case 38: //	top
			case 39: //	right
			case 40: //	bottom
				return true;
		}
		return false;
	}
    
	function enableKeyEnterSearch(c) {
		switch (c) {
			case 13: //	enter
                return true;
		}
		return false;
	}
	function internalSearch(){
		$('#mMenuSearchForm').submit();
	}

})(jQuery);
