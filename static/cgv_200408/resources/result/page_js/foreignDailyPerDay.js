var chart01;
/** ************[ INIT S ]******************* */
function fn_init(){
	if (srchDate) {
		var flagDate = fn_getFlagDate("d", true).replace(/-/gi, "");
		if (Number(srchDate) < Number(flagDate))
			$(".btn-next").css("visibility", "visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	} else {
		$("#srchDate").val(fn_getFlagDate("d"));
	}
	// 데이트피커호출
	gfn_setDatepicker($("#srchDate"));

	/* 일자변경 이벤트 */
	$("#srchDate").on("change", function(e) {
		srchDate = $(e.target).val().replace(/-/gi, "");
		fn_initSearch(); // 조회,재조회
	});
	
	$(".dataType").on("click",function(e){
		$(e.target).siblings().removeClass("active");
		$(e.target).addClass("active");
		fn_initSearch(); // 조회,재조회
	});
	
	fn_initSearch();
}
/** ************[ INIT E ]******************* */

/** ************[ TRANSACTION S ]******************* */
function fn_getContryRecodeDataByDate(){
	var data = fn_mkTestData();
	fn_mkChart01(data);
	fn_mkRow(data);
}
/** ************[ TRANSACTION E ]******************* */

/** ************[ FUNCTION S ]******************* */
function fn_initSearch(){
	fn_getContryRecodeDataByDate();
}

function fn_mkChart01(data){
	if(chart01) chart01.dispose();
	chart01 = gfn_mkXYChart(data,{
		chartDivId : "chart01"
		,categoryName : "date"
		,inversed   : false
		,isWide     : true
		,cursor     : true
		,series : [
			 {type : "col"  , name : "budget"   , valueKey : "budget"   , color: COLOR_ARR[5] ,clusteredYn: true , padding : 10}
			,{type : "col"  , name : "actual"   , valueKey : "actual"   , color: COLOR_ARR[0] ,clusteredYn:true}
			,{type : "line" , name : "vsBudget" , valueKey : "vsBudget" , color: COLOR_ARR[3] , valueAxisType:2}
		]
	});
}

function fn_mkRow(data){
	var html;
	for(var i in data){
		html +=
		`<tr>
		<td>${data[i].dateTbl}</td>
		<td>${data[i].actual}</td>
		<td>${data[i].budget}</td>
		<td>${data[i].vsBudget}</td>
		<td>${data[i].occ}</td>
		</tr>`;
	}
	
	$("#tbl_country").empty().append(html);
}

function fn_mkTestData(){
	var dataList = [];
	for(var i=0; i<31; i++){
		var dataObj = {};
		var stdDt = new Date(fn_getFlagDate("d",true));
		var conv = new Date(stdDt.getFullYear(),stdDt.getMonth(),stdDt.getDate() - i);
		var dayName = fn_addDayName(conv)
		
//		if(conv.getMonth() == 0){
//			dataObj.stdDy = conv.format("MM월\nyyyy년");
//		}else{
//			dataObj.stdDy = conv.format("MM월");
//		};
		
		dataObj.date = conv.format("MM/dd");
		dataObj.dateTbl = conv.format("MM/dd")+'<br>'+dayName;
		dataObj.actual = getRandomInt(100,10000);
		dataObj.budget = getRandomInt(100,10000);
		dataObj.vsBudget = getRandomInt(100,10000);
		dataObj.occ = getRandomInt(1,99);
		dataList.push(dataObj);
	}
	return dataList;
}

//요일이름
function fn_addDayName(date){
	var day = date.getDay();
	var rtnDateStr = "";
	switch(day){
		case 0 : rtnDateStr+="SUN"; break;
		case 1 : rtnDateStr+="MON"; break;
		case 2 : rtnDateStr+="TUE"; break;
		case 3 : rtnDateStr+="WEN"; break;
		case 4 : rtnDateStr+="THR"; break;
		case 5 : rtnDateStr+="FRI"; break;
		case 6 : rtnDateStr+="SAT"; break;
	}
	return rtnDateStr;
}
/** ************[ FUNCTION E ]******************* */