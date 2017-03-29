/* 15.x cloud.oracle.com JS */

//IE9 console support
window.console = window.console || (function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {};
    return c;
})();
var ie = (function(){
	var undef, v = 3, div = document.createElement('div');

	while (
		div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
		div.getElementsByTagName('i')[0]
	);

	return v> 4 ? v : undef;
}());
var isMmenuShown=true;
function showMMenu(){
	if (isMmenuShown==true){
		$('#hamburger').show();
	}
	//if(isMmenuShown==true){
	if(false){
		$('#offersMenuDropDownLink').removeAttr("data-dropdown");
		$('#resourcesMenuDropDownLink').removeAttr("data-dropdown");
	}
} 
function setActiveMmenuItem(){
	var pathname = window.location.pathname; // Returns path only
	var linkBlock=$('#mmenu-cloud .mm-list li a');
	for (var index=0;index<$(linkBlock).length;index++){
		 var hrefLink=$(linkBlock[index]).attr('href')
		 //if (hrefLink.indexOf(pathname)>-1){
         if (hrefLink && pathname&& hrefLink==pathname){
			 $(linkBlock[index]).closest( "li" ).addClass('active');
		 }
	}	
}
var languageParameterName="siteid";
var questionMark='?';
//get specific attribute in the url
(function($){
	$.getUrlParam = function(name)
	{
	var reg= new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null){
			return unescape(r[2]);
		} else{ 
			return null;
		}
	}
})(jQuery);
//get all the parameters in the url.
function getAllUrlParameter(urlStr) {
    var sPageURL = decodeURIComponent(urlStr);
    //console.log('pageURL is:'+sPageURL);
    var inputAttr = {};
    if (sPageURL){
        var sURLVariables = sPageURL.split('&');
        var sParameterName;
        var i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            inputAttr[sParameterName[0]] = sParameterName[1];
        }
    }else{
    }
    //console.log('return input obj is:'+inputAttr);
    return inputAttr;
};
//set up the new URL
function translateToLan(targetLanguageIndex){
	var currentLan=$.getUrlParam(languageParameterName);
	//console.log('target lan:'+targetLanguageIndex+'; current lan is:'+currentLan);
	var pathname = window.location.pathname; // Returns path only
	var url= window.location.href;
	//console.log(pathname);
	//console.log(url);
	var urlStr=window.location.search.substring(1);
	var getAllUrlParameterOBJ=getAllUrlParameter(urlStr);
	var str = '';
	// the new url 
	getAllUrlParameterOBJ[languageParameterName] = targetLanguageIndex;
	var strPar = jQuery.param(getAllUrlParameterOBJ);
	str=pathname+questionMark+strPar;
	//console.log('new url is other one:'+str);
    if (str) { 
        window.location = str;
    }

}
//get the a href attribute and direct the URL link 
$(document).on('click', 'a', function(event) {
	if(false){
		var hrefStr=$(this).attr('href');
		//console.log('there is click event on a:'+hrefStr);
		if(hrefStr){
			if(hrefStr.indexOf("/") == 0){
				event.preventDefault();
				//validate it is relative URL, relative path
				var currentLan=$.getUrlParam(languageParameterName);
				var getAllUrlParameterLinkOBJ={};
					// the new url 
				getAllUrlParameterLinkOBJ[languageParameterName] = currentLan;
				var strPar = jQuery.param(getAllUrlParameterLinkOBJ);
				var str=hrefStr;
				if(hrefStr.indexOf(questionMark) >= 0){
					//there is already question mark
					str=str+'&'+strPar;
				}else{
					str=str+questionMark+strPar;
				}
				//console.log('new str link is:'+str);
				if (str) { 
					window.location = str;
				}
			}
		}			
	}
}) 
function set_initial_pager_content(){
	//for search results page.
	try{
		var CurrentPage=$("#search-result-pager-section-JS .pagination li.current").text();
		var recordsSelector=".search-single-record";
		var pageSelector=".search-single-record.search-page"+CurrentPage;
		$(recordsSelector).hide();
		$(pageSelector).show();
	}catch(err)
	{
		console.log(err);
	}	
}
function PageToPreivious(pagerAccountNumber, visiblePages,RecordsCountNumberInt){
	try
	{
		//enable left arrow
		$('.pager-left-arrow').removeClass("unavailable");
		//get current page number from text;
		var CurrentPage=$("#search-result-pager-section-JS .pagination li.current").text();
		var previousPage=(parseInt(CurrentPage)-1>=0)?parseInt(CurrentPage)-1:0;
		if (CurrentPage<=1){
			$('.pager-left-arrow').addClass("unavailable");
			return false;
		}
		else{			
			ToPage(previousPage, pagerAccountNumber,visiblePages,RecordsCountNumberInt);
		}
	}
	catch (err) {
		console.log(err);
	}
}
function PageToNext(pagerAccountNumber, visiblePages,RecordsCountNumberInt){
	try
	{	//enable right arrow
		$('.pager-right-arrow').removeClass("unavailable");
		//get current page number from text;
		var CurrentPage=$("#search-result-pager-section-JS .pagination li.current").text();
		var NextPage=(parseInt(CurrentPage)+1>=0)?parseInt(CurrentPage)+1:0;
		if(CurrentPage>=pagerAccountNumber){
			$('.pager-right-arrow').addClass("unavailable");
			return false;
		}else{		
			ToPage(NextPage, pagerAccountNumber,visiblePages,RecordsCountNumberInt);
		}
	}
	catch (err) {
		console.log(err);
	}
}
function ToPage(Pagenumber, pagerAccountNumber,visiblePages,RecordsCountNumberInt){
	try
	{
		//console.log("to page:"+Pagenumber+" "+pagerAccountNumber+" "+visiblePages);
		//only Show the page with the right index, hide the page if the index is not correct.
		var recordsSelector=".search-single-record";
		var pageSelector=".search-single-record.search-page"+Pagenumber;
		var currentPage=$("#search-result-pager-section-JS .pagination li.current").text();
		if (pagerAccountNumber>visiblePages){
			//more then 5 pages
			//hide all the item first
			$(".search-page-index-left-dot").hide();
			$(".search-page-index-right-dot").hide();
			for(var index=1;index<=parseInt(pagerAccountNumber);index++){
				$(".search-page-index-"+index).hide();
			}
			//show the items
			if (parseInt(Pagenumber)>=parseInt(pagerAccountNumber)-parseInt(visiblePages)+2){
				$(".search-page-index-1").show();
				$(".search-page-index-left-dot").show();
				for(var index=parseInt(pagerAccountNumber)-parseInt(visiblePages)+2;index<=parseInt(pagerAccountNumber);index++){
					$(".search-page-index-"+index).show();
				}
			} else if (parseInt(Pagenumber)>visiblePages) {
				$(".search-page-index-1").show();
				$(".search-page-index-left-dot").show();
				$(".search-page-index-"+(Pagenumber-1)).show();
				$(".search-page-index-"+Pagenumber).show();
				$(".search-page-index-"+(Pagenumber+1)).show();
				$(".search-page-index-"+(Pagenumber+2)).show();
				$(".search-page-index-right-dot").show();
			}else if (parseInt(Pagenumber)<=visiblePages){
				for(var index=1;index<=parseInt(visiblePages);index++){
					$(".search-page-index-"+index).show();
				}
				$(".search-page-index-"+(visiblePages+1)).show();
				if((parseInt(visiblePages)+1)==parseInt(pagerAccountNumber)){
					
				}else{
					$(".search-page-index-right-dot").show();
				}
			}
		}
		$(recordsSelector).hide();
		$(pageSelector).show();
		$("#search-result-pager-section-JS .pagination li").removeClass("current");
		$(".search-page-index-"+Pagenumber).addClass("current");
		//enable the arrow
		$('.pager-left-arrow').removeClass("unavailable");
		$('.pager-right-arrow').removeClass("unavailable");
		if (parseInt(Pagenumber)==1){
			$('.pager-left-arrow').addClass("unavailable");
		}
		if(parseInt(Pagenumber)==parseInt(pagerAccountNumber)){
			$('.pager-right-arrow').addClass("unavailable");
		}
		//show the right number start and end number
		var start_number=(parseInt(Pagenumber)-1)*10+1;
		$(".search-pager-start-num").text(start_number);
		var end_number=((parseInt(Pagenumber)-1)*10+10)>parseInt(RecordsCountNumberInt)?parseInt(RecordsCountNumberInt):((parseInt(Pagenumber)-1)*10+10);
		$(".search-pager-end-num").text(end_number);
		//last step reset footer
		 setFooter_bottom();
		//go back to the top
		 $('html, body').animate({ scrollTop: 0 }, 0);
	}
	catch (err) {
		console.log(err);
	}
}
function resetFooterAfterMmenuClose(){
	   $("#mmenu-cloud").mmenu().on( "closed.mm", Foundation.utils.debounce(function(e){
		   //add a delay of 300
		   leftShiftBackItemIE9();
		   $("#mmenu-cloud").css("display","none");
		   $('#hamburger').removeClass("active-mmenu-link");
		}, 300, true));
	   $("#mmenu-cloud").mmenu().on( "opened.mm", function() {
		   leftShiftFixedItemIE9();
		   $("#mmenu-cloud").css("display","block");
		   $('#hamburger').addClass("active-mmenu-link");
	  });
	}
function leftShiftFixedItemIE9(){
	if (ie==9) {
		var left=$("#mmenu-cloud").width();
		if ($(".category-overview-services").css("position")&&$(".category-overview-services").css("position")=="fixed"){
			$(".category-overview-services").css("left", left);
		}
		if ($("#resources-content-section .signin-block").css("position")&&$("#resources-content-section .signin-block").css("position")=="fixed"){
			$("#resources-content-section .signin-block").css("left", left);
		}
		if ($("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("position")&&$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("position")=="fixed"){
			$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("left", left);
		}
		if ($("#service-contents-section .bottom-striped-footer").css("position")&&$("#service-contents-section .bottom-striped-footer").css("position")=="fixed"){
			$("#service-contents-section .bottom-striped-footer").css("left", left);
		}
		if ($("footer").css("position")&&$("footer").css("position")=="fixed"){
			$("footer").css("left", left);
		}
	}
}
function leftShiftBackItemIE9(){
	if (ie==9) {
		var left=$("#mmenu-cloud").width();
		if ($(".category-overview-services").css("position")&&$(".category-overview-services").css("position")=="fixed"){
			$(".category-overview-services").css("left", "auto");
		}
		if ($("#resources-content-section .signin-block").css("position")&&$("#resources-content-section .signin-block").css("position")=="fixed"){
			$("#resources-content-section .signin-block").css("left", "auto");
		}
		if ($("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("position")&&$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("position")=="fixed"){
			$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("left", "auto");
		}
		if ($("#service-contents-section .bottom-striped-footer").css("position")&&$("#service-contents-section .bottom-striped-footer").css("position")=="fixed"){
			$("#service-contents-section .bottom-striped-footer").css("left", "auto");
		}
		if ($("footer").css("position")&&$("footer").css("position")=="fixed"){
			$("footer").css("left", "auto");
		}
	}
}

function isMobileWindow(){
    var screen_size=0;
    if (matchMedia(Foundation.media_queries['large']).matches) {
        screen_size=3;
    } else if (matchMedia(Foundation.media_queries['medium']).matches) {
        screen_size=2;
    } else if (matchMedia(Foundation.media_queries['small']).matches) {
        screen_size=1;
    };
	return (screen_size <= 1);
}
function showWhatNewBox(){
	$(".announcement").show();
}
function adjustHamburger(){
	var windowWidth=$(window).width() / parseFloat($("body").css("font-size"));
	//special breakpoint
    if(windowWidth<=62.5){
		$('.top-bar .name .oracle-cloud-logo-image').css("padding-left",52);
	}   
    else if (windowWidth<=68.9375){
		var offset_left=$('.row.mega-menu').offset().left;
		var max_offset=55;
		var offset_padding=(max_offset-offset_left)>0?parseInt(max_offset-offset_left):0;
		$('.top-bar .name .oracle-cloud-logo-image').css("padding-left",offset_padding);
	}
	else if(windowWidth>68.9375){
		$('.top-bar .name .oracle-cloud-logo-image').css("padding-left",0);
	}
	
}
function adjustWidthMegamenu(){
	var isMobile=isMobileWindow();
	if (isMobile == false) {
		var window_width=$(window).width();
		//testpdrop in the menu
		var offset_left_dropdown=$('#productDropdown').offset().left;
		if(window_width>1000) {
			$('#productDropdown').width(1000);
		} else{
			$('#productDropdown').width(window_width);
		}
		var dropdown_width=$("#productDropdown").width();
		if(window_width>dropdown_width){
			offset_left_dropdown=(window_width-dropdown_width)/2;
			$('#productDropdown').offset({'left':offset_left_dropdown});
		}else{
			$('#productDropdown').offset({'left':0});
		}
		//testrdrop
		
		var offset_left_dropdownR=$('#resourcesDropdown').offset().left;
		if(window_width>1000) {
			$('#resourcesDropdown').width(1000);
		} else{
			$('#resourcesDropdown').width(window_width);
		}
		var dropdown_widthR=$("#resourcesDropdown").width();
		if(window_width>dropdown_widthR){
			offset_left_dropdownR=(window_width-dropdown_widthR)/2;
			$('#resourcesDropdown').offset({'left':offset_left_dropdownR});
		}else{
			$('#resourcesDropdown').offset({'left':0});
		}
		//equalizer in the menu
        var menu_array=['category_ApplicationsMega','category_PlatformMega','category_MarketPlaceMega'];
        for(var j=0;j<menu_array.length;j++){
			items_single_group = Foundation.utils.S('[wcs-data-equalizer][wcs-equalizer-id="'+menu_array[j]+'"]');		
			var wcs_absolute_cal;
			wcs_columns_equalize(items_single_group,wcs_absolute_cal, menu_array[j]);	
        }
		//
	}
}
function showExtrenalSearchRangeblock(){
	try{
		if($('.search-no-restult-block').is(":visible")){
			$('.search-restul-range-block').hide();
		}else{
			$('.search-restul-range-block').show();
		}
	}catch(err){
		console.log(err);
	}
}
$(document).ready(function () {
	//Slick carousel
	set_slick();
    //Add onchenge event for select box
    bind_selectbox_onchange();
    //Equal height for price column header 
    equal_priceColumn_header();
    //Dotdotdot for video titles in the service page.
    set_dotdot_serviceVideoTitle();  
	//Add FAQ questions index
    set_faq_index();
    //Set initial search pager contents
	set_initial_pager_content();
    //Based on the service category, only show the services in that category
    show_selectCatOptionOnly();
    //Equal height for service overview feature title 
    equal_serviceoverview_featuretitle();
    //Center the chat and contact tabs
    centerSideBar();
    //Hide signin if we are already on signin page. 
    hideSigninIfNeeded();
    ////Hide Menu search Icon if we are already on search result page. 
    hideMenuSearchIconInSearchPage();
    //
    resetFooterAfterMmenuClose();
    //
    setActiveMmenuItem();
    //Add a switcher to enable/disable Mmenu 
    showMMenu();
    //shwo what is new box
    showWhatNewBox();
    //
    showExtrenalSearchRangeblock();
    //adjustHamburger();
    adjustWidthMegamenu();
     $('#homepage-category-group-tabs .tab-links a').on('click', function(e)  {
	  var currentAttrValue = jQuery(this).attr('href');
	  $('#homepage-category-group-tab-contents ' + currentAttrValue).show().siblings().hide();
	  $(this).parent('li').addClass('active').siblings().removeClass('active');
	  e.preventDefault();
	  tabResetFooter();
	});

});
$( window ).load(function() {
    //if the height of the contents is less than the windows height, set the footer to the bottom
    setFooter_bottom();
});
$( window ).resize(function() {
    equal_serviceoverview_featuretitle();
    //if the height of the contents is less than the windows height, set the footer to the bottom
    setFooter_bottom();
    //Center the chat and contact tabs
    centerSideBar();
    //adjustHamburger();
    adjustWidthMegamenu();
    //reset tabindex of top bar in the mobile view
    resetTabindexTopBarMobile();
});
function resetTabindexTopBarMobile(){
	var isMobile=isMobileWindow();
	if (isMobile == false) {
		//tablet up screen
		$('#searchbox-textfield-mobile').attr('tabindex','-1');
		$('.menu-mobile-accessibility-link').attr('tabindex','-1');
	}
}
function showHideSearchRow(){
	$('#searchbox-form').toggle();
	if ($('#searchbox-form').is(":visible")){
		 $('#searchbox-textfield').focus(); 
	} 	
}
function showHideSearchRowEnterPress(){
	if(event.keyCode == 13){
		$('#searchbox-form').toggle();
		if ($('#searchbox-form').is(":visible")){
			 $('#searchbox-textfield').focus(); 
		} 	
	}
}
function searchbarclose(){
	$('#searchbox-form').hide();
}
function searchboxSubmit(){
	$('#searchbox-form').submit();
}
function searchPagesearchboxSubmit(){
	$('#searchpage-searchbox-form').submit();
}
function searchboxSubmitMobile(){
	$('#searchbox-form-mobile').submit();
}
function searchboxSubmitOffcanvasMobile(){
	$('#searchbox-form-offcanvas-mobile').submit();
}
function setFooter_bottom(){
	var totalHeightTag = "html";
	if (ie) {
	    totalHeightTag = "body";
	}
	resetBlocksHeight();
	var isMobile=isMobileWindow();	
	if ($(totalHeightTag).height() < $(window).height() && isMobile == false) {
		//do a max height setting
		if ($('#offersMenu').height()> $(window).height()){
			$("#offersMenu").css("display", 'none');
		}
		if ($('#resourcesMenu').height()> $(window).height()){
			$("#resourcesMenu").css("display", 'none');
		}
		setPosition_FooterBlocks_Expand();
		//set minial height of main-secion of offcanvas
		setMinHeightOffcanvasMainSection();
	}
	else{
		setPosition_FooterBlocks_NonExpand();
	}
}
function setMinHeightOffcanvasMainSection(){
	var heightMenuItem=$('.menu-group-accessible-offermenu-container-row').height();
	var heightMenuMainSection=$('.main-section').height();
	if(heightMenuItem>heightMenuMainSection){
		$('.main-section').css("min-height",heightMenuItem);
	}
}
function resetBlocksHeight(){
	//reset to let the html get the right height
	$("#category-overview-service-section .category-overview-services").css("position", 'initial');
	$("#category-overview-service-section .category-overview-services").css("top", 'initial');
	$("#category-overview-service-section .category-overview-services").css("bottom", 'initial');
	$("#service-contents-section .bottom-striped-footer").css("position", 'initial');
	$("#service-contents-section .bottom-striped-footer").css("top", 'initial');
	$("#service-contents-section .bottom-striped-footer").css("bottom", 'initial');
	$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("position", 'initial');
	$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("top", 'initial');
	$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("bottom", 'initial');	
	$("#resources-content-section .signin-block").css("position", 'initial');
	$("#resources-content-section .signin-block").css("top", 'initial');
	$("#resources-content-section .signin-block").css("bottom", 'initial');	
	$("#search-result-pager-section .pagination-centered").css("position", 'initial');
	$("#search-result-pager-section .pagination-centered").css("bottom", 'initial');
	$('footer').css('position','initial');
	$('footer').css('width','initial');
	$('footer').css('bottom','initial');
	if(ie){
		$("#category-overview-service-section .category-overview-services").css("position", 'relative');
		$("#category-overview-service-section .category-overview-services").css("top", 'auto');
		$("#category-overview-service-section .category-overview-services").css("bottom", 'auto');
		$("#service-contents-section .bottom-striped-footer").css("position", 'relative');
		$("#service-contents-section .bottom-striped-footer").css("top", 'auto');
		$("#service-contents-section .bottom-striped-footer").css("bottom", 'auto');
		$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("position", 'relative');
		$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("top", 'auto');
		$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("bottom", 'auto');	
		$("#resources-content-section .signin-block").css("position", 'relative');
		$("#resources-content-section .signin-block").css("top", 'auto');
		$("#resources-content-section .signin-block").css("bottom", 'auto');	
		$("#search-result-pager-section .pagination-centered").css("position", 'auto');
		$("#search-result-pager-section .pagination-centered").css("bottom", 'auto');
		$('footer').css('position','relative');
		$('footer').css('width','auto');
		$('footer').css('bottom','auto');
	}
}
function tabResetFooter(){
	var isMobile=isMobileWindow();
	if (isMobile == false) {
	    setFooter_bottom();
	}
}
function setPosition_FooterBlocks_NonExpand(){
	$('footer').css('position','initial');
	$('footer').css('width','initial');
	$('footer').css('bottom','initial');
	if (ie) {
		$('footer').css('position','auto');
		$('footer').css('width','auto');
		$('footer').css('bottom','auto');
	}
	if ($('html').find('#category-banner-section').length >0) {
		var top=$('header').outerHeight(true) + 
		  $('#category-banner-section').outerHeight(true) +
		  $('#category-tabs').outerHeight(true) +
		  $('.container').outerHeight(true);
		$("#category-overview-service-section .category-overview-services").css("position", 'initial');
		$("#category-overview-service-section .category-overview-services").css("top", 'initial');
		$("#category-overview-service-section .category-overview-services").css("bottom", 'initial');
		if (ie) {
			$("#category-overview-service-section .category-overview-services").css("position", 'auto');
			$("#category-overview-service-section .category-overview-services").css("top", 'auto');
			$("#category-overview-service-section .category-overview-services").css("bottom", 'auto');
		}		
	}else if($('html').find('#service-banner-section').length >0){
		var top;
		if($('#service-contents-section').find('.service-contents').length <=0){
			//service overview page
			top=$('header').outerHeight(true) + 
			  $('#service-banner-section').outerHeight(true) +
			  $('#service-tabs-section').outerHeight(true) +
			  $('#service-overview-section').outerHeight(true)+
			  $('#service-overview-qualities-section').outerHeight(true)+
			  $('#service-overviewofferings-section').outerHeight(true)+
			  $('#service-overview-features-section').outerHeight(true);	
		}else{
			//service pricing page.
			top=$('header').outerHeight(true) + 
			  $('#service-banner-section').outerHeight(true) +
			  $('#service-tabs-section').outerHeight(true) +
			  $('.service-contents').outerHeight(true);	
		}
		$("#service-contents-section .bottom-striped-footer").css("position", 'initial');
		$("#service-contents-section .bottom-striped-footer").css("top", 'initial');
		$("#service-contents-section .bottom-striped-footer").css("bottom", 'initial');
		if (ie) {
			$("#service-contents-section .bottom-striped-footer").css("position", 'auto');
			$("#service-contents-section .bottom-striped-footer").css("top", 'auto');
			$("#service-contents-section .bottom-striped-footer").css("bottom", 'auto');
		}		
	}
	else if($('html').find('#homepage-category-group-tab-contents').length >0){
		var top=$('header').outerHeight(true) + 
		  $('#homepage-banners').outerHeight(true) +
		  $('#homepage-category-group-tabs').outerHeight(true) +
		  $('#homepage-category-group-tab-contents .tab.active .homepage-category-group-info').outerHeight(true);
		$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("position", 'initial');
		$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("top", 'initial');
		$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("bottom", 'initial');	
		if (ie) {
			$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("position", 'auto');
			$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("top", 'auto');
			$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("bottom", 'auto');	
		}
	}else if($('html').find('#resources-content-section .signin-panel-page').length >0){
		var top=$('header').outerHeight(true);
		$("#resources-content-section .signin-block").css("position", 'initial');
		$("#resources-content-section .signin-block").css("top", 'initial');
		$("#resources-content-section .signin-block").css("bottom", 'initial');	
		if (ie) {
			$("#resources-content-section .signin-block").css("position", 'auto');
			$("#resources-content-section .signin-block").css("top", 'auto');
			$("#resources-content-section .signin-block").css("bottom", 'auto');	
		}
	}
	else if($('html').find('#search-result-pager-section').length >0){
		$("#search-result-pager-section .pagination-centered").css("position", 'initial');
		$("#search-result-pager-section .pagination-centered").css("bottom", 'initial');
		if (ie) {
			$("#search-result-pager-section .pagination-centered").css("position", 'auto');
			$("#search-result-pager-section .pagination-centered").css("bottom", 'auto');
		}
	} 
}

function setPosition_FooterBlocks_Expand() {
	$('footer').css('position','fixed');
	$('footer').css('width','100%');
	$('footer').css('bottom','0');	
	if ($('html').find('#category-banner-section').length >0) {
		var top=$('header').outerHeight(true) + 
		  $('#category-banner-section').outerHeight(true) +
		  $('#category-tabs').outerHeight(true) +
		  $('.container').outerHeight(true);
		$("#category-overview-service-section .category-overview-services").css("position", 'fixed');
		$("#category-overview-service-section .category-overview-services").css("top", top);
		$("#category-overview-service-section .category-overview-services").css("bottom", $('footer').outerHeight(true));			
	}else if($('html').find('#service-banner-section').length >0){
		var top;
		if($('#service-contents-section').find('.service-contents').length <=0){	
			//service overview page
			top=$('header').outerHeight(true) + 
			  $('#service-banner-section').outerHeight(true) +
			  $('#service-tabs-section').outerHeight(true) +
			  $('#service-overview-section').outerHeight(true)+
			  $('#service-overview-qualities-section').outerHeight(true)+
			  $('#service-overviewofferings-section').outerHeight(true)+
			  $('#service-overview-features-section').outerHeight(true);	
		}else{
			//service pricing page.
			top=$('header').outerHeight(true) + 
			  $('#service-banner-section').outerHeight(true) +
			  $('#service-tabs-section').outerHeight(true) +
			  $('.service-contents').outerHeight(true);
		}
		$("#service-contents-section .bottom-striped-footer").css("position", 'fixed');
		$("#service-contents-section .bottom-striped-footer").css("top", top);
		$("#service-contents-section .bottom-striped-footer").css("bottom", $('footer').outerHeight(true));	
	}else if($('html').find('#homepage-category-group-tab-contents').length >0){
		var top=$('header').outerHeight(true) + 
		  $('#homepage-banners').outerHeight(true) +
		  $('#homepage-category-group-tabs').outerHeight(true) +
		  $('#homepage-category-group-tab-contents .tab.active .homepage-category-group-info').outerHeight(true);
		$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("position", 'fixed');
		$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("top", top);
		$("#homepage-category-group-tab-contents .tab.active .homepage-category-group").css("bottom", $('footer').outerHeight(true));	
	}else if($('html').find('#resources-content-section .signin-panel-page').length >0){
		var top=$('header').outerHeight(true);
		$("#resources-content-section .signin-block").css("position", 'fixed');
		$("#resources-content-section .signin-block").css("top", top);
		$("#resources-content-section .signin-block").css("bottom", $('footer').outerHeight(true));	
	} 
	else if($('html').find('#search-result-pager-section').length >0){
		$("#search-result-pager-section .pagination-centered").css("position", 'fixed');
		$("#search-result-pager-section .pagination-centered").css("bottom", $('footer').outerHeight(true));	
	} 
}

$(".readiness-releaseinfo-entry-linkgroups-entry .accordion").on("click", ".accordion-navigation", function (event) {
    var expand_icon = $(this).find('.readiness-releaseinfo-entry-linkgroups-entry-descicon');
    var isActiveTag = $(this).find('.accordion-navigation');

  	$(expand_icon).removeClass("JetFW-caret-e_16");
	$(expand_icon).addClass("JetFW-caret-s_16");
	if (navigator.userAgent.match(/msie/i) ){
		$(this).find('.readiness-releaseinfo-entry-linkgroups-entry-descicon').css("-ms-transform", "rotate(90deg)");
	}		
	else if(navigator.userAgent.toLowerCase().indexOf('safari') != -1) { 
	    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
	    } else {
	    	//Safari
	    	$(this).find('.readiness-releaseinfo-entry-linkgroups-entry-descicon').css("display", "inline-block");
	    	$(this).find('.readiness-releaseinfo-entry-linkgroups-entry-descicon').css("-webkit-transform", "rotate(90deg)");
	    }
	}

});
$(".readiness-releaseinfo-entry-linkgroups-entry .accordion").on("click", ".accordion-navigation.active", function (event) {
    var expand_icon = $(this).find('.readiness-releaseinfo-entry-linkgroups-entry-descicon');
    var isActiveTag = $(this).find('.accordion-navigation');
  	$(expand_icon).removeClass("JetFW-caret-s_16");
	$(expand_icon).addClass("JetFW-caret-e_16");
	if (navigator.userAgent.match(/msie/i) ){      
		$(this).find('.readiness-releaseinfo-entry-linkgroups-entry-descicon').css("-ms-transform", "rotate(0deg)");
	}
	else if(navigator.userAgent.toLowerCase().indexOf('safari') != -1) { 
	    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
	    } else {
	    	//safari
	    	$(this).find('.readiness-releaseinfo-entry-linkgroups-entry-descicon').css("display", "inline-block");
	    	$(this).find('.readiness-releaseinfo-entry-linkgroups-entry-descicon').css("-webkit-transform", "rotate(0deg)");	    	
	    }
	} 

});

function show_selectCatOptionOnly(){
	var options=$('#resources-selection-service option');
	var cat=$('#resources-selection-category [selected]').attr('cat');
	 for (var j = 0; j< options.length; j++) {
		 if (cat!=null && cat==$(options[j]).attr('cat')){
			 $(options[j]).show();
		 }else{
			 $(options[j]).remove();

		 }
	 } 
	 //readiness 
	options=$('#readiness-selection option');
	cat=$('#readiness-category-selection [selected]').attr('cat');
	 for (var j = 0; j< options.length; j++) {
		 if (cat!=null && cat==$(options[j]).attr('cat')){
			 $(options[j]).show();
		 }else{
			 $(options[j]).remove();

		 }
	 }
}

function set_faq_index(){
	//Add FAQ questions index
	$("#resources-faq-questions-indexblock").each(function() {
		var faqContents = $('.resources-faq');
		var faqPrevSubCat = "";
		for(var i=0; i< faqContents.length; i++) {
		    var anchor = faqContents[i].getElementsByClassName('resources-faq-anchor')[0];
			var anchorID = anchor.id;
			var titleDiv = faqContents[i].getElementsByClassName('resources-faq-title')[0];
			var faqCurrSubCatElem = faqContents[i].getElementsByTagName('input');
			if ((faqCurrSubCatElem != null) && (faqCurrSubCatElem[0] != null) && (faqCurrSubCatElem[0].value != faqPrevSubCat))
			{
			    faqPrevSubCat = faqCurrSubCatElem[0].value;
				$("#resources-faq-questions-indexblock").append('<div class="resources-faq-subcategory">' + faqPrevSubCat + '</div>');
			}
			$("#resources-faq-questions-indexblock").append('<div class="resources-faq-question"><a href="#' + anchorID + '">' + titleDiv.textContent + '</a></div>');
		}
	});
}

function set_dotdot_serviceVideoTitle(){
	// Add dotdotdot for long texts	
	var items = Foundation.utils.S('#service-overview-demo-section .videodesc');    
	if (items.length != 0) {	 
		for (var i = 0; i < items.size(); i++) {
			$($("#service-overview-demo-section .videodesc")[i]).dotdotdot();
		}
	}
}
function equal_priceColumn_header(){
	equalHeight($('.service-pricing-cardheader'));
	equalHeight($('.service-pricing-priceentry-priceinfo'));
	equalHeight($('.service-pricing-pricebuttonholder'));	
}
function equal_serviceoverview_featuretitle(){
	//remove the css height
	$('.service-overview-features-featureoffer-title').css('height', 'initial');
	equalHeight($('.service-overview-features-featureoffer-title'));	
}
function equalHeight(group) {
	var tallest = 0;
	group.each(function () {
		var thisHeight = $(this).height();
		if (thisHeight > tallest ) {
			tallest = thisHeight;
		}
	});
	group.height(tallest);
}
function redirectLocation(linkURL,isActive){
	if(isActive && (isActive.indexOf("active")>=0||isActive.indexOf("current")>=0)){
		//active tab do not redirect.
	}else{
		//active tab direct the tab.
		window.location=linkURL;
	}
}
function bind_selectbox_onchange(){	
    // bind change event to select	
	$('#readiness-selection').bind('change', function () {
	    var url = $(this).val(); 
	    if (url) { 
	        window.location = url;
	    }
	    return false;
	});
	$('#readiness-category-selection').bind('change', function () {
	    var url = $(this).val(); 
	    if (url) { 
	        window.location = url; 
	    }
	    return false;
	});
    $('#resources-selection-category').bind('change', function () {
        var url = $(this).val(); 
        if (url) { 
            window.location = url; 
        }
        return false;
    });
    $('#resources-selection-service').bind('change', function () {
        var url = $(this).val(); 
        if (url) { 
            window.location = url; 
        }
        return false;
    });
    $('#resourceslayout-selection').bind('change', function () {
        var url = $(this).val(); 
        if (url) { 
            window.location = url;
        }
        return false;
    });
    
};
var centerSideBar = function() {
		var offset1 = Math.floor(window.innerHeight/2) + "px";
        var offset2 = Math.floor(window.innerHeight/2) - 116 + "px";
        $('.contact-tab').css("top", offset1);
        $('.chat-tab').css("top", offset2);

        var offset3 = "0px";
        $('.contact-tab').css("right", offset3);
        $('.chat-tab').css("right", offset3);
};

var hideSigninIfNeeded = function() {
	if (($('.signin-block') .length !== 0) && ($('.menu-signin') .length !== 0)) {
	      $('.menu-signin').css('display', 'none');
	}
}
function hideMenuSearchIconInSearchPage() {
	if (($('#search-result-block-section') .length !== 0) && ($('.menu-search-image-block-link') .length !== 0)) {
	      $('.menu-search-image-block-link').css('display', 'none');
	}
}
//Customize equal height function, wcs-equalizer-id is the parameter that shows the equalizer group.
Foundation.utils.image_loaded($('[wcs-data-equalizer] img'), function () {
//$(window).load(function() {
    Foundation.utils.S(window).off('[wcs-data-equalizer]').on('resize.fndtn.equalizer', function (e) {
        var items = Foundation.utils.S('[wcs-data-equalizer]'); 
		for (var i = 0; i < items.size(); i++) {
			var wcs_id=$(items[i]).attr('wcs-equalizer-id');
			var wcs_absolute_cal=$(items[i]).attr('wcs-absolute-calculate');
			var items_single_group;
			if (wcs_id!=null){
				items_single_group = Foundation.utils.S('[wcs-data-equalizer][wcs-equalizer-id="'+wcs_id+'"]');			
				wcs_columns_equalize(items_single_group,wcs_absolute_cal, wcs_id);	
				//For tryit page, the absolute value does not work, need JS to handle 
				set_tryitpage_button();
			}else{
				items_single_group = $(items[i]);
				wcs_columns_equalize(items_single_group);
			}
		}
    }.bind($(this)));
});

//IE9 hack, only on Mobile screen and ie9 browser
function set_tryitpage_button(){
	var ie = (function(){
		var undef, v = 3, div = document.createElement('div');

		while (
			div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
			div.getElementsByTagName('i')[0]
		);

		return v> 4 ? v : undef;
	}());
	if (ie) {
	    var screen_size=0;
	    if (matchMedia(Foundation.media_queries['large']).matches) {
	        screen_size=3;
	    } else if (matchMedia(Foundation.media_queries['medium']).matches) {
	        screen_size=2;
	    } else if (matchMedia(Foundation.media_queries['small']).matches) {
	        screen_size=1;
	    }
	    //only on small size
	    if(screen_size==1){
	    	$('.service-preview-bottom-buttons').css("position", "relative");
	    	$('.service-preview-bottom-buttons').css("padding-bottom", "2rem");
	    }else{
	    	$('.service-preview-bottom-buttons').css("position", "absolute");
	    	$('.service-preview-bottom-buttons').css("bottom", "0");
	    	$('.service-preview-bottom-buttons').css("padding-bottom", "0");
	    }
	}else{
		return;
	}
};

function wcs_columns_equalize(items,wcs_absolute_cal, wcs_id) {
    //Absolute height calculate can only apply with wcs_id together, it will calculate the absolute item on medium up screen
    var vals;
    var absulate_vals;
    if(wcs_id!=null){
        vals = $(items).find('[wcs-equalizer-id="'+wcs_id+'"][wcs-data-equalizer' + '-watch]:visible');
        if(wcs_absolute_cal!=null){
            absulate_vals=$(items).find('[wcs-equalizer-id="'+wcs_id+'"][wcs-data-equalizer' + '-watch]:visible'+' '+wcs_absolute_cal);	
        }
    }else{
        vals = $(items).find('[wcs-data-equalizer' + '-watch]:visible');	
    }
    if (vals.length === 0) return;
    $(items).trigger('before-height-change').trigger('before-height-change.fndth.equalizer');
    vals.height('inherit');
    var heights = vals.map(function () {
        return $(this).outerHeight(false)
    }).get();
    var absulate_heights;
    if(absulate_vals!=null){
        absulate_heights=absulate_vals.map(function () {
            return $(this).outerHeight(false)
        }).get();	
    }
    var small_column, medium_column, large_column;
    vals.each(function (index) {
        var attr_class = $(vals[index]).attr('class');
        if(attr_class.indexOf("small-")>-1 || attr_class.indexOf("medium-")>-1||attr_class.indexOf("large-")>-1){
        }
        else{
            attr_class=$(vals[index]).parent().attr('class');
        }
        //based on the usage of columns, if the columns css is not in the attr, it will in his parent div. 
        var re_small = /\bsmall-\d{1,2}\b|\ssmall-\d{1,2}\b/;
        var re_medium = /\bmedium-\d{1,2}\b|\smedium-\d{1,2}\b/;
        var re_large = /\blarge-\d{1,2}\b|\slarge-\d{1,2}\b/;
        var obj_match_small = attr_class.match(re_small);
        var obj_match_medium = attr_class.match(re_medium);
        var obj_match_large = attr_class.match(re_large);
        if (obj_match_small != null) {
            var str_match_small = String(obj_match_small).trim();
            small_column = parseInt(str_match_small.substring(str_match_small.indexOf("small-") + 6, str_match_small.indexOf("small-") + 8)); // get small number
        } else {
            small_column = 12;
        }
        if (obj_match_medium != null) {
            var str_match_medium = String(obj_match_medium).trim();
            medium_column = parseInt(str_match_medium.substring(str_match_medium.indexOf("medium-") + 7, str_match_medium.indexOf("medium-") + 9)); // get med number
        } else {
            medium_column = small_column;
        }
        if (obj_match_large != null) {
            var str_match_large = String(obj_match_large).trim();
            large_column = parseInt(str_match_large.substring(str_match_large.indexOf("large-") + 6, str_match_large.indexOf("large-") + 8)); // get large number
        } else {
            large_column = medium_column;
        }
    });
    var temp_css_column;
    var screen_size=0;
    if (matchMedia(Foundation.media_queries['large']).matches) {
        temp_css_column = large_column;
        screen_size=3;
    } else if (matchMedia(Foundation.media_queries['medium']).matches) {
        temp_css_column = medium_column;
        screen_size=2;
    } else if (matchMedia(Foundation.media_queries['small']).matches) {
        temp_css_column = small_column;
        screen_size=1;
    };

    var items_in_group = Math.floor(12 / temp_css_column);
    var group_number = Math.ceil(vals.length / items_in_group);
    for (var i = 0; i < group_number; i++) {
        var max_height_Group = 0;
        for (var j = 0; j < items_in_group && (i * items_in_group + j) < vals.length; j++) {
            if (absulate_heights!=null){
                max_height_Group = Math.max(max_height_Group, heights[i * items_in_group + j]+absulate_heights[i * items_in_group + j]);
            }
            else{
                max_height_Group = Math.max(max_height_Group, heights[i * items_in_group + j]);
            }
        }
        for (var k = 0; k < items_in_group && (i * items_in_group + k) < vals.length; k++) {
            $(vals[i * items_in_group + k]).css('height', max_height_Group);
        }
    }
    $(items).trigger('after-height-change').trigger('after-height-change.fndtn.equalizer');
}

function homepageBannerChangeFunc(slider, index) {
	var categorygrouptype = ($('.slick-slide')[index]).getAttribute("categorygrouptype");
	$("#homepage-banners").attr("class", categorygrouptype);
}
var popupHomepageSlide;
function set_slick(){
    $('.slick-service-container').slick({
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            ]
    });
    
    $('.slick-whats-new-container').slick({
        centerPadding: 0,
        centerMode: true,
	    arrows: false,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
		autoplay: true,
        fade: true,
		autoplaySpeed:10000,
 	    responsive : [
		{
			breakpoint: 983,
			adaptiveHeight: true,
			settings: {
				arrows: false
			} 
		},
       {
        breakpoint: 640,
        settings: {
        	arrows: false
        }
       }]
    });
    $('.slick-category-container').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed:10000 
    });

    popupHomepageSlide=$('.slick-homepage-container').slick({
        onAfterChange: function(slider,index) {
			homepageBannerChangeFunc(slider, index)
        },
        centerPadding: 0,
        centerMode: true,
	    arrows: true,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
		autoplay: true,
        fade: true,
		autoplaySpeed:10000,
 	    responsive : [
		{
			breakpoint: 983,
			adaptiveHeight: true,
			settings: {
				arrows: true
			} 
		},
       {
        breakpoint: 640,
        settings: {
        	arrows: false
        }
       }]
    });
};
$('.homepage-category-group-banner-pause').on('click', function () {
	try{
		 var iconBlock=$(this).children();
		 var pauseIcon="<img class='homepage-slick-pause-icon' alt='Pause' src='/res/images/icon-pause.png' style=''/>";
		 var playIcon="<img class='homepage-slick-play-icon' alt='Play' src='/res/images/icon-play.png' style=''/>";
		 if ($(iconBlock).hasClass('homepage-slick-pause-icon')){
			 popupHomepageSlide.slickPause();
			 $('.homepage-category-group-banner-pause').children().replaceWith(playIcon);
		 }else if($(iconBlock).hasClass('homepage-slick-play-icon')){
			 popupHomepageSlide.slickPlay();
			 $('.homepage-category-group-banner-pause').children().replaceWith(pauseIcon);
		 }
	}
	catch(err){
		console.log(err);
	}
});
//single video modal support, get the video id 
var ytvideoid;
var ytvideotitle;
var ytvideoPageID;
var ytvideoURL;
var ytvideoObject;
var ytvideoDesc;
var autoplayvalue;
var tryitdialoginfoindex;
$('.feature-modal-btn').on('click', function (e) {
    ytvideoid = $(this).data('ytvideoid');
    ytvideotitle = $(this).attr("ytvideoTitle");
    ytvideoPageID=$(this).attr("ytvideoPageID");   
    ytvideoURL=$(this).attr("ytvideoURL"); 
    ytvideoObject=$(this).attr("ytvideoObject"); 
	ytvideoDesc=$(this).attr("ytvideoDesc"); 
	tryitdialoginfoindex=$(this).attr("tryitdialoginfoindex"); 
    var str_iframe = "<h4 class='title'>"+ytvideotitle+"</h4>";
    $('#wcsmodal-video h4').replaceWith(str_iframe);
    $('#wcsmodal-tryit h4').replaceWith(str_iframe);
    $('#wcsmodal-selecttrialservice h4').replaceWith(str_iframe);
    //pop up dialogue info
    $('#wcsmodal-selecttrialservice .wcsmodal-info-block').empty();
    $('#wcsmodal-selecttrialservice .wcsmodal-info-block').append($(tryitdialoginfoindex+'.dialogue-try-pop-up-info-content').children().clone());
   
    $('#wcsmodal-video .cloud-dialog-caption').children().replaceWith("<div class='small-12 columns'><div class='p3'>"+ytvideoDesc+"</div></div>"); 

    if(ytvideoURL) {
    	$('#wcsmodal-video .modal-viewall-button').attr('href',ytvideoURL);
    	$('#wcsmodal-video .modal-viewall-button').show();
    } else {
    	$('#wcsmodal-video .modal-viewall-button').hide();
	};

    $('#wcsmodal-readiness-video h4').replaceWith(str_iframe);
   
    if (matchMedia(Foundation.media_queries['large']).matches) {
    	$('#wcsmodal-video').removeClass("small");
    	$('#wcsmodal-video').removeClass("medium");
    	$('#wcsmodal-video').removeClass("large");
    	$('#wcsmodal-video').addClass("medium");
    	
    } else if (matchMedia(Foundation.media_queries['medium']).matches) {
    	$('#wcsmodal-video').removeClass("small");
    	$('#wcsmodal-video').removeClass("medium");
    	$('#wcsmodal-video').removeClass("large");
    	$('#wcsmodal-video').addClass("medium");
        
    } else if (matchMedia(Foundation.media_queries['small']).matches) {
    	$('#wcsmodal-video').removeClass("small");
    	$('#wcsmodal-video').removeClass("medium");
    	$('#wcsmodal-video').removeClass("large");
    	$('#wcsmodal-video').addClass("small"); 
    };   
});

//Special case. If we don't have a link to put here then we should enable the close button instead
$('#wcsmodal-video .modal-close-button').on('click', function() {
	$('#wcsmodal-video').foundation('reveal', 'close');
});

var BCL = {};
BCL.isPlayerAdded = false;

function onBrightcoveTemplateLoaded(id) 
{
	BCL.player = brightcove.getExperience(id);
	BCL.experienceModule = BCL.player.getModule(APIModules.EXPERIENCE);
	BCL.videoPlayer = BCL.player.getModule(APIModules.VIDEO_PLAYER);
};

$(document).on('opened.fndtn.reveal', '[data-reveal][singleVideoModal]', function () {
    var modal = $(this);
    var element_id = $(this).attr('id');
    var obj_parent = "#" + element_id + " .flex-video";
	
	if (ytvideoObject == "brightcove")
	{
	    if (BCL.isPlayerAdded == false) 
		{
			var playerKey = (typeof ytvideoid === 'string') ? ytvideoid.substr(0, ytvideoid.indexOf(' ')) : "";
			var videoId   = (typeof ytvideoid === 'string') ? ytvideoid.substr(ytvideoid.indexOf(' ')+1) : ytvideoid.toString();

			if (playerKey == "") playerKey = "AQ~~,AAACtzWhMPk~,yakyzylX4OTWF9pGj-PWpALbZnJjRNjn";
			
			BCL.isPlayerAdded = true;
			var str_object = "<object id='myExperience' class='BrightcoveExperience'>"
						   + "<param name='bgcolor' value='black'/>"
						   + "<param name='width' value='1280'/>"
						   + "<param name='height' value='720'/>"
						   + "<param name='playerKey' value='"+playerKey+"'/>"
						   + "<param name='isVid' value='true'/>"
						   + "<param name='isUI' value='true'/>"
						   + "<param name='secureConnections' value='true'/>"
						   + "<param name='secureHTMLConnections' value='true'/>"
						   + "<param name='dynamicStreaming' value='true'/>"
						   + "<param name='@videoPlayer' value='"+videoId+"'/>"
						   + "<param name='templateLoadHandler' value='onBrightcoveTemplateLoaded'>"
						   +"</object>";
			var replace_tag = $(obj_parent).children();
			$(replace_tag).replaceWith(str_object);
			brightcove.createExperiences();
		}
	}
	else
	{
		var str_iframe = "<iframe id='player-frame' frameborder='0' allowfullscreen='' ></iframe>";
		var replace_tag = $(obj_parent).children();
		$(replace_tag).replaceWith(str_iframe);

		var h = $("#player-frame").height();
		var w = $("#player-frame").width();
		if(ytvideoid.search("brightcove")!=-1) {
			ytvideoid+="&width="+w+"&height="+h;
		}
		$("#player-frame").attr("src", ytvideoid);
	}
});

$(document).on('closed.fndtn.reveal', '[data-reveal][singleVideoModal]', function () {
    var modal = $(this);
    var element_id = $(this).attr('id');
	
	if ((ytvideoObject == "brightcove") && BCL.isPlayerAdded)
	{
		BCL.isPlayerAdded = false;
		BCL.experienceModule.unload();
	}
	
    $("#" + element_id + " .flex-video").children().replaceWith('<div id="feature-demo-video" />');

});

$(document).on('opened.fndtn.dropdown', '#offersMenu', function(){
    var items = Foundation.utils.S('[wcs-data-equalizer][wcs-equalizer-id*=Mega]'); 
	for (var i = 0; i < items.size(); i++) {
		var wcs_id=$(items[i]).attr('wcs-equalizer-id');
		var wcs_absolute_cal=$(items[i]).attr('wcs-absolute-calculate');
		var items_single_group;
		if (wcs_id!=null){
			items_single_group = Foundation.utils.S('[wcs-data-equalizer][wcs-equalizer-id="'+wcs_id+'"]');			
			wcs_columns_equalize(items_single_group,wcs_absolute_cal, wcs_id);
		} else {
			items_single_group = $(items[i]);
			wcs_columns_equalize(items_single_group);
		}
	}
});
$(document).on('click.fndtn.topbar', '.top-bar', function(){
	var isExpanded=$(".top-bar").hasClass("expanded")
	if (isExpanded){
		//update the index of menu items inside
		$('#searchbox-textfield-mobile').attr('tabindex','0');
		$('.menu-mobile-accessibility-link').attr('tabindex','0');
	}else{
		//update the index of menu item 
		$('#searchbox-textfield-mobile').attr('tabindex','-1');
		$('.menu-mobile-accessibility-link').attr('tabindex','-1');
	}
});
$('#searchbox-textfield').keydown(function(e) {
	var isMobile=isMobileWindow();	
	if (isMobile==false){
	  var code = e.keyCode || e.which;
	  if(code == 13) {
		$("#searchbox-form").submit();
	  } 
	}
});
$('#searchpage-searchbox-textfield').keydown(function(e) {
	  var code = e.keyCode || e.which;
	  if(code == 13) {
		$("#searchpage-searchbox-form").submit();
	  } 
});

$('#searchbox-textfield-mobile').keydown(function(e) {
	var isMobile=isMobileWindow();	
	if (isMobile==true){
	  var code = e.keyCode || e.which;
	  if(code == 13) {
		 //this code is the search key in iphone
		$("#searchbox-form-mobile").submit();
	  } 
	}
});
$('#searchbox-textfield-offcanvas-mobile').keydown(function(e) {
	var isMobile=isMobileWindow();	
	if (isMobile==true){
	  var code = e.keyCode || e.which;
	  if(code == 13) {
		 //this code is the search key in iphone
		$("#searchbox-form-offcanvas-mobile").submit();
	  } 
	}
});

$(window).scroll(function() {
	  $("#searchbox-form").fadeOut("slow");
});
$('html').click(function(e) {
	try{
	    //console.log(e.target.className);
	    var searchClickBlock='.has-form.menu-search-image-block';
	    var searchPopUpBlock='#menu-search-block';
	    if ($(e.target).is(searchClickBlock)||$(e.target).parents(searchClickBlock).length){
	    } else if ($(e.target).is(searchPopUpBlock)||$(e.target).parents(searchPopUpBlock).length){
	    } else{
	    	//if the search pop up field is open, close it.
			if ($('#searchbox-form').is(":visible")){
				$("#searchbox-form").hide();
			} 	
	    }
	}catch(err){
		console.log(err);
	}
});

$(document).keydown(function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '9'){
		//tab key
		var focused=document.activeElement;
		//console.log(document.activeElement);
		if($(focused).parents('.tab-bar').length>0||$(focused).parents('.left-off-canvas-menu').length>0){
		}else{
			$('.off-canvas-wrap').removeClass("move-right");
			if ($('.mobile-offcanvas-menu-link-block').attr('tabindex')=='0'){
				$('.mobile-offcanvas-menu-link-block').attr('tabindex','-1');
			}
		}	
	}
});
$(document)
	.on('open.fndtn.offcanvas', '[data-offcanvas]', function() {
		$('.mobile-offcanvas-menu-link-block').attr('tabindex','0');
	})
	.on('close.fndtn.offcanvas', '[data-offcanvas]', function() {
		$('.mobile-offcanvas-menu-link-block').attr('tabindex','-1');
})
$(document).on('click', '.mm-searchfield-icon', function(event) {
	$('#mMenuSearchForm').submit();
}) 
