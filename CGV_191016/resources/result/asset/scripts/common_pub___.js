$(function($){

  /* ==============================
  * 실시간예매순위
  * ============================== */
  $(".ranking-box .list li").click(function(){
    $(".ranking-box .list li").removeClass("active");
    $(this).addClass("active");
  });

  /* ==============================
  * 하단고정 메뉴
  * ============================== */
  $(".bottom-menu .more .bottom_btn").click(function () {
    if ( $(".more-box").hasClass('on')) {
      $(this).parent().removeClass('on');
      $(".more-box").removeClass('on');
      $(".pop-dimed").fadeOut();
      setTimeout(function(){
        $(".more-box").hide().css("visibility", "hidden");
      },500)
    } else {
      $(".more-box").show().css("visibility", "visible");
      $(this).parent().addClass('on');
      $(".pop-dimed").fadeIn();
      setTimeout(function(){
        $(".more-box").addClass('on');
      },10)
    }
  });

  /* ==============================
  * 테이블 툴팁
  * ============================== */
  $(".movie-name").tooltip({
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
      setTimeout(function(){ $(".pop-dimed").show()} ,50)
    },
    close: function( event, ui ) {
      // console.log(event)
      $("[role='log']").empty();
      $(".pop-dimed").hide();
    },

    // 영화 연령 아이콘 
    content:function(){
      return  "<p class='movie " +"'> "+$(this).text() + "</p>";
    }
  
  });

  /* ==============================
  * 가로 스크롤 이벤트 (버튼)
  * ============================== */
  $(".freeze-multi-scroll-table-body").scroll(function(e){
    var l_x_scroll = $(this).scrollLeft();
    if(l_x_scroll > 30) $(".icon-x-scroll").fadeOut();
    else $(".icon-x-scroll").fadeIn();
  });

    /* ==============================
    * 탑버튼 이벤트 (스크롤 및 클릭)
    * ============================== */
   $(".content-wrap").on("scroll",function(){
    var content_s_top = $(this).scrollTop();
     // TOP 버튼
     if (content_s_top > 200) $(".btn-top").fadeIn(400);
     else $(".btn-top").fadeOut(400);
   });
   
   $(".btn-top").on("click",function(){
     $(".content-wrap").animate({ scrollTop : 0 }, 400)
    });
    
    /* ==============================
    * layer close
    * ============================== */
    // 취소버튼
    $('a.popClose').click(function(){
      $('.pop-house').fadeOut();
      $('.pop-dimed').fadeOut();
      return false;
    });
    // 상단 엑스버튼
    $('.btn-close').click(function(){
      $('.pop-house').fadeOut();
      $('.pop-dimed').fadeOut();
      return false;
    });

    /* ==============================
    *베너 피커 좌우버튼 클릭이벤트
    * ============================== */
    $(".picker-box button").click(function(){
      var date = $(this).siblings("input").val();
      if($(this).attr("class") == "btn-prev") {
        var rdate = changeDate("sub",date);
        $(this).siblings("input").val(rdate).trigger("change");
      } else if ($(this).attr("class") == "btn-next") {
        var rdate = changeDate("add",date);
        $(this).siblings("input").val(rdate).trigger("change");
      }
    });

    /* ==============================
    * 검색 팝업 input
    * ============================== */
    // 클리어버튼 클릭
    $(".btn-inputclear").click(function () {
      $(".search-box input").val("");
      $(this).css('display', 'none');
    });
    // 인풋 입력시 클리어버튼 노출
    $(".search-box input").on("propertychange change keyup paste input", function() {
      if($(this).val() == "") {
        $(".btn-inputclear").css('display', 'none');
      } else {
        $(".btn-inputclear").css('display', 'block');
      }
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

    /* ==============================
    * 피커 디폴트 날짜 (어제)
    * ============================== */
    $("#dp").val(fn_getFlagDate("d"));
    $(".anypicker-input").val(fn_getFlagDate("m"));





    // var fixed_arr = [];
    // $(".fixed-area02").each(function(idx, el){
    //   fixed_arr.push(el);
    // })
    // for(i=0;i < fixed_arr.length;i++) {
    //   console.log("fixed_arr",fixed_arr[i]);
    //   var height_01 = $(fixed_arr[0]).height();
    //   // var height_02 = $(fixed_arr[1]).height();
    //   $(fixed_arr[1]).css("top",height_01);
    // }
    // $(".content-wrap").scroll(function(){
    //   var ul_top = $(".tab-ui2 ul").offset().top;
    //   if (ul_top <= 100) {
    //     $(".tab-ui2 ul").addClass("fixed");
    //   } else {
    //     $(".tab-ui2 ul").removeClass("fixed");
    //   }
      
    // })








    /* ==============================
    * 페이지 스크롤 고정 
    * ============================== */
  //   var con_s_top = 0; 
  //   $(".content-wrap").scroll(function(e){
  //   var s_top = $(e.target).scrollTop();
    
  //   if(con_s_top < s_top){ // 스크롤 내릴때
  //     //고정 해야 할 요소 (고정 되지 않은)
  //     var jElArr = $(e.target).find(".fixed-area:visible").not(".fixed");
  //     //대상 요소들중 기준점과 가장 가까운 요소
  //     var trgEl = fn_getTargetEl(jElArr,"d");
  //     //고정
  //     fn_fixedElement (trgEl);
  //   }else{ // 스크롤 올릴때
  //     //고정 해제 해야 할 요소 (고정 되어있는)
  //     var jElArr = $(e.target).find(".fixed-area.fixed:visible");
  //     //대상 요소들중 기준점과 가장 먼 요소
  //     var trgEl = fn_getTargetEl(jElArr,"u");
  //     //고정해제
  //     fn_unFixedElement (trgEl);
  //   }
  //   con_s_top = s_top;
  // })

}); //////////////////////////////////////////////////// $.function - end

/* ==============================
* 고정 및 고정 해제 할 대상요소 선택
* ============================== */
// function fn_getTargetEl(jElArr,flag){
//   // 고정 되는 모든 요소의 배열
//   var elArr = [];
//   // 비교값과 고정될요소, 
//   var compVal,target;
//   // jQuery Array => javascript Array 변환
//   $(jElArr).each(function(i,e){
//     elArr.push(e);
//   });
//   //고정 할 요소를 반복
//   for(var i = 0; i < elArr.length; i++) {
//     // compVal 값이 없는 경우 현재 배열값으로 지정(처음)
//     if (!compVal) {
//       compVal = $(elArr[i]).position().top;
//       target = elArr[i];
//     };
//     //스크롤을 내렸을 떄
//     if(flag == "d") {
//       // compVal의 값과 현재 값을 비교해서 compVal값을 가장 작은 값으로 유지
//       if (compVal > $(elArr[i]).position().top) {
//         compVal = $(elArr[i]).position().top;
//         target = elArr[i];
//       }
//       //스크롤을 올렸을 떄
//     } else if(flag == "u") {
//       // compVal의 값과 현재 값을 비교해서 compVal값을 가장 큰 값으로 유지
//       if (compVal < $(elArr[i]).position().top) {
//         compVal = $(elArr[i]).position().top;
//         target = elArr[i];
//       }
//     }
//   }
//   // 조건에 맞는 대상요소 반환
//   return target;

// }

// /* ==============================
// * 요소를 고정하는 함수
// * ============================== */
// function fn_fixedElement (target){
//   // 고정요소가 없을때 걍 함수 종료 
//   if(!target) return;
//   // 요소가 고정 될 기준 값
//   var addHeight = 0;
//   // 고정된요소의 높이 합 계산
//   $(".fixed").each(function(){
//     addHeight += $(this).height();
//   });
//   // 헤더 높이
//   var headerHeight = $("header").height();
//   // 고정할 요소의 상단의 위치가 기준위치보다 커질 떄
//   if ($(target).position().top < 0+addHeight) {
//     // 고정할 요소에 고정시키는 클레스 추가
//     $(target).addClass("fixed");
//     // 고정할 요소에 위치 지정
//     $(target).offset({top:addHeight+headerHeight});
//     // 변경 전 고정할 요소 다음 요소의 여백 저장
//     $(target).attr("bf-padding-top",$(target).next().css("padding-top"));
//     // 고정 됐을 때 고정요소의 높이만큼 다음요소에 여백적용
//     $(target).next().css("padding-top",$(target).height());
//   }
// }

// /* ==============================
// * 고정 해제하는 함수
// * ============================== */
// function fn_unFixedElement (target){
//   // 고정 해제 할 요소가 없을때 걍 함수 종료
//   if(!target) return;
//   // 고정 해제 할 기준 값
//   var addHeight = 0;
//   // 모든 고정 된 요소의 높이 계산
//   $(".fixed").each(function(){
//     addHeight += $(this).height();
//   });
//   // 고정 해제 할 기준의 고정 해제 할 요소의 높이값 
//   addHeight -= $(target).height(); 
//   // 고정 해제 할 요소에 다음 요소의 상단위치가 기준 위치 값보다 클때  
//   if ($(target).next().position().top > 0+addHeight) {
//     // 고정 클레스 제거
//     $(target).removeClass("fixed");
//     // 고정해제 할 요소에 다음 요소의 여백 복구
//     $(target).next().css("padding-top",$(target).attr("bf-padding-top"));
//   }
// }

/* ==============================
* 색상리스트
* ============================== */
const COLOR_ARR = ["#fb4357","#fcb4bb","#fed2d7","#4a90e2","#90a3ad","#bdc1c8","#cfd8dc"]

/* ==============================
* 베너 피커 좌우버튼 일, 월 증감 함수
* ============================== */
function changeDate(type, date) {
  var flag = date.length == 7;
  var r_date,r_dateStr;
  //데이트 형식으로 변환
  var d_date = new Date(date);
  // YMD 분리
  var y = d_date.getFullYear();
  var m = d_date.getMonth();
  var d = d_date.getDate();

  //월변경
  //빈 일자값 채우기
  flag ? date += "-01" : date;
  // M 값 증감
  if(flag) type == "add"? m ++ : m --;
  // d 값 증감
  else type == "add"? d ++ : d --;
  
  //리턴할 데이터 타입으로 변환
  var r_date = new Date(y,m,d);

  if(flag){
    if(fn_isOverDate(r_date.format("yyyy-MM"))) return;
    r_dateStr = r_date.format("yyyy-MM");
  }else{
    if(fn_isOverDate(r_date.format("yyyy-MM-dd"))) return;
    r_dateStr = r_date.format("yyyy-MM-dd");
  } 

  return r_dateStr;
}

/* ==============================
* 날짜 버튼 유무
* ============================== */
function fn_isOverDate (paramDate) {
  //일자 형식
  var flag = paramDate.length == 7;
  //기준일
  var flagDate , compVal1 , compVal2;
  //어제일자를 가져와야지
  if(flag) flagDate = fn_getFlagDate("m");
  else flagDate = fn_getFlagDate("d");
  //일자 > 숫자 변환
  compVal1 = Number(paramDate.replace(/-/gi,"")); 
  compVal2 = Number(flagDate.replace(/-/gi,""));  
  //비교후 SHOW/HIDE
  if(compVal1 >= compVal2) $(".picker-box .btn-next").css("visibility","hidden");
  else $(".picker-box .btn-next").css("visibility","inherit");
  //비교결과 리턴
  return compVal1 > compVal2 
}
/* ==============================
* 로딩바 show
* ============================== */
function showLoadingBar() { 
  var maskHeight = $(document).height(); 
  var maskWidth = window.document.body.clientWidth; 
  var mask = "<div class='page-mask'></div>"; 
  var loadingImg = ''; 
  loadingImg += "<div class='loading-img'>로딩이미지</div>";
  $('body').append(mask).append(loadingImg); 
  $('.page-mask').css({ 'width' : maskWidth , 'height': maskHeight , 'opacity' : '0.3', 'z-index' : '99999' }); 
  $('.page-mask').show(); 
  $('.loading-img').show(); 
  }

  /* ==============================
  * 로딩바 hide
  * ============================== */
  function hideLoadingBar() { 
  $('.page-mask, .loading-img').hide();
  $('.page-mask, .loading-img').remove(); 
  }

/* ==============================
* 어제날짜함수(디폴트)
* ============================== */
function fn_getFlagDate(type){
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth();
  var d = date.getDate() - 1;
  var defaultDate;
  if (type == "d") defaultDate = new Date(y,m,d).format("yyyy-MM-dd");
  else defaultDate = new Date(y,m).format("yyyy-MM");

  return defaultDate;
}

/* ==============================
* 레이어팝업 함수
* ============================== */
function layer_popup(el){
	var $el = $(el);
//	if($(".pop-dimed").is(":visible")){};
//	var isDim = $el.prev().hasClass('pop-dimed');
//	isDim ? $('.pop-house').fadeIn() : $el.fadeIn();
	$('.pop-dimed').fadeIn();
	$el.fadeIn();

	var $elWidth = ~~($el.outerWidth()),
		$elHeight = ~~($el.outerHeight()),
		docWidth = $(document).width(),
		docHeight = $(document).height();
  
  // 팝업 위치
	if ($elHeight < docHeight || $elWidth < docWidth) {
		$el.css({
			marginTop: -$elHeight /2
		})
	} else {
		$el.css({top: 0, left: 0});
	}
  
  //  테이블 스크롤 헤더 고정
  // var pop_thead_height = $el.find(".tbl-popfix-thead").height();
  // var tbl_width = $el.find(".tbl-popfix-tbody").width();
  // var popconTop = $el.find(".pop-container").offset().top;
  // var popconLeft = $el.find(".pop-container").offset().left;
  // $el.find(".tbl-popfix-thead").attr("style","width:"+ tbl_width + "px !important");
  // $el.find(".tbl-popfix-thead").offset({ top:popconTop,left:popconLeft});
  // $el.find(".tbl-popfix-tbody").css("margin-top",pop_thead_height);

  // 팝업 닫기 (취소버튼)
	$el.find('a.popClose').click(function(){
    isDim ? $('.pop-house').fadeOut() : $el.fadeOut();
		$('.pop-dimed').fadeOut();
		return false;
	});
	
  // 팝업 닫기 (딤)
	$('.pop-dimed').click(function(){
    // isDim ? $('.pop-house').fadeOut() : $el.fadeOut();
    $el.fadeOut();
    $('.back').fadeOut();
    $(this).fadeOut();

    // 디폴트 이벤트 바인딩
    $(this).bind("click",function(){
      $(".more-box").removeClass('on');
      $(".more").removeClass('on');
      $(this).fadeOut();
    });

		return false;
	});
}
// 딤 클릭 디폴트 이벤트
$(document).on('click','.pop-dimed',function(){
  $(".more-box").removeClass('on');
  $(".more").removeClass('on');
  $(this).fadeOut();
});

/* ==============================
* anypicker 함수 (년월일)
* ============================== */
$.fn.dateAnyPicker = function(option){
  var maxDate,minDate ;
  var el = $(this);
  if(!option.maxDate) maxDate = false;
  else maxDate = new Date(option.maxDate[0],option.maxDate[1]);
  if(!option.minDate) minDate = false;
  else minDate = new Date(option.minDate[0],option.minDate[1]);
  $(this).AnyPicker({
    mode: "datetime",
    dateTimeFormat: option.format,
    minValue: minDate,
    maxValue: maxDate,
    buttonClicked : function() {
      // $("section").removeClass('dim-on');
    },
    parseInput:function(sElemValue) {
      // $("section").addClass('dim-on');
      return sElemValue;
    },
    setOutput: function(dateTxt){
      el.val(dateTxt);
      if(option.onChange) option.onChange(dateTxt);
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
* 데이트피커 (개발)
* ============================== */
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
Date.prototype.format = function(f) {
if (!this.valueOf()) return " ";

var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
var weekNameShort = ["일", "월", "화", "수", "목", "금", "토"];
var weekNameEng = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
var d = this;

return f.replace(/(yyyy|yy|MM|dd|EE|E|e|hh|mm|ss|a\/p)/gi, function($1) {
    switch ($1) {
        case "yyyy": return d.getFullYear();
        case "yy": return (d.getFullYear() % 1000).zf(2);
        case "MM": return (d.getMonth() + 1).zf(2);
        case "dd": return d.getDate().zf(2);
        case "E": return weekNameShort[d.getDay()];
        case "EE": return weekName[d.getDay()];
        case "e": return weekNameEng[d.getDay()];
        case "HH": return d.getHours().zf(2);
        case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
        case "mm": return d.getMinutes().zf(2);
        case "ss": return d.getSeconds().zf(2);
        case "a/p": return d.getHours() < 12 ? "오전" : "오후";
        default: return $1;
    }
});

};

//DATEPICKER
function gfn_setDatepicker(el){
//초기설정시 el의 상위에 버튼이 있다면
  if($(el).parents("button").length > 0){
    $(el).parents("button").on("click",function(){
      if($(this).prop("disable")) return false;
      fn_initDatepicker(el);
    });
  }else{
    $(el).on("click",function(){
      fn_initDatepicker(el);
    });
  }
}

//datepicker 닫기
function fn_datepickerCls(){
  $("#p_datepicker").fadeOut();
  $('.pop-dimed').fadeOut();
}

function fn_initDatepicker(el){
  if(!$(el).val()) $(el).val(gfn_getToDay("-"));
  $('#datepicker').datepicker("destroy");
  $('#datepicker').datepicker({
    inline: true,
    dateFormat: "yy-mm-dd",
    defaultDate: $(el).val() ,
    showOtherMonths: false,//빈 공간에 현재월의 앞뒤월의 날짜를 표시
    showMonthAfterYear: true,//년도 먼저 나오고, 뒤에 월 표시
    changeYear: false, //콤보박스에서 년 선택 가능
    changeMonth: false, //콤보박스에서 월 선택 가능
    monthNamesShort: ['01','02','03','04','05','06','07','08','09','10','11','12'], //달력의 월 부분 텍스트
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    maxDate: "-1d",
    onSelect: function (dateText, inst) {
      $(el).val(dateText);
      $(el).trigger("change");
      $("#p_datepicker").fadeOut();
      $('.pop-dimed').fadeOut();
      fn_isOverDate (dateText);
    }
  });
  layer_popup($('#p_datepicker'));
}

function gfn_getToDay(sep){
  var a = new Date();
  var y,m,d;
  y= a.getFullYear();
  m= a.getMonth();
  d= a.getDate();
  return y+sep+m+sep+d;
}
