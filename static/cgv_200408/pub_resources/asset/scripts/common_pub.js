window.onload = function () {
	bindScrollEvnt($(".freeze-multi-scroll-table-body"))
};

$(function ($) {

	var _oldShow = $.fn.show;
	$.fn.show = function(speed, oldCallback) {
		return $(this).each(function() {
			var obj = $(this)
			var newCallback = function() {
				if ($.isFunction(oldCallback)) oldCallback.apply(obj);
				obj.trigger('afterShow');
			};
			obj.trigger('beforeShow');
			// now use the old function to show the element passing the new callback
			_oldShow.apply(obj, [speed, newCallback]);
			newCallback();
		});
	}

	var _oldHide = $.fn.hide;
	$.fn.hide = function(speed, oldCallback) {
		return $(this).each(function() {
			var obj = $(this)
			var newCallback = function() {
				if ($.isFunction(oldCallback)) oldCallback.apply(obj);
				obj.trigger('afterHide');
			};
			obj.trigger('beforeHide');
			// now use the old function to show the element passing the new callback
			_oldHide.apply(obj, [speed, newCallback]);
			newCallback();
		});
	}

  /* ==============================
  * 초기화
  * ============================== */
  /*메뉴 박스 하단 고정*/
  $(".more-box").hide().css("visibility", "hidden");

  /* ==============================
  * 검색 닫기
  * ============================== */

    $(".input-clear-func").click(function () {
      // $(".resultingarticles").empty();
      $(".input-search-func").val("");
      //$(".input-clear-func").hide();
      $(".input-clear-func").css('display', 'none');
    });

    $(".input-search-func").on("propertychange change keyup paste input", function() {
      //$(".btn-clear").show();
      if($(this).val() == "") {
        $(".btn-clear").css('display', 'none');
      } else {
        $(".btn-clear").css('display', 'inline');
      }
    });

  /* ==============================
   * 진행바
   * ============================== */
    $('.progressbar1').LineProgressbar({
      percentage: 50,
      fillBackgroundColor: '#fb4357',
      height: '18px',
      // radius: '50px',
      unit: '',
      animation: true
    });
    $('.progressbar2').LineProgressbar({
      percentage: 10,
      fillBackgroundColor: '#fb4357',
      height: '18px',
      // radius: '50px',
      unit: '',
      animation: true
    });
    $('.progressbar3').LineProgressbar({
      percentage: 20,
      fillBackgroundColor: '#fb4357',
      height: '18px',
      // radius: '50px',
      unit: '',
      animation: true
    });
    $('.progressbar4').LineProgressbar({
      percentage: 30,
      fillBackgroundColor: '#fb4357',
      height: '18px',
      // radius: '50px',
      unit: '',
      animation: true
    });

  /* ==============================
   * 로딩바
   * ============================== */
    $(document).ajaxStart(function () {
      $("#loadingBar").show();
    }).ajaxStop(function () {
      $("#loadingBar").hide();
    });

    $("a").click(function () {
      if (this.href != null && this.target != "_blank") {
        $("#loadingBar").show();
      }
    });

  /* ==============================
   * 아코디언 (accordion) - 타이틀, 컨텐츠 분리된 부분
   * ============================== */
    $(document).on('click', '.accordion .accordion-arrow', function () {
      $('.accordion-contents').slideUp(200);
      if ($(this).parent().hasClass('active')) {
        $('.accordion').removeClass('active');
        $(this).parent().removeClass('active');
      } else {
        $('.accordion').removeClass('active');
        $(this).parent().children('.accordion-contents').slideDown(200);
        $(this).parent().addClass('active');
      }
    });

  /* ==============================
   * 아코디언 (accordion) - 타이틀, 컨텐츠 합쳐진 부분
   * ============================== */
   $('.sale-list.accordion02').each(function(index, elem) {
      if ($(this).find(".accordion-whole").height() > 190 ) {
        $(this).removeClass('not');
        $(this).addClass('active02');
      } else {
        $(".accordion-whole").removeClass('active02');
        $(this).addClass('not');
      }
    });

    $(document).on('click', '.sale-list.active02 .accordion-arrow', function () {
      if ($(this).prev(".accordion-whole").hasClass('current')) {
        $(this).prev(".accordion-whole").removeClass('current');
      } else {
        $(".sale-list.active02").find(".accordion-whole").removeClass('current');
        $(this).prev(".accordion-whole").addClass('current');
        }
    });

 /* ==============================
   * 아코디언 (accordion) - 고객정보(2줄만 보이게)
   * ============================== */
    $('.accordion-ver2-wrap').each(function(index, elem) {
      if ($(this).find(".accordion-ver2").height() > 46 ) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
    $(document).on('click', '.accordion-ver2-wrap.active .accordion-arrow', function () {

      if ($(this).parent('.accordion-ver2-wrap').hasClass('show')) {
        $('.accordion-ver2-wrap').removeClass('show');
        $(this).parent('.accordion-ver2-wrap').removeClass('show');
      } else {
        $('.accordion-ver2-wrap').removeClass('show');
        $(this).parent('.accordion-ver2-wrap').addClass('show');
      }
    });
  /* ==============================
   * 팝업
   * ============================== */
    $('.pop-dimed').on("afterHide",function(e) {
    	$("section").removeClass('dim-on');
    });
    $('.pop-dimed').on("afterShow",function(e) {
    	$("section").addClass('dim-on');
    });
    $(".more-box").on("afterHide",function(e) {
    	// console.log(e.target);
    	$("section").removeClass('dim-on');
    });
    $(".more-box").on("afterShow",function(e) {
    	$("section").addClass('dim-on');
    });

    $(window).resize(function() {
      layer_popup();
    });
    function layer_popup(popHref) {
      var el = $('[data-pop="'+ popHref +'"]');
      var isDim = el.siblings().hasClass('pop-bg');

      //dimmed 레이어를 감지하기 위한 boolean 변수
      isDim ? el.parents('.pop-dimed').addClass('show-pop') : el.addClass('show-pop');
      // 닫기버튼 클릭 시 레이어 닫힘
      el.find('.pop-close').click(function (e) {
        e.preventDefault();
        isDim ? $('.pop-dimed').removeClass('show-pop') : el.removeClass('show-pop');
        return false;
      });
    }

  /* ==============================
   * 풀페이지 팝업
   * ============================== */
  $(document).on('click', '.pop-open-full', function (e) {
    e.preventDefault();
    var popHref = $(this).attr('href');
    full_popup(popHref);
    // console.log('popHref', popHref);
  });
  function full_popup(popHref) {
    var el = $('[data-pop="'+ popHref +'"]');
    el.addClass('show-pop');
    // 닫기버튼 클릭 시 레이어 닫힘
    el.find('.pop-close').click(function (e) {
      e.preventDefault();
      el.removeClass('show-pop');
      return false;
    });
  }

  /* ==============================
    * textarea 높이 자동조절 - 업무메모
    * ============================== */
  $('textarea.input-button').css({"height": "38px"})
  $(document).on('keyup', 'textarea.input-button', function() {
    var thisInput = $(this);
    adjustHeight(thisInput);
  });
  function adjustHeight(thisInput) {
    var textEle = thisInput;
    var textEleHeight = textEle.prop('scrollHeight');
    textEle.css('height', textEleHeight);
  };

  /* ==============================
  * 영화날짜 선택
  * ============================== */
    $(document).on('click','.select-date-wrap .items', function() {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
    });

  /* ==============================
  * 스와이퍼(년도 선택)
  * ============================== */
//    var swiperCalendar = new Swiper('.select-calendar', {
//      navigation: {
//        nextEl: '.swiper-button-next',
//        prevEl: '.swiper-button-prev',
//      },
//      observer: true,
//      observeParents: true,
//      loop: true,
//    });

  /* ==============================
  * date-picker
  * ============================== */
  $(function() {
    $('.date-picker').datepicker({
        inline: true,
        dateFormat: "yy-mm-dd",
        showOtherMonths: false,//빈 공간에 현재월의 앞뒤월의 날짜를 표시
        showMonthAfterYear: true,//년도 먼저 나오고, 뒤에 월 표시
        changeYear: false, //콤보박스에서 년 선택 가능
        changeMonth: false, //콤보박스에서 월 선택 가능
        monthNamesShort: ['01','02','03','04','05','06','07','08','09','10','11','12'], //달력의 월 부분 텍스트
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
      //   onSelect: function (dateText, inst) {
      //   $("[data-pop='#calendarPop'] .mg-l4").text(new Date(dateText).format("yyyy.MM.dd"));
      // }
    });
  });

  /* ==============================
  * 라디오 탭
  * ============================== */
    var radioContent = $('.input-tab-func > .input-tabcontents');
    radioContent.last().hide();

    $('.input-tab-func input[type="radio"]').click(function() {
      radioContent.hide();
      radioContent.eq($('.input-tab-func input[type="radio"]').index(this)).show();
    });

  /* ==============================
  * 이전페이지 가기
  * ============================== */
  function goBack() {
    window.history.back();
  }

  /* ==============================
  * 버튼체크 active 클래스 추가
  * ============================== */
  $(document).on('click', '.is-check-func', function() {
    $(this).toggleClass('active');
  });

  /* ==============================
  * 하단고정 메뉴
  * ============================== */
    $(".bottom-menu .more .bottom_btn").click(function () {
      if ( $(".more-box").hasClass('on')) {
        $(this).parent().removeClass('on');
        $(".more-box").removeClass('on');
        $("footer .pop-bg").removeClass('on');
        setTimeout(function(){
          $(".more-box").hide().css("visibility", "hidden");
        },500)
      } else {
        $(".more-box").show().css("visibility", "visible");
        $(this).parent().addClass('on');
        $("footer .pop-bg").addClass('on');
        setTimeout(function(){
          $(".more-box").addClass('on');
        },10)
      }
    });
    $("footer .pop-bg").click(function () {
      if ($("footer .pop-bg").hasClass('on')) {
        $(".more-box").removeClass('on');
        $(this).removeClass("on");
        $(this).removeClass("on");
        $("section").removeClass("dim-on");
        $(".more").removeClass("on");
      } else {
        $(".more-box").addClass('on');
        $(this).addClass("on");
        $(".more").addClass("on");
      }
    });

  /* ==============================
  * tab 디자인 버튼 active 클래스 추가
  * ============================== */
    $(document).on('click', '.top-btn-list button', function() {
    	$(this).siblings("button").removeClass('active');
        $(this).addClass('active');
//      if ($(this).hasClass('active')) {
//        $(this).removeClass('active');
//      } else {
//        $(".top-btn-list button").removeClass('active');
//        $(this).addClass('active');
//      }
    });

  /* ==============================
  * 상영 색 변경 팝업 active 클래스 추가
  * ============================== */

    $(document).on('click', '.color-box li', function() {
      if (!$(this).parents().hasClass('color-tbl-wrap')) {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
        } else {
          $(".color-box li").removeClass('active');
          $(this).addClass('active');
        }
      }
    });

  /* ==============================
  * 상영 색 변경 팝업 active 클래스 추가
  * ============================== */
    $(document).on('click', '.selecttime-box.style02 li', function() {
      if ($(this).hasClass('active02')) {
        $(this).removeClass('active02');
      } else {
        $(".selecttime-box.style02 li").removeClass('active02');
        $(this).addClass('active02');
      }
    });

  /* ==============================
 * CMS navi
 * ============================== */
/* navi */
$(document).on('click', '.btn-cms-navi', function () {
  $(this).next(".cms-navi-box").addClass('open');
});
/* navi btn close */
$(document).on('click', '.btn-naviclose', function () {
  $(this).parent(".cms-navi-box").removeClass('open');
});
/* list */
$(document).on('click', '.navi-list a', function () {
  if ($(this).next("ul").hasClass('open')) {
    $(".navi-list a").removeClass('active');
    $(this).addClass('active');
    $(this).next("ul").slideUp(100).removeClass('open');
  } else {
    $(".navi-list a").removeClass('active');
    $(this).next("ul").slideDown(100).addClass('open');
    $(this).addClass('active');
  }
});
$(document).on('click', '.cms-navi-menu .tit', function() {
  if($(this).parent('.cms-navi-menu').hasClass('active') && !$('.cms-navi-menu:first-child')){
  $(this).parent('.cms-navi-menu').removeClass('active');
  }else {
  $(".cms-navi-menu").removeClass('active');
  $(this).parent('.cms-navi-menu').addClass('active');
  }
  })

/* ==============================
* cms sorting
* ============================== */
$(document).on('click', '.sorting-list button', function() {
  $(".sorting-list li").removeClass('active');
  $(this).parent().addClass('active');
});
$(document).on('click', '.sidebar-dropdown > a', function() { //메뉴 클릭
  $(this).children().find(".sidebar-submenu").slideUp(200); //전체하위 메뉴 슬라이드 업
});

/* ==============================
* loading bar
* ============================== */
function showLoadingBar() { 
  var maskHeight = $(document).height(); 
  var maskWidth = window.document.body.clientWidth; 
  var mask = "<div class='page-mask'></div>"; 
  var loadingImg = ''; 
  loadingImg += "<div class='loading-img'>"; 
  loadingImg += " <img src='../../../resources/images/loading.gif'/>"; 
  loadingImg += "</div>";
  $('body').append(mask).append(loadingImg); 
  $('.page-mask').css({ 'width' : maskWidth , 'height': maskHeight , 'opacity' : '0.3', 'z-index' : '99999' }); 
  $('.page-mask').show(); 
  $('.loading-img').show(); 
  }
  function hideLoadingBar() { 
  $('.page-mask, .loading-img').hide();
  $('.page-mask, .loading-img').remove(); 
  }

/* ==============================
* 좌석판매현황 tbl-total (border css)
* ============================== */
$(".tbl-total").prev("tr").children("td").css("border-bottom", "none");

/* ==============================
* 테이블 클릭 타입
* ============================== */
$(document).on('click', '.select-type tr', function() {
  if ($(this).hasClass('active')) {
    $(".select-type tr").removeClass("active");
    $(this).addClass("active");
  } else {
    $(".select-type tr").removeClass("active");
    $(this).addClass("active");
  }
});

/* ==============================
* 풀팝업 하단 버튼
* ============================== */
if ($(".pop-house-full .pop-layer").find(".btn-group").length > 0 ) {
//  $(".pop-house-full .pop-container").css("padding-bottom","70px");
  $(".pop-house-full .pop-container .con").css("padding-bottom","70px");
}
if ($(".pop-house-full .pop-layer").find(".btn-single").length > 0 ) {
//  $(".pop-house-full .pop-container").css("padding-bottom","70px");
	$(".pop-house-full .pop-container .con").css("padding-bottom","70px");
}

/* ==============================
* 팝업 하단 버튼
* ============================== */
$(".pop-house .pop-layer .pop-container").siblings(".btn-group").each(function(){
	$(this).parents(".pop-layer").find(".con").css("padding-bottom","70px");
});
$(".pop-house .pop-layer .pop-container").siblings(".btn-single").each(function(){
	$(this).parents(".pop-layer").find(".con").css("padding-bottom","70px");
});


/* ==============================
* 드롭다운 (autoCmpl)
* ============================== */
var siteList = []
for (var i = 0 ; i<20; i++){
  var testObj = {};
  testObj.label = "test"+i;
  siteList.push(testObj);
}
var proto = $.ui.autocomplete.prototype;
var autoCmpl = $(".autoCmpl").autocomplete({
   source: siteList
  ,minLength: 1
  ,classes: {
    "ui-autocomplete": "drop-options"
  }
  ,select: function(event, ui) {
    // console.log(ui.item.code);
  }
});

$(document).ready(function(){

  /* ==============================
  * 레이아웃 상단고정
  * ============================== */
  var content_title = $(".content-title").height();
  // console.log("content_title",content_title)
  $(".content-title").parents(".content-sub").css("padding-top",content_title + 64);

  /* ==============================
  * VIP 좌석설정 이벤트
  * ============================== */
  var seat_con_h = $(".content-sub").height();
  var seat_bar_h = $(".seat-setting-wrap").outerHeight();
  $(".select-table-wrap").css("min-height",seat_con_h - seat_bar_h);
  
  /* 관람가 아이콘 center클래스 추가 */
  $('.icon-age').wrapInner('<span class="center"></span>');
});

/* ==============================
* 상영 툴팁
* ============================== */
$(".content-list").scroll(function(){
	$(".movie-name").tooltip("close")
	$(".schedule-phonenum").tooltip("close")
});
$(".movie-name").tooltip({
  open: function( event, ui ) {
    var trg_offset = $(event.target).offset(); // td 위치
    var tooltip = ui.tooltip;
    var tt_width_txt = $(tooltip).css("width").replace("px","");
    var trg_width_txt = $(event.target).css("width").replace("px","");
    // console.log(width);
    //var width = $(event.target).css("width").substring( 0, $(event.target).css("width").length-2); // td width
    var tt_width = Number(tt_width_txt)/2; // tt width 50%
    var trg_width = Number(trg_width_txt)/2; // td width 50%
    //console.log(tmp);
    $(tooltip).offset({top:trg_offset.top - 50 , left:trg_offset.left - tt_width + trg_width}); // 툴팁 위치
    var win_offset = $("body").offset();
    // console.log("off",tooltip.offset());
    if (tooltip.offset().left < 0 ) {
      tooltip.offset({left:10});
      tooltip.addClass("positionleft");
    }
  },
  close: function( event, ui ) {
    $("[role='log']").empty();
  },
  content:function(){
    var ref = $(this).attr("data-ref");
    if(!ref) ref = "";
    return  "<p class='movie'> "+$(this).text() + "</p>" +"<p class='auditorium'> "+ ref + "</p>";
  }
});

$(".schedule-phonenum").tooltip({
  open: function( event, ui ) {
    var trg_offset = $(event.target).offset(); // td 위치
    var tooltip = ui.tooltip;
    var tt_width_txt = $(tooltip).css("width").replace("px","");
    var trg_width_txt = $(event.target).css("width").replace("px","");
    var tt_width = Number(tt_width_txt)/2; // tt width 50%
    var trg_width = Number(trg_width_txt)/2; // td width 50%
    $(tooltip).offset({top:trg_offset.top - 40 , left:trg_offset.left - tt_width + trg_width}); // 툴팁 위치
    var win_offset = $("body").offset();
    if (tooltip.offset().left < 0 ) {
      tooltip.offset({left:10});
      tooltip.addClass("positionleft");
    }
  },
  close: function( event, ui ) {
    $("[role='log']").empty();
  },
    content: function() {
    return $(this).prop('title');
    }
});

	/* ==============================
	 * 가로 스크롤 이벤트 (버튼)
	 * ============================== */
  // $(".freeze-multi-scroll-table-body").scroll(function (e) {
  //   var l_x_scroll = $(this).scrollLeft();
	// 	if (l_x_scroll > 30) $(".icon-x-scroll").fadeOut();
	// 	else $(".icon-x-scroll").fadeIn();
	// });

  /* ==============================
   * 미소지기 체크박스 체크시 이벤트
   * ============================== */
  $(".checkbox-table:visible input").change(function () {
    if ($(".checkbox-table:visible input:checked").length > 0) {
      $(this).parents().find(".check-info-txt").show();
    }else {
      $(this).parents().find(".check-info-txt").hide();
    }
  });

  /* ==============================
   * 상영 스케줄 조회 sort
   * ============================== */
  $(".movie-sort-list li").click(function(){
    if(!$(this).hasClass("active")) {
      $(this).addClass("active");
      $(this).siblings("li").removeClass("active");
    }
  })

  /* ==============================
   * 근무확인 탭 이벤트
   * ============================== */
  function tabEvt(el, num){
    var num = num || 0;
    var menu = $(el).children();
    var con = $(el + 'Con').children();
    var selectItem = $(menu).eq(num);
    var i = num;

    selectItem.addClass('active');
    con.eq(num).addClass('current');

    menu.click(function(){
        if(selectItem !== null){
            selectItem.removeClass('active');
            con.eq(i).removeClass('current');
        }

        selectItem = $(this);
        i = $(this).index();

        selectItem.addClass('active');
        con.eq(i).addClass('current');
    });
  }
  tabEvt('#tab', 0);
  tabEvt('#tab02', 0);

  /* ==============================
   * VIP 좌석설정 이벤트
   * ============================== */
  $(".content-sub").scroll(function (e) {
    var l_y_scroll = $(this).scrollTop();
		if (l_y_scroll > 0) {
      $(".page-quickreserve.ver-modi").css("padding-top", "60px");
      $(".seat-setting-wrap").addClass("isScrolled");
    }
		else {
      $(".page-quickreserve.ver-modi").css("padding-top", "0px");
      $(".seat-setting-wrap").removeClass("isScrolled");
    }
  });


  /* ==============================
   * 사이트 게시판 이벤트
   * ============================== */

   //삭제 아이콘 영역을 클릭시 이벤트
  $(document).on("click",".delete-icon",function(e){
    //타겟이 삭제 버튼인경우 이벤트 종료
    if($(e.target).hasClass("di-btn")) return;
    //타겟이 하위 span인 경우 부모를 타겟으로 지정
    var target = $(e.target).hasClass("delete-icon") ?  $(e.target) : $(e.target).parents(".delete-icon");
    //삭제 아이콘을 모두 비활성화
    $(".delete-icon").find(".di-btn").removeClass("active");
    //클릭한 삭제 아이콘을 활성화
    target.find(".di-btn").addClass("active");
    //모든 document에 클릭 이벤트 바인드
    $(document).bind("click",function(oe){
      //타겟지정
      var oeTarget = $(oe.target);
      //타켓이 삭제버튼이거나 , 삭제 아이콘 버튼이거나 , 삭제 아이콘 하위 span인 경우 이벤트 종료
      if(oeTarget.hasClass("di-btn") || oeTarget.hasClass("delete-icon") || oeTarget.parents(".delete-icon").length) return;
      //삭제 아이콘 비활성화
      $(".delete-icon").find(".di-btn").removeClass("active");
      //현재 이벤트 언바인드.
      $(document).unbind(oe);
    });
  })

	$(document).click(function(e){
		// 셀렉트박스 버튼이 아닌 경우
		if(!$(e.target).hasClass("btn_select")){
			if($(e.target).hasClass("option")){
				var optionTxt = $(e.target).text();
				var optionVal = $(e.target).attr("data-val");
				$(e.target).parent().prev().text(optionTxt);
				$(e.target).parent().prev().attr("data-val",optionVal);
				$("#srchType").removeClass("open");
				$("#srchType").trigger("select");
			}
			if($('.drop-list').is(":visible")){
				$("#srchType").removeClass("open");
				$('.drop-list').hide();
			}
		//셀렉트 박스 버튼인 경우
		}else{
			if($(e.target).hasClass("open")){
				$(e.target).removeClass("open");
				$(e.target).next().hide();
			}else{
				$(e.target).addClass("open");
				$(e.target).next().show();
			}
		}
	})

}); /////////////////////////////////////////// function - end

/* ==============================
* freeze mult 스크롤 이벤트 함수
* ============================== */
function bindScrollEvnt(el) {
	$(el).bind("scroll", function (e) {
		var d_width    = Number($(e.target).outerWidth()); //화면에 보여지는 넓이
		var frz_width  = d_width+100;
//		= $(e.target).find("table").outerWidth(); //내부 테이블의 넓이
		var l_x_scroll = Number($(el).scrollLeft()); //스크롤값
//		alert("frz_width:"+frz_width +"  d_width:"+d_width);
		if(frz_width <= d_width+l_x_scroll){
			$(".icon-x-scroll").addClass("rotate")
		}else{
			$(".icon-x-scroll").removeClass("rotate")
		}
	});
}
/* ==============================
* freeze mult 스크롤 버튼 이벤트
* ============================== */
$(document).on("click", ".icon-x-scroll", function (e) {
  var nxt = $(e.target).next();
  /*var l_x_scroll = $(".freeze-multi-scroll-table-body").scrollLeft();
  var d_width = $(e.target).parents(".content-list").outerWidth();
  */
  var num = d_width*2;
	if(!$(e.target).hasClass("rotate")) {
		$(nxt).find(".freeze-multi-scroll-table-body").animate({
			scrollLeft: num
		}, 300);
	} else {
		$(nxt).find(".freeze-multi-scroll-table-body").animate({
			scrollLeft: 0
		}, 300);
	}
});

/* ==============================
* anypicker 함수 (년월일)
* ============================== */
$.fn.dateAnyPicker = function(option){
	  var maxDate,minDate ;
	  var el = $(this);
	  if(!option.maxDate) maxDate = false;
	  else maxDate = new Date(option.maxDate[0],option.maxDate[1],2);
	  if(!option.minDate) minDate = false;
	  else minDate = new Date(option.minDate[0],option.minDate[1],2);

	  $(this).AnyPicker({
	    mode: "datetime",
	    dateTimeFormat: option.format,
	    minValue: minDate,
	    maxValue: maxDate,
	    buttonClicked : function(){
	    	$("section").removeClass('dim-on');
	    },
	    parseInput:function(sElemValue)
		{
	    	console.log("test",new Date(sElemValue));
	    	this.setSelectedDate(new Date(sElemValue));
	    	$("section").addClass('dim-on');
			return sElemValue;
		},
	    setOutput: function(dateTxt){
	    	el.val(dateTxt);
	    	option.onChange();
	    	return dateTxt;
	    },
	    viewSections:
	    {
	      header: ["headerTitle"],
	      contentTop: [],
	      contentBottom: [],
	      footer: ["setButton", "cancelButton"]
	    },
	    i18n:
	    {
	      setButton: "확인",
	      cancelButton : "취소"
	    },
	    headerTitle:
	      {
	        markup: "<span class='ap-header__title02'>날짜선택</span>"
	        // type: "Text",
	        // contentBehaviour: "Static",
	        // format: ""
	      }
	  });
	}

/* ==============================
* anypicker 함수 (시간)
* ============================== */
$.fn.timeAnyPicker = function(){
  $(this).AnyPicker({
    mode: "select",
    components: oArrComponents,
    dataSource: oArrDataSource,
    parseInput: function(item){
      var oArrInput = [];
      var oValues = {hours:1 , minutes:0};
      var arr = item.split(":");
      oValues.hours = arr[0]
      oValues.minutes = arr[1]
      oArrInput = [oValues.hours ,oValues.minutes ];
      return oArrInput;
    },
    formatOutput: function(item){
      // console.log("out",item);
      if (!item.values[0].val || item.values[0].val == "") {
    	  item.values[0].val = "06";
    	  item.values[0].label = "06";
      }
      return item.values[0].label+":"+ item.values[1].label;
    },
    viewSections:
    {
      header: ["headerTitle"],
      contentTop: [],
      contentBottom: [],
      footer: ["setButton", "cancelButton"]
    },
    i18n:
    {
      headerTitle: "시간선택",
      setButton: "확인",
      cancelButton : "취소",
    },
  });
}
var oArrData = [];
function createDataSource(){
  var oArrDataNum = [29, 59],iTempIndex1, iTempIndex2;
  var txtIdx;
  for(iTempIndex1 = 0; iTempIndex1 < oArrDataNum.length; iTempIndex1++){
    if(iTempIndex1 == 0){
      var iNum = oArrDataNum[iTempIndex1],
      oArrDataComp = [];
      for(iTempIndex2 = 6; iTempIndex2 < (iNum + 1); iTempIndex2++){
        if(iTempIndex2 < 10) txtIdx = "0"+iTempIndex2;
        else txtIdx = iTempIndex2 + "";
        oArrDataComp.push({
          val: txtIdx,
          label: txtIdx
        });
      }
    }else{
      var iNum = oArrDataNum[iTempIndex1],
      oArrDataComp = [];
      for(iTempIndex2 = 0; iTempIndex2 < (iNum + 1); iTempIndex2 = iTempIndex2+5){
        if(iTempIndex2 < 10) txtIdx = "0"+iTempIndex2;
        else txtIdx = iTempIndex2 + "";
        oArrDataComp.push({
          val: txtIdx,
          label: txtIdx
        });
      }
    }
    oArrData.push(oArrDataComp);
  }
}
createDataSource();
var oArrComponents = [
  {component: 0,name: "hours",label: "Hours",width: "50%",textAlign: "center"},
  {component: 1,name: "minutes",label: "Minutes",width: "50%",textAlign: "center"}
],
oArrDataSource = [
  {component: 0,data: oArrData[0]},
  {component: 1,data: oArrData[1]}
];
