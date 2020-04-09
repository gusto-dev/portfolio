const context = ($("#context").val() == undefined || $("#context").val() == "undefined") ? "" :  $("#context").val();
am4core.options.commercialLicense = true;

$(function(){
	
});


var osVersion = localStorage.getItem("osVersion");

/*************************************************************************
* 천(3자리마다)단위 콤마
 * @param  num 숫자
 *
 * ex) gfn_numberFormat(1000); -> 1,000
************************************************************************/
function gfn_numberFormat(num) {
	var rtnNum = '';
	if (num != null && num != "") {
		rtnNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else if(num == 0){
		rtnNum = num +"";
	}

    return rtnNum;
}

/*************************************************************************
 * [ FUNCTION INFO ]
 * NAME  : gfn_tabSwith
 *
 * DESC  : 탭 변경 클래스 추가 및 데이터 영역 숨김표시 기능
 *         데이터 영역에 데이터가 없을시 콜백을 통해 데이터 조회
 *
 * @param : el - 클릭한 탭의 Element
 *         callback - 해당 탭 하위 데이터를 조회 하는 함수
 *
 * EXAM  :
 * $('#test').on('click',function(evnt){
 * 	gfn_tabSwith(evnt.target,function(tabInfo){
 * 		if(tabInfo == "1"){
 * 			fn_getRecode();
 * 		}else{
 * 			fn_getOtherRecode();
 * 		};
 * 	});
 * });
 ************************************************************************/
function gfn_tabSwith(el,callback){
	//active 효과
	$(el).siblings().removeClass("active");
	$(el).addClass("active");
	
	//데이터 영역
	var activeAreaId = $(el).attr("data-area");
	
	//데이터 유무
	var dataFlag = $(el).attr("data-flag");
	if(!dataFlag) callback(activeAreaId);
	
	//탭영역 SHOW,HIDE
	$(el).siblings().each(function(idx,item){
		$($(item).attr("data-area")).hide();
	});
	
	$(el).attr("data-flag",1);
	$(activeAreaId).show();
}

/*************************************************************************
 * [ FUNCTION INFO ]
 * NAME  : transaction
 *
 * DESC  : 탭 변경 클래스 추가 및 데이터ㅋ 영역 숨김표시 기능
 *         데이터 영역에 데이터가 없을시 콜백을 통해 데이터 조회
 *
 * PARAM : el - 클릭한 탭의 Element
 *         callback - 해당 탭 하위 데이터를 조회 하는 함수
 *
 * EXAM  :
 * $('#test').on('click',function(evnt){
 * 	gfn_tabSwith(evnt.target,function(tabInfo){
 * 		if(tabInfo == "1"){
 * 			fn_getRecode();
 * 		}else{
 * 			fn_getOtherRecode();
 * 		};
 * 	});
 * });
 ************************************************************************/
function transaction(option,callback){
	var url    = option.url;
	var params = option.params;
	var asyncFlag = option.asyncFlag;
	$.ajax({
		 type : "POST"
		,url  : url
		,data : params
		,async: asyncFlag != null ? asyncFlag : true
		,success : function(result) {
			if(result.mobile_return_code == "E999"){
				sessionStorage.clear();
				location.replace("/login.do");
				return false;
			}else{
				if(result.mobile_return_code != "S000"){
					callback(null,result);
				}else{
					callback(result,null);
				}
			}
		}
		, error : function(e) {
			location.replace("/error500.html");
			return false;
		}
		,beforeSend:function(){
			if(option.beforeSend) option.beforeSend();
			else showLoadingBar();
			if(option.beforeSend) option.beforeSend();
			else showLoadingBar();
		}
		,complete:function(){
			if(option.complete) option.complete();
			else hideLoadingBar();
		}
	});
}

$.ajaxSetup({
	type : "POST"
	,error : function(e) {
		gfn_showMessage("MSG_COM_ERR_001");
		return false;
	}
});

//데이터 바인드 (명명규칙 필수)
function gfn_dataBind(data,attr,perfix,isHtml){
	if(!perfix) perfix = "";
	
	var selEl
	for(var key in data){
		if(attr == "name"){
			selEl = $("[name="+perfix+key+"]");
		}else{
			selEl = $("#"+perfix+key);
		}
		var nodeNm = selEl.prop('nodeName');

		if(nodeNm){
			if(nodeNm == "INPUT") selEl.val(data[key]);
			else{
				if(isHtml) selEl.html(data[key]);
				else selEl.text(data[key]);
			}
		}
	}
}

//URL형식으로 전달한 파라미터 받아오기
function gfn_getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

//XY 차트 생성 공통함수
function gfn_mkXYChart(data,option){

if(option.isWide){
  chartDiv = document.getElementById(option.chartDivId);
  chartDiv.style.cssText = "width:"+ (data.length * 50) + "px";
}else if(option.isLong){
  chartDiv = document.getElementById(option.chartDivId);
  chartDiv.style.cssText = "height:"+ (data.length * 30) + "px";
}

//카테고리 컬럼 키
var category = option.categoryName;

//차트 생성
var chart = am4core.create(option.chartDivId , am4charts.XYChart);
chart.hiddenState.properties.opacity = 0 // this creates initial fade-in
chart.data = data;

option.pivot ? chart.paddingleft  = 0 : 0;
option.pivot ? chart.paddingRight = 0 : 0;

chart.align = "center";
chart.valign = "middle";
chart.paddingBottom = 0;
chart.paddingTop = 0;
chart.numberFormatter.numberFormat = "#,###";
// 컬럼 축
var categoryAxis = option.pivot ? chart.yAxes.push(new am4charts.CategoryAxis()) : chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.grid.template.opacity = 0;
categoryAxis.dataFields.category = category;
categoryAxis.dataFields.subData = option.subDataKey;
categoryAxis.renderer.line.strokeOpacity = 0.3;
categoryAxis.renderer.labels.template.fill = COLOR_ARR[4];

categoryAxis.truncate = true;

option.pivot ? categoryAxis.renderer.labels.template.paddingLeft = 0 : 0;
option.pivot ? categoryAxis.renderer.labels.template.paddingRight = 5 : 0;

if(option.categoryLabelTxt){
	if (option.displayOnlyDy == '1') {
		  categoryAxis.renderer.labels.template.html = "<strong>{selBasDy}</strong>"; //10/23
		  categoryAxis.renderer.labels.template.events.on("ready", function(a) {
			// a.target.html+="<p>{selBasDy}</p>"; //
	    });
	} else {
		  categoryAxis.renderer.labels.template.html = "<strong>{category}</strong>"; //개봉일 / 1일
		  categoryAxis.renderer.labels.template.events.on("ready", function(a) {
			  a.target.html+="<p>{selBasDy}</p>"; // 10/12
	    });
	}
}

if(option.onclick){
	categoryAxis.renderer.labels.template.events.on("hit", function(ev) {
		option.onclick(ev.target);
	});
}

//카테고리 간격
categoryAxis.renderer.minGridDistance = 1;
categoryAxis.fontSize = 11;
categoryAxis.cursorTooltipEnabled = false;

//데이터 순서
 categoryAxis.renderer.inversed = option.inversed;
// categoryAxis.renderer.ticks.template.length = 1;
 categoryAxis.renderer.ticks.template.disabled = false;
 categoryAxis.renderer.ticks.template.strokeOpacity = 0;

//값 축
var valueAxis = option.pivot ? chart.xAxes.push(new am4charts.ValueAxis()) : chart.yAxes.push(new am4charts.ValueAxis());
 valueAxis.min = option.min ? option.min : 0;
 if(option.max) valueAxis.max = option.max;
 if(option.max) valueAxis.strictMinMax = true;
// valueAxis.renderer.minGridDistance = 30;

valueAxis.hidden = option.valAxisHidden ? option.valAxisHidden : true;
valueAxis.cursorTooltipEnabled = false;
if(option.pivot){
  valueAxis.height = option.height? option.valAxisheight : 0;
}else{
  valueAxis.width = option.valAxisWidht? option.valAxisWidht : 0;
}

if(option.valBreakStart){
  // 브레이크 옵션
  var axisBreak = valueAxis.axisBreaks.create();
  axisBreak.startValue = option.valBreakStart;
  axisBreak.endValue = option.valBreakEnd;
  axisBreak.breakSize = 0.08;
  // axisBreak.defaultState.transitionDuration = 1000;

  // 브레이크 호버 옵션
  var hoverState = axisBreak.states.create("hover");
  hoverState.properties.breakSize = 1;
  hoverState.properties.opacity = 0.1;
  hoverState.transitionDuration = 100;
  
}

//차트 그래프 옵션
for(var i in option.series){
  var series = null
  if(option.series[i].type == "col"){ // 막대차트
    series = chart.series.push(new am4charts.ColumnSeries())
    //그래프 겹치기 옵션
    if(option.series[i].clusteredYn) series.clustered = false;
    
    //막대그래프 넓이 조절
    if(option.pivot){
    	if(option.series[i].height) series.columns.template.height = am4core.percent(option.series[i].height);
//        else series.columns.template.height = am4core.percent(50);
    }else{
    	if(option.series[i].width) series.columns.template.width = am4core.percent(option.series[i].width);
        else series.columns.template.width = am4core.percent(30);
    }
    
    //그래프 패딩
    if(option.series[i].padding) series.columns.template.paddingLeft = option.series[i].padding;
    
    //그래프 색상
    if(option.pointColor) series.columns.template.propertyFields.fill = "pointColor";
    else series.columns.template.propertyFields.fill = "color";
    series.columns.template.fill = am4core.color(option.series[i].color);
    series.columns.template.strokeOpacity = 0;

    //그래프 명
    series.name = option.series[i].name;
    
    //막대그래프 라벨 설정
    if(option.label){
      var label = series.columns.template.createChild(am4core.Label);
      label.text = option.series[i].labelText;
      if(option.labelX) label.dx = option.labelX;
      
      if(option.labelPosition == "top"){
    	  label.position = "top";
          label.textAlign = "center";
          label.align = "center";
          label.dy = -15;
          label.dx = -2;
      }else{
    	  label.align = "right";
    	  label.valign = "middle";
      }
      
      label.fill = am4core.color(option.series[i].labelColor);
      if(option.labelReady){
    	  label.events.on("ready", function(e) {
    		  option.labelReady(e);
    	  });
      }
      
      label.strokeWidth = 0;
    }

    //막대그래프 이벤트 바인딩
    if(option.onclick){
      series.columns.template.events.on("hit", function(ev) {
        option.onclick(ev.target);
      }, this);
    }

    //막대그래프 그래프 외부 라벨
    if(option.series[i].outLabelKey){
      series.dataFields.outVal = option.series[i].outLabelKey;
      
      var bullet = series.bullets.push(new am4charts.LabelBullet());
      series.bulletsContainer.parent = chart.seriesContainer;
      
      bullet.interactionsEnabled = false;
      bullet.label.align = "left";
      bullet.label.valign = "middle";
      //라벨 텍스트
      bullet.label.text = option.series[i].outLabelText;
      option.pivot ? bullet.label.dx = 30 : bullet.label.dy = +10;
      //라벨 위치
      // if(option.pivot) bullet.locationX = 0.5;
      // else bullet.locationY = 0.5;
      
      //라벨 색상
      bullet.label.fill = am4core.color("#000");
      
      bullet.label.events.on("ready", function(a) {
      	var outLabelData = a.target.dataItem.dataContext[option.series[i].outLabelKey];
      	if(outLabelData){
      		var html = a.target.text;
      		if(outLabelData < 0){
      			a.target.html = "<span class='fall'>"+html+"<span>";
      		}else{
      			a.target.html = "<span class='gain'>"+html+"<span>";
      		}
      	}else{
      		a.target.text = "";
      	}
      });
    }
    
  }else if(option.series[i].type == "line"){ // 선차트
    series = chart.series.push(new am4charts.LineSeries());
    series.bulletsContainer.parent = chart.seriesContainer;
    //그래프 색상
    series.fill = am4core.color(option.series[i].color);
    //그래프 명
    series.name = option.series[i].name;
    
//    series.zIndex = 100;
    
    if(option.series[i].isBullet){
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      //점 색상
      bullet.circle.fill = am4core.color(option.series[i].color);
      //점 테두리 색상
      bullet.stroke = am4core.color(option.series[i].color);
    }
    
    if(option.series[i].tensionX){
      series.tensionX = option.series[i].tensionX
    }

    if(option.series[i].dash){
      series.strokeDasharray = option.series[i].dash;
    }

    series.strokeWidth = 2;
    series.strokeOpacity = 1;
    //그래프 선 색상
    series.stroke = am4core.color(option.series[i].color);
  }

  //툴팁 설정
  if(option.pivot){
    series.dataFields.categoryY = category;
    series.dataFields.valueX = option.series[i].valueKey;
    if(!option.series[i].tooltipText) series.tooltipText = "{valueX.value}";
    else series.tooltipText = option.series[i].tooltipText;
  }else{
    series.dataFields.categoryX = category;
    series.dataFields.valueY = option.series[i].valueKey;
//    series.tooltipText = option.series[i].valueKey+ " : {valueY.value}"
//    series.tooltipText = "{valueY.value}";
    if(!option.series[i].tooltipText) series.tooltipText = "{valueY.value}";
    else series.tooltipText = option.series[i].tooltipText;
  }
  
  //2번째 축 설정
  if(option.series[i].valueAxisType){
  	if(option.series[i].valueAxisType == 2){
  		var valueAxis2 = option.pivot ? chart.xAxes.push(new am4charts.ValueAxis()) : chart.yAxes.push(new am4charts.ValueAxis());
  		
  		valueAxis2.min = 0;
  		valueAxis2.width = 0;
  		valueAxis2.cursorTooltipEnabled = false;
  		valueAxis2.renderer.labels.template.fontSize = 0;
  		valueAxis2.hidden = option.valAxisHidden ? option.valAxisHidden : true;
  		if(option.pivot){
  			valueAxis2.height = option.height? option.valAxisheight : 0;
  		}else{
  			valueAxis2.width = option.valAxisWidht? option.valAxisWidht : 0;
  		}
  		
  		if(option.guideLine){
  			valueAxis2.hidden = false;
  			valueAxis2.renderer.minGridDistance = 100;
  			valueAxis2.renderer.grid.template.opacity = 0;
  			
  			var range = valueAxis2.axisRanges.create();
  			range.value = 100;
  			range.grid.opacity = 1;
  			range.grid.stroke = am4core.color(COLOR_ARR[4]);
  			range.grid.strokeDasharray = 4;
  			range.grid.strokeWidth = 0.5;
  			range.grid.strokeOpacity = 1;
  		}
  		
  		series.yAxis = valueAxis2;
  	}
  }
//  if(option.alwaysTooltip){
//	  series.alwaysShowTooltip = true;
//  }
  series.dataFields.subData = option.series[i].subDataKey;
}

//커서 옵션
if(option.cursor){
  // 커서옵션
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.lineY.disabled = true;
  chart.cursor.lineX.disabled = true;
  chart.cursor.behavior = "none";
//  chart.cursor.snapToSeries = series;
  
  if(option.cursorFocus){
	  chart.cursor.lineX.strokeDasharray = 0;
	  chart.cursor.lineX.disabled = false;
	  console.log("chart.cursor.lineXs",chart.cursor.lineX)
	  if(option.cursorLine){
		  chart.cursor.lineX.stroke = am4core.color(COLOR_ARR[0]);
	  }else{
		  chart.cursor.lineX.opacity = 0;
	  }
//	  chart.cursor.lineX.fill = am4core.color(COLOR_ARR[0]);
	  
	  series.events.on("ready", function(ev) {
		setTimeout(function() {
				var point = categoryAxis.categoryToPoint(option.cursorFocus);
				chart.cursor.triggerMove(point, "none");
				var add = $(".scroll_chart").width()/2 -20;
				$(".scroll_chart").scrollLeft(chart.cursor.lineX.x-add);
			}, series.defaultState.transitionDuration + 100);
		});
  }
  chart.cursor.events.on("cursorpositionchanged", function(ev) {
	  chart.cursor.triggerMove(ev.target.point, "soft");
  });
}


//범례
if(option.legendDivId){
  //범례영역
  var legendContainer = am4core.create(option.legendDivId, am4core.Container);
  legendContainer.width = am4core.percent(100);
  legendContainer.height = am4core.percent(100);
  
  //범례 생성
  chart.legend = new am4charts.Legend();
  chart.legend.parent = legendContainer;
  //chart.legend.position = "top"
  chart.legend.contentAlign = option.contentAlign;
  chart.legend.parent.contentValign = "middle";

  //범례 마커 사이즈
  chart.legend.markers.template.width = 10;
  chart.legend.markers.template.height = 10;
  chart.legend.fontSize = 12;
  chart.legend.valign = "middle";
  chart.legend.align = "center";
}

if(option.pivot){
	chart.paddingTop = 10;
	chart.paddingBottom = 10;
}

return chart
}

//파이차트 생성
function gfn_mkPieChart(data,option){
var chart = am4core.create(option.chartDivId, am4charts.PieChart);
chart.numberFormatter.numberFormat = "#,###."
//chart.tapToActivate = true;

//데이터 바인드
chart.data = data;

// 각 조각에대한 프로퍼티 설정
var pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.category = option.categoryName;
pieSeries.dataFields.value = option.valueName;
pieSeries.slices.template.propertyFields.fill = "color";
chart.innerRadius = am4core.percent(option.radius);

if(option.innerLabelTxt){
  //원형 차트 내부 라벨링
  var label = chart.seriesContainer.createChild(am4core.Label);
  // label.html = option.text + "\n계획비"
  label.text = option.innerLabelTxt;
  label.horizontalCenter = "middle";
  label.verticalCenter = "middle";
  label.fontSize = option.innerLabelFontSize ? option.innerLabelFontSize : 15;
}

if(option.labelText){
  pieSeries.alignLabels = false;
  // pieSeries.labels.template.bent = true;
  pieSeries.labels.template.radius = -23;
  pieSeries.labels.template.text = option.labelText;
  pieSeries.labels.template.textAlign = "middle";
  pieSeries.labels.template.fontSize = option.fontSize ? option.fontSize : 10
  // pieSeries.labels.template.propertyFields.fill = "label-color";


  // "{category}\n{value.value}\n{value.percent}\n "
  pieSeries.labels.template.disabled = false;
  
  pieSeries.labels.template.events.on("ready", function(event) {
		if(event.target.dataItem.dataContext.labelColor == "white"){
			event.target.fill  = am4core.color("#fff");
		}else{
			event.target.fill  = am4core.color("#000");
		}
	});
}else{
  pieSeries.labels.template.disabled = true;
}

// Put a thick white border around each Slice
// pieSeries.slices.template.stroke = am4core.color("#fff");
// pieSeries.slices.template.strokeWidth = 2;
// pieSeries.slices.template.strokeOpacity = 1;
// pieSeries.slices.template
//   // change the cursor on hover to make it apparent the object can be interacted with
//   .cursorOverStyle = [
//     {
//       "property": "cursor",
//       "value": "pointer"
//     }
//   ];

//눈금 비활성화
pieSeries.ticks.template.disabled = true;
//클릭 비활성화
pieSeries.slices.template.clickable = false;
//호버 액티브  모양변화 비활성화
var hs = pieSeries.slices.template.states.getKey("hover");
hs.properties.scale = 1;
var as = pieSeries.slices.template.states.getKey("active");
as.properties.shiftRadius = 0.1;

// ds.properties.clickable = false;
// ds.properties.shiftRadius = 1;

// var cs = pieSeries.slices.template.states.create("hover");
// var cs2 = pieSeries.slices.template.states.create("active");
// cs.properties.scale = 1;
//툴팁 비활성화
// pieSeries.slices.template.tooltipText = "";

// pieSeries.labels.text = '';
// pieSeries.labels.template.hidden = true;
// pieSeries.labels.template.width = 0;
// pieSeries.labels.template.height = 0;
// pieSeries.ticks.template.disabled = true;
// pieSeries.alignLabels = false;

/* pieSeries.alignLabels = false;
pieSeries.labels.template.bent = true;
pieSeries.labels.template.radius = 3;
pieSeries.labels.template.padding(0,0,0,0);
pieSeries.ticks.template.disabled = true; */

// Create a base filter effect (as if it's not there) for the hover to return to
// var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
// shadow.opacity = 0;

// Create hover state
// var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

// Slightly shift the shadow and make it more prominent on hover
// var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
// hoverShadow.opacity = 0.7;
// hoverShadow.blur = 5;

// Add a legend
if(option.legendDivId){
  var legendContainer = am4core.create(option.legendDivId, am4core.Container);
  legendContainer.width = am4core.percent(100);
  legendContainer.height = am4core.percent(100);
  chart.legend = new am4charts.Legend();
  chart.legend.parent = legendContainer;
  chart.legend.contentAlign = "center";
}
return chart;
}

//레이더 차트 생성 (도넛형태)
function gfn_mkRadarChart(data,option){
// Create chart instance
var chart = am4core.create(option.chartDivId, am4charts.RadarChart);
chart.align = "center";
chart.valign = "middle";
 chart.paddingBottom = 0;
 chart.paddingTop = 0;
 chart.paddingLeft = 0;
 chart.paddingRight = 0;
 
 chart.marginBottom = 0;
 chart.marginTop = 0;
 chart.marginLeft = 0;
 chart.marginRight = 0;
 
// Add data
chart.data = data;

// 시작, 종료 각도
chart.startAngle = -90;
chart.endAngle = 180;

// 차트 내 숫자 형식
chart.numberFormatter.numberFormat = "#.#'%'";

// 컬럼축
var categoryName = option.categoryName;
var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = categoryName;
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.grid.template.strokeOpacity = 0;
categoryAxis.dx = 5;

categoryAxis.renderer.labels.template.horizontalCenter = "right";
categoryAxis.renderer.labels.template.fontWeight = 1000;
categoryAxis.renderer.labels.template.fontSize = 13;
categoryAxis.renderer.labels.template.fill = am4core.color("#000");
categoryAxis.renderer.labels.template.fillOpacity = 0.5;
categoryAxis.renderer.minGridDistance = 3;

option.scale ? categoryAxis.scale = option.scale : categoryAxis.scale;

//값 축
var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.grid.template.strokeOpacity = 0;
valueAxis.renderer.labels.location = -19
valueAxis.renderer.relativeX = 10;
valueAxis.renderer.labels.template.radius = -10;
valueAxis.strictMinMax = true;
valueAxis.renderer.labels.template.fontSize = 8;
valueAxis.renderer.labels.template.fillOpacity = 0;
valueAxis.renderer.minGridDistance = 60;
valueAxis.min = 0;
if(option.max) valueAxis.max = option.max;

//그래프 (최대값)
var maxGrpName = option.maxGrpName;
var series1 = chart.series.push(new am4charts.RadarColumnSeries());
series1.dataFields.valueX = maxGrpName;
series1.dataFields.categoryY = categoryName;
series1.clustered = false;
series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
series1.columns.template.fillOpacity = 0.09;
series1.columns.template.cornerRadiusTopLeft = 40;
series1.columns.template.width = am4core.percent(30);
series1.columns.template.strokeWidth = 0;
series1.columns.template.radarColumn.cornerRadius = 20;

//그래프 (비교값)
var compGrpName = option.compGrpName;
var series2 = chart.series.push(new am4charts.RadarColumnSeries());
series2.columns.template.width = am4core.percent(30);
series2.dataFields.valueX = compGrpName;
series2.dataFields.categoryY = categoryName;
series2.clustered = false;
series2.columns.template.strokeWidth = 0;
series2.columns.template.tooltipText = option.tooltipText;
// series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
series2.columns.template.radarColumn.cornerRadius = 20;
series2.columns.template.fill = am4core.color(option.color);

// Add cursor
// chart.cursor = new am4charts.RadarCursor();

option.scale ? series1.scale = option.scale : series1.scale;
option.scale ? series2.scale = option.scale : series2.scale;

//차트 내부 라벨
if(option.innerLabelText){
	//원형 차트 내부 라벨링
	var label = chart.seriesContainer.createChild(am4core.Label);
	// label.html = option.text + "\n계획비"
	label.text = option.innerLabelText;
	label.fontWeight = 1000;
	label.fill = am4core.color(COLOR_ARR[0]);
	label.horizontalCenter = "middle";
	label.verticalCenter = "middle";
	label.fontSize = option.innerLabelFontSize ? option.innerLabelFontSize : 15;
}

// 추가라벨
if(option.freeLabel){
  var freeLabel = chart.chartContainer.createChild(am4core.Label);
  freeLabel.html = "<p class='total-txt mgt0'><strong>" + option.freeLabel.text + "</strong>명</p>";
  freeLabel.align = "center";
  freeLabel.position = "bottom";
  freeLabel.dy = -25;
}

// chart.legend = new am4charts.Legend();

return chart;
}


function gfn_mkXYChartForPer(data,option){
//Themes begin
//am4core.useTheme(am4themes_animated);
//Themes end

var chart = am4core.create(option.chartDivId, am4charts.XYChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

//데이터 바인드
chart.data = data;

//범례설정
if(option.legendDivId){
//범례영역
var legendContainer = am4core.create(option.legendDivId, am4core.Container);
legendContainer.width = am4core.percent(100);
legendContainer.height = am4core.percent(100);
//범례 생성
chart.legend = new am4charts.Legend();
//범례 라벨
chart.legend.labels.template.text = "{name}";
// chart.legend.valueLabels.template.text = "{valueX.close}";

//범례 정렬
chart.legend.contentAlign = "center"
//범례 마커 사이즈
//chart.legend.itemContainers.template.paddingTop = 40;
chart.legend.valueLabels.template.layout = "bottom"
chart.legend.markers.template.width = 11;
chart.legend.markers.template.height = 11;

chart.legend.fontSize = 13;
chart.legend.valign = "middle";
chart.legend.parent = legendContainer;
}

//컬럼축 설정
var category = option.categoryName;
var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = category;
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.grid.template.strokeOpacity = 0;
categoryAxis.hidden = true;
categoryAxis.width = 0;

//값축 설정
var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.grid.template.location = 0;
valueAxis.renderer.grid.template.strokeOpacity = 0;
valueAxis.min = 0;
valueAxis.max = 100;
valueAxis.strictMinMax = true;
valueAxis.calculateTotals = true;
valueAxis.renderer.minWidth = 50;
valueAxis.hidden = true;
valueAxis.height = 0;

//그래프 설정
for(var i in option.series){
var series = chart.series.push(new am4charts.ColumnSeries());
//series.columns.template.height = am4core.percent(60);
//툴팁 텍스트
series.columns.template.tooltipText ="";
//"{name} \n {valueX.value} \n {valueX.totalPercent.formatNumber('#.0')}%";
series.name = option.series[i].name;
series.dataFields.categoryY = category;
series.dataFields.valueX = option.series[i].valueKey;
series.dataFields.valueXShow = "totalPercent";
series.dataItems.template.locations.categoryX = 0.5;
series.stacked = true;
series.tooltip.pointerOrientation = "vertical";
series.columns.template.paddingTop = 13;
//컬럼색상
series.columns.template.fill = am4core.color(option.series[i].color);
//컬럼 테두리색상
series.stroke = am4core.color(option.series[i].color);


//라벨
var label = series.columns.template.createChild(am4core.Label);
label.text = "[bold]{valueX.totalPercent.formatNumber('#.0')}%";
label.align = "center";
label.valign = "middle";
label.dy = -20;
label.zIndex = 2;
label.fill = am4core.color(option.series[i].color);
label.strokeWidth = 0;

// var bullet = series.bullets.push(new am4charts.LabelBullet());
// bullet.interactionsEnabled = false;
// bullet.label.text = "{valueX.totalPercent.formatNumber('#.0')}%";


//라벨 색상
// bullet.label.dx = -20;
// bullet.label.dy = -15;
// bullet.label.horizontalCenter = "middle";
// bullet.label.verticalCenter = "middle";
// bullet.label.valign = "center";
// bullet.label.contentAlign = "center";
// bullet.label.hideOversized = false;
// bullet.label.truncate = false;
// bullet.label.fill = am4core.color(option.series[i].color);
}
return chart;
}

//파이오브파이차트 생성
function gfn_mkPieOfPieChart(data,option){

	var container = am4core.create(option.chartDivId , am4core.Container);
	container.width = am4core.percent(100);
	container.height = am4core.percent(100);
	container.layout = "horizontal";
	container.dx = -10;
	
	// Create chart instance
	var chart = container.createChild(am4charts.PieChart);
	chart.width = am4core.percent(100);
	chart.radius = am4core.percent(90);
	chart.numberFormatter.numberFormat = "#."
	chart.tapToActivate = true;
	chart.innerRadius = am4core.percent(option.radius);

	// 각 조각에대한 프로퍼티 설정
	var pieSeries = chart.series.push(new am4charts.PieSeries());
	pieSeries.dataFields.category = option.categoryName;
	pieSeries.dataFields.value = option.valueName;
	pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
	pieSeries.slices.template.propertyFields.fill = "color";

	var chart2 = container.createChild(am4charts.PieChart);
	chart2.width = am4core.percent(50);
	chart2.radius = am4core.percent(80);
	chart2.numberFormatter.numberFormat = "#.#"
	chart2.tapToActivate = true;
	chart2.innerRadius = am4core.percent(option.radius);
//	chart2.verticalCenter = "center";
		
	var pieSeries2 = chart2.series.push(new am4charts.PieSeries());
	pieSeries2.dataFields.category = "s_name";
	pieSeries2.dataFields.value = "s_value";
	pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
	pieSeries2.labels.template.disabled = true;
	pieSeries2.ticks.template.disabled = true;
	pieSeries2.alignLabels = false;
	//pieSeries2.events.on("positionchanged", updateLines);
		
	if(option.innerLabelText){
		//원형 차트 내부 라벨링
		var label = chart.seriesContainer.createChild(am4core.Label);
		// label.html = option.text + "\n계획비"
		label.text = option.innerLabelText;
		label.horizontalCenter = "middle";
		label.verticalCenter = "middle";
		label.fontSize = option.innerLabelFontSize ? option.innerLabelFontSize : 15;
	}
	
	if(option.labelText1){
		pieSeries.alignLabels = false;
		// pieSeries.labels.template.bent = true;
		pieSeries.labels.template.radius = -25;
		pieSeries.labels.template.text = option.labelText1;
		pieSeries.labels.template.textAlign = "middle";
		pieSeries.labels.template.fontSize = option.fontSize ? option.fontSize : 10
		pieSeries.labels.template.disabled = false;
		
		pieSeries.labels.template.events.on("ready", function(event) {
			//TODO 추후 수정
			if(event.target.dataItem.dataContext.sub == "CGV"){
				event.target.text += "\n{value.percent}%";
//				event.target.currentText = ""
			}
			event.target.fill  = am4core.color("#fff");
		});
	}else{
		pieSeries.labels.template.disabled = true;
	}
	
	if(option.labelText2){
		pieSeries2.alignLabels = false;
		// pieSeries2.labels.template.bent = true;
		pieSeries2.labels.template.radius = -15;
		pieSeries2.labels.template.text = option.labelText2;
		pieSeries2.labels.template.textAlign = "middle";
		pieSeries2.labels.template.fontSize = option.fontSize ? option.fontSize : 10
		// pieSeries2.labels.template.propertyFields.fill = "label-color";
		pieSeries2.labels.template.disabled = false;
		
		pieSeries2.labels.template.events.on("ready", function(event) {
			if(event.target.dataItem.dataContext.s_name == "직영"){
				event.target.fill  = am4core.color("#fff");
			}else{
				event.target.fill  = am4core.color("#000");
			}
		});
	}else{
		pieSeries2.labels.template.disabled = true;
	}
		
	//눈금 비활성화
	pieSeries.ticks.template.disabled = true;
	pieSeries2.ticks.template.disabled = true;
	//클릭 비활성화
	pieSeries.slices.template.clickable = false;
	pieSeries2.slices.template.clickable = false;
	//호버 액티브  모양변화 비활성화
	var hs = pieSeries.slices.template.states.getKey("hover");
	hs.properties.scale = 1;
	var as = pieSeries.slices.template.states.getKey("active");
	as.properties.shiftRadius = 0.1;
	
	var hs2 = pieSeries2.slices.template.states.getKey("hover");
	hs2.properties.scale = 1;
	var as2 = pieSeries2.slices.template.states.getKey("active");
	as2.properties.shiftRadius = 0.1;
	
	var interfaceColors = new am4core.InterfaceColorSet();

	var line1 = container.createChild(am4core.Line);
	line1.strokeDasharray = "2,2";
	line1.strokeOpacity = 0.5;
	line1.stroke = interfaceColors.getFor("alternativeBackground");
	line1.dx = 10;
	line1.isMeasured = false;

	var line2 = container.createChild(am4core.Line);
	line2.strokeDasharray = "2,2";
	line2.strokeOpacity = 0.5;
	line2.stroke = interfaceColors.getFor("alternativeBackground");
	line2.dx = 10;
	line2.isMeasured = false;
	
	var selectedSlice;
	function selectSlice(dataItem) {
		selectedSlice = dataItem.slice;

		var fill = selectedSlice.fill;

		var count = dataItem.dataContext.subPieData.length;
		
		pieSeries2.colors.list = [];
		pieSeries2.colors.list.push(am4core.color(COLOR_ARR[6]));
		pieSeries2.colors.list.push(am4core.color(COLOR_ARR[0]));
//		for (var i = 0; i < count; i++) {
//			pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
//		}
		chart2.data = dataItem.dataContext.subPieData;
		pieSeries2.appear();

		//var middleAngle = selectedSlice.middleAngle;
		//var firstAngle = pieSeries.slices.getIndex(0).startAngle;
		//var animation = pieSeries.animate([{ property: "startAngle", to: firstAngle - middleAngle }, { property: "endAngle", to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
		//animation.events.on("animationprogress", updateLines);
		//selectedSlice.events.on("transformed", updateLines);
	}
	
	function updateLines() {
		if (selectedSlice) {
			var p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
			var p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };

			p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
			p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

			var p21 = { x: 0, y: -pieSeries2.pixelRadius };
			var p22 = { x: 0, y: pieSeries2.pixelRadius };

			p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
			p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

			line1.x1 = p11.x;
			line1.x2 = p21.x;
			line1.y1 = p11.y;
			line1.y2 = p21.y;

			line2.x1 = p12.x;
			line2.x2 = p22.x;
			line2.y1 = p12.y;
			line2.y2 = p22.y;
		}
	}
	
	chart.events.on("ready", function() {
		selectSlice(pieSeries.dataItems.getIndex(0));
		updateLines();
	});


	// Add a legend
	if(option.legendDivId){
		var legendContainer = am4core.create(option.legendDivId, am4core.Container);
		legendContainer.width = am4core.percent(100);
		legendContainer.height = am4core.percent(100);
		chart.legend = new am4charts.Legend();
		chart.legend.parent = legendContainer;
		chart.legend.contentAlign = "center";
	}
	//데이터 바인드
	chart.data = data;

	return chart;
}

/* 반원 파이차트 생성함수 */
function gfn_mkHalfPieChart(data,option){
	var chart = am4core.create(option.chartDivId, am4charts.PieChart);
	chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
	chart.data = data
	chart.radius = am4core.percent(70);
	chart.innerRadius = am4core.percent(40);
	chart.startAngle = 180;
	chart.endAngle = 360;
	chart.tapToActivate = true;
	
	var series = chart.series.push(new am4charts.PieSeries());
	series.dataFields.value = option.valueKey;
	series.dataFields.category = option.category;
	
	series.slices.template.tooltipText = option.tooltipText;
	series.labels.template.disabled = true;
	series.slices.template.cornerRadius = 0;
	series.slices.template.innerCornerRadius = 0;
	series.slices.template.propertyFields.fill = "color";
//	 series.slices.template.draggable = true;
	series.slices.template.inert = true;
	series.alignLabels = false;
	
	series.hiddenState.properties.startAngle = 90;
	series.hiddenState.properties.endAngle = 90;
	
	//클릭 비활성화
	series.slices.template.clickable = false;
	//호버 액티브  모양변화 비활성화
	var hs = series.slices.template.states.getKey("hover");
	hs.properties.scale = 1;
	var as = series.slices.template.states.getKey("active");
	as.properties.shiftRadius = 0;
  // chart.legend = new am4charts.Legend();
	
	return chart;
}

/* 겹치기 차트 */
function gfn_mkOverlapChart(data,option){
	// Create chart instance
	var chart = am4core.create(option.chartDivId, am4charts.XYChart);
	// Add data
	chart.data = data;
	// Create axes
	var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = option.category;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.grid.template.opacity = 0;
	categoryAxis.renderer.minGridDistance = 20;
	categoryAxis.renderer.cellStartLocation = 0.1;
	categoryAxis.renderer.cellEndLocation = 0.9;
	
	var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.width = 0;
	valueAxis.opacity = 0;
	
	if(option.startValue){
	  // valueAxis.labels.template.width = 0;
	  var axisBreak = valueAxis.axisBreaks.create();
	  axisBreak.startValue = option.startValue;
	  axisBreak.endValue = option.endValue;
	  axisBreak.breakSize = 0.08;
	  
	  var hoverState = axisBreak.states.create("hover");
	  hoverState.properties.breakSize = 1;
	  hoverState.properties.opacity = 0.1;
	  hoverState.transitionDuration = 100;
	}
	// valueAxis.title.text = "Expenditure (M)";
	/* createSeries("europe", "Europe", false); */
	for(var i in option.series){
	  fn_createSeries(chart
	  ,option.category
	  ,option.series[i].field
	  ,option.series[i].name
	  ,option.series[i].isStack
	  ,option.series[i].color
	  ,option.series[i].valueAxisType
	  ,option.series[i].width);
	}
	
//	chart.cursor = new am4charts.XYCursor();
//	chart.cursor.lineY.disabled = true;
//	chart.cursor.lineX.disabled = true;
//	chart.cursor.behavior = "none";
}

//Create series
function fn_createSeries(chart,category,field,name,stacked,color,valueAxisType,width) {
	var series;
	// series.columns.template.width = am4core.percent(95);
	if(valueAxisType == 2){
		series = chart.series.push(new am4charts.LineSeries());
		series.bulletsContainer.parent = chart.seriesContainer;
		series.stroke = am4core.color(color);
		series.dataFields.valueY = field;
		series.dataFields.categoryX = category;
		series.strokeDasharray = 2.3;
		series.tensionX = 0.7;
		series.name = name;
		
//		var bullet = series.bullets.push(new am4charts.CircleBullet());
//		series.bullet.template.tooltipText = "{name}: [bold]{valueY}[/]";
		series.tooltipText =  "{name}: [bold]{valueY}[/]";
		
		var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis2.min = 0;
		valueAxis2.hidden = true;
		valueAxis2.width  = 0
		series.yAxis = valueAxis2;
		
  	}else{
  		series = chart.series.push(new am4charts.ColumnSeries());
  		series.columns.template.fill = am4core.color(color);
  		series.columns.template.width = am4core.percent(width);
  		series.columns.template.strokeOpacity = 0;
  		series.dataFields.valueY = field;
  		series.dataFields.categoryX = category;
  		series.name = name;
  		series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
  		series.stacked = stacked;
  		if(!stacked) series.clustered = false;
  	}
	
	return series;
}

/*폭포형 차트 */
function gfn_mkWaterFallChart(data,option){
	var chart = am4core.create(option.chartDivId, am4charts.XYChart);
	chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
	
	chart.data = data
	var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = option.category;
	categoryAxis.renderer.minGridDistance = 1;
	categoryAxis.renderer.grid.template.opacity = 0;
		
	var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	// valueAxis.min = 0;
	valueAxis.width = 0;
	valueAxis.opacity = 0.5;
	valueAxis.renderer.labels.template.fontSize = 0;
	
	var range = valueAxis.axisRanges.create();
	range.value = 0;
	range.grid.stroke = am4core.color("#ccc");
	range.grid.strokeWidth = 2;
	range.grid.strokeOpacity = 0.5;
	
	var columnSeries = chart.series.push(new am4charts.ColumnSeries());
	columnSeries.dataFields.categoryX = option.category;
	columnSeries.dataFields.valueY = option.valueKey;
	columnSeries.dataFields.openValueY = option.openValueKey;
	columnSeries.fillOpacity = 0.8;
	columnSeries.sequencedInterpolation = true;
	columnSeries.interpolationDuration = 1500;
		
	var columnTemplate = columnSeries.columns.template;
	columnTemplate.strokeOpacity = 0;
	columnTemplate.width = am4core.percent(50);
	columnTemplate.propertyFields.fill = option.colorField;
	columnTemplate.tooltipText = option.tooltipText = "{display}";
		
	var label = columnTemplate.createChild(am4core.Label);
	label.text = "{display.formatNumber('#,###a')}";
	label.text = option.labelText;
	label.align = "center";
	label.valign = "middle";
		
	var stepSeries = chart.series.push(new am4charts.StepLineSeries());
	stepSeries.dataFields.categoryX = option.category;
	stepSeries.dataFields.valueY = option.stepValueKey;
	stepSeries.noRisers = true;
	stepSeries.stroke = new am4core.InterfaceColorSet().getFor("alternativeBackground");
	stepSeries.strokeDasharray = "3,3";
	stepSeries.interpolationDuration = 2000;
	stepSeries.sequencedInterpolation = true;
	
	// because column width is 80%, we modify start/end locations so that step would start with column and end with next column
	stepSeries.startLocation = 0.1;
	stepSeries.endLocation = 1.1;
	return chart;
//	chart.cursor = new am4charts.XYCursor();
//	chart.cursor.behavior = "none";
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

//그리드 목록 데이터 없는 경우 데이터 없습니다 처리
function gfn_displayEmptyText(contentId){
//	var isFixed = $("#"+contentId).parent().prev().hasClass("fixed-area");
//	if(isFixed){
		var colSpan = $("#"+contentId).parent().prev().find("table th");
		var emptyText = "<tr><td colspan="+colSpan+"> 데이터가 없습니다. </td></tr>";
		$("#"+contentId).append(emptyText);
//	}else{
//		return; //TODO 상단고정 아닌경우 처리
//	}
}

//일자 포맷 변경 YYYYMMDD = YYYY-MM-DD, YYYYMM = YYYY-MM
function gfn_convertDateFmt(dateStr,sep){
	if(!dateStr) return "";
	if(!sep) sep = "-";
	var replaced = "";
	if(dateStr.length == 8){
		replaced = dateStr.replace(/(\d{4})(\d{2})(\d{2})/g, '$1'+sep+'$2'+sep+'$3');
	}else if(dateStr.length == 6){
		replaced = dateStr.replace(/(\d{4})(\d{2})/g, '$1'+sep+'$2');
	}
	return replaced;
}

//Null 데이터 치환
function fn_flNullData(data,fillStr){
	if(!fillStr) fillStr = "-";
	for(var i in data){
		for(var key in data[i]){
			if(!data[i][key]){
				data[i][key] = fillStr;
			}
		}
	}
}

//CGV 제거
function gfn_removeCGVTxt(txt){
	if(!txt) return "";
	return txt.trim().replace(/CGV/gi,"");
}

$(document).on("click",".movie-name",function(e){
	gfn_mkTooltip(e);
});

//툴팁생성
function gfn_mkTooltip(e){
	var $trgEl = $(e.target);
	if($trgEl.hasClass("no-tooltip") || $trgEl.parents(".no-tooltip").length != 0 ) return;
	if($trgEl.parents("td").length != 0) $trgEl = $($trgEl.parents("td"));
	var trg_offset = $trgEl.offset(); // td 위치
	
	var tooltipHtml = '';
		tooltipHtml += '<div id="dv_tooltip" role="tooltip" class="ui-tooltip ui-corner-all ui-widget-shadow ui-widget ui-widget-content';
		if($trgEl.hasClass("last")) tooltipHtml += ' last';
		tooltipHtml  += '" style="display:none;">';
		tooltipHtml += '<div class="ui-tooltip-content">';
		tooltipHtml += '<p class="movie" id="toolTip-title"></p>';
		tooltipHtml += '</div></div>';
	$('body').append(tooltipHtml);
	$("#toolTip-title").text( $(e.target).text());

	var tt_width_txt = $("#dv_tooltip").css("width").replace("px","");
	var trg_width_txt = $trgEl.css("width").replace("px","");
	var tt_width = Number(tt_width_txt)/2; // tt width 50%
	var trg_width = Number(trg_width_txt)/2; // td width 50%
	$("#dv_tooltip").offset({top:trg_offset.top - 30 , left:trg_offset.left - tt_width + trg_width});

	$(".pop-dimed").fadeIn();
	$("#dv_tooltip").show();

	var tooltip = $("#dv_tooltip");
	if (tooltip.offset().left <= 0 ) {
		tooltip.offset({left:10});
		tooltip.addClass("positionleft");
	}
	
	//툴팁 딤처리 선택시 툴팁 제거 이벤트 바인딩
	$(".pop-dimed").bind("click",function(){
		$(".pop-dimed").fadeOut();
		$("#dv_tooltip").remove();
	});
}

//RS SITE 검색 타입에 따른 태그 내 텍스트 변경
function gfn_setRsSiteName(type,nm){
	if(type == "all"){ // 전체 검색의 경우
		$(".flagDataName").text("전국");
		$(".rsSiteName").text("CGV");
		$("[name='rsSiteName']").text("CGV");
	}else{ // RS/SITE 검색의 경우
		$(".flagDataName").text("CGV");
		$(".rsSiteName").text(type.toUpperCase());
		$("[name='rsSiteName']").text(nm);
	}
}

/// 안드로이드 뒤로가기 처리
function gfn_historyBack() {
	return true;
}

function gfn_dataSort(datas, dataType, sortType){
	if(!sortType) sortType="A";
	datas.sort(function(a, b) {
		if(sortType.toUpperCase() == "D"){
			return a[dataType] > b[dataType] ? -1 : a[dataType] < b[dataType] ? 1 : 0;
		}else{
			return a[dataType] < b[dataType] ? -1 : a[dataType] > b[dataType] ? 1 : 0;
		}
	});
}

/*************************************************************************
 * gfn_gotoLocation : 화면 전환 이벤트
 * @param location : /home
 * ex) gfn_locationHref("/home");
 ************************************************************************/
function gfn_locationHref(location, param) {
	if (!location || location.length == 0) {
		return;
	}

	var userInfo = JSON.parse(localStorage.userInfo);
	var pathContext = "";
	if (context) {
		pathContext = context;
	}
	if (location == "/home") {
		window.location.href = pathContext + "/home" + ".do";
	} else {
		var getParam = "";
		if (location.indexOf("?") > 0) {
			getParam = location.substring(location.indexOf("?")+1);
		}
		var idx = location.lastIndexOf(".do");
		if (idx != -1) {
			location = location.substring(0, idx);
		}
		if (param) {
			window.location.href = pathContext + location + ".do?param=" + JSON.stringify(param);
		} else {
			if (getParam.length > 0) {
				window.location.href = pathContext + location + ".do?" + getParam;
			} else {
				window.location.href = pathContext + location + ".do";
			}
		}
	}
}

function gfn_sortObject(o){
    var sorted = {},
    key, a = [];
    // 키이름을 추출하여 배열에 집어넣음
    for (key in o) {
        if (o.hasOwnProperty(key)) a.push(key);
    }
    // 키이름 배열을 정렬
    a.sort();
    // 정렬된 키이름 배열을 이용하여 object 재구성
    for (key=0; key<a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}
