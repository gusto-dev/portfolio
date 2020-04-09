var chart01;
/** ************[ INIT S ]******************* */
function fn_init(){
	if(srchDate){
		var flagDate = fn_getFlagDate("m",true).replace(/-/gi,"");
		if(Number(srchDate) < Number(flagDate)) $(".btn-next").css("visibility","visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	}
	else $("#srchDate").val(fn_getFlagDate("m"));
	
	//AnyPicker 설정
	$("#srchDate").dateAnyPicker({
		  maxDate : [fn_getFlagDate("m").split("-")[0],fn_getFlagDate("m").split("-")[1]-1]
		 ,format  : "yyyy-MM"
		, onChange: function(date){
			fn_isOverDate (date)
			$("#srchDate").trigger("change");
		}
	});
	
	/* 일자변경 이벤트 */
	$("#srchDate").on("change", function(e) {
		srchDate = $(e.target).val().replace(/-/gi, "");
		fn_initSearch(); // 조회,재조회
	});
	
	$(".btn-view").on("click",fn_toggleChart);
	
	fn_getForeignLastTotMonth(); //최근 마감월 조회
	fn_initSearch();
}
/** ************[ INIT E ]******************* */

/** ************[ TRANSACTION S ]******************* */
//function fn_getContryRecodeData(){
//	var data = fn_mkTestData();
//	fn_mkChart01(data);
//	fn_mkRow(data);
//}

/* 최근 마감월 조회 */
function fn_getForeignLastTotMonth(){
	transaction({
		url : '/result/getForeignLastTotMonth.do'
		,asyncFlag : false
	},function(result, e){
		if(!e){
			console.log("getForeignLastTotMonth",result);
			var lastTotMonth = result.basYm+"";
			var y = lastTotMonth.substr(0,4);
			var m = lastTotMonth.substr(4,2);
			$("#srchDate").val(y+"-"+m);
		}else{
			console.log(e);
		}
	});
}

/* 차트 데이터 조회 */
function fn_getForeignMonthlyChart(){
	var params = {}
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	
	transaction({
		url : '/result/getForeignMonthlyChart.do'
		,params : params
		,complete : function(){}
	},function(result,e){
		if(!e){
			console.log("getForeignMonthlyChart",result);
			fn_mkChart01(result.resultList);
			fn_getForeignMonthlyGrd(); //그리드 데이터 조회
		}else{
			console.log(e);
		}
	});
}

/* 그리드 데이터 조회 */
function fn_getForeignMonthlyGrd(){
	var params = {}
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	
	transaction({
		url : '/result/getForeignMonthlyGrd.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("getForeignMonthlyGrd",result);
			fn_mkFrzTbl(result.resultList,null,fn_getMonthList());
		}else{
			console.log(e);
		}
	});
}
/** ************[ TRANSACTION E ]******************* */

/** ************[ FUNCTION S ]******************* */
function fn_initSearch(){
	$(".scroll_chart").show();
	$(".lgnd-area").show();
	$(".btn-view").removeClass("on").addClass("on");
	fn_getForeignMonthlyChart();
}

/* 검색일 기준 금년 월 조회 */
function fn_getMonthList(){
	var flagDateStrArr = $("#srchDate").val().split("-");
	var eDate = new Date(flagDateStrArr[0],Number(flagDateStrArr[1]),0);
//	var dateNames = ['일', '월', '화', '수', '목', '금', '토'];
	
	console.log("end-Date",eDate.getMonth() +"/"+ eDate.getDate());
	
	var dateList = [];
	for(var i=1; i<=12; i++){
		var dateObj = {};
		var date = new Date(eDate.getFullYear(),i,0);
//		dateObj.cnt = "CNF_"+i;
		dateObj.cnt = i;
		dateObj.date = date;
//		dateObj.dateDsplStr = date.format("yyyy-MM");
		dateObj.dateStr = date.format("yyyyMM");
		dateObj.year = date.format("yyyy") + "년";
		dateObj.month = date.format("MM") + "월";
//		dateObj.day = dateNames[date.getDay()];
//		dateObj.color = date.getDay() == 0 ? 1 : date.getDay() == 6 ? 2 : 99 ;
		dateList.push(dateObj);
	}
	console.log(dateList);
	return dateList;
}

//function fn_getDateList(){
//	var flagDateStrArr = $("#srchDate").val().split("-");
//	var eDate = new Date(flagDateStrArr[0],Number(flagDateStrArr[1]),0);
//	var dateNames = ['일', '월', '화', '수', '목', '금', '토'];
//
//	console.log("end-Date",eDate.getMonth() +"/"+ eDate.getDate());
//
//	var dateList = [];
//	for(var i=1; i<=eDate.getDate(); i++){
//		var dateObj = {};
//		var date = new Date(eDate.getFullYear(),eDate.getMonth(),i);
////		dateObj.cnt = "CNF_"+i;
//		dateObj.cnt = i;
//		dateObj.date = date;
//		dateObj.dateDsplStr = date.format("MM-dd");
//		dateObj.dateStr = date.format("yyyyMMdd");
//		dateObj.day = dateNames[date.getDay()];
//		dateObj.color = date.getDay() == 0 ? 1 : date.getDay() == 6 ? 2 : 99 ;
//		dateList.push(dateObj);
//	}
//	console.log(dateList);
//	return dateList;
//}

/* 좌측 고정 테이블 생성 */
function fn_mkFrzTbl(resData,subData,weekList){
//	data = [];
//	for(var i=0; i<20; i++){
//		var unitFlag = "국가-"+Math.floor(i/4);
////		if(i%4 == 0) unitFlag = true;
//		var temp = {};
//		for(var j=0; j<weekList.length+2; j++){
//			if(j == 0) temp["col"+j] = unitFlag;
//			else if(j == 1) temp["col"+j] = "구분-"+ i%4;
//			else temp["col"+j] = "test"+i+j;
//		}
//		console.log(temp);
//		data.push(temp);
//	};
//
//	subData = [];
//	for(var i=0; i<20; i++){
//		var dataObj = {};
//		dataObj.col1 = "test1"+i;
//		dataObj.col2 = "test2"+i;
//		subData.push(dataObj);
//	}
	
	var data = [];
	for(var i in resData){
		resData[i] = sortObject(resData[i]);
		var unitFlag = resData[i].ctryNm;
		var gbunFlag = resData[i].gbun;
		var temp = {};
		temp["cUnit"] = unitFlag;
		temp["cGbun"] = gbunFlag;
		
		for(var j=1; j<=weekList.length; j++){
//			var cnfNum = Number(j);
//			if(cnfNum < 10) cnfNum = "0"+cnfNum;
			temp["col"+j] = resData[i]["cnf"+j] ? resData[i]["cnf"+j] : 0;
		}
		data.push(temp);
	};

	var subData = [];
	for(var i in resData){
		var temp = {};
		temp["cUnit"] = resData[i].ctryNm;
		temp["cGbun"] = resData[i].gbun;
		temp["col1"]  = resData[i].cnfSum;
		temp["col2"]  = resData[i].cnfDay;
		subData.push(temp);
	}
	
	//테이블 생성
	var tbl_html =
	`<table class="table-freeze-multi txt-c" data-scroll-height="auto" data-cols-number="2">
	<colgroup>
		<col>
		<col>
		${fn_mkFrzTblCol(weekList,'grp')}
	</colgroup>
	<thead></thead>
	<tbody></tbody>
	</table>`;
	$("#frzTbl").empty().append(tbl_html);
	
	//테이블 헤더 생성
	var tbl_head_html =
	`<tr>
		<th colspan="2" id="subTblHead" onclick="fn_toggleSubTbl()">
			구분 <p class="unit">(단위 : 천명)</p>
			<button type="button" class="tbl-arrow" onclick="fn_toggleSubTbl()"></button>
		</th>
		${fn_mkFrzTblCol(weekList)}
	</tr>`;
	$("#frzTbl .table-freeze-multi thead").empty().append(tbl_head_html);
	
	//테아블 ROW 생성
	var tbl_row_html =
	`
		${fn_mkFrzTblRow(data)}
	`;
	$("#frzTbl .table-freeze-multi tbody").empty().append(tbl_row_html);
	
	//서브테이블 생성
	var sub_tbl_html = fn_mkSubTbl(subData);
	$("#frzTbl").append(sub_tbl_html);
	
	//버튼  토글이벤트 추가
	$(".tbl-arrow").on("click",fn_toggleSubTbl);
	
	//좌측 틀고정 js 실행
	fn_freezeTable();
	
	var nowDay = $("#srchDate").val().replace(/-/gi,"").substr(4,2);
	$(".freeze-multi-scroll-table-body").scrollLeft(70*(Number(nowDay)-1));
}

/* 서브테이블 생성 */
function fn_mkSubTbl(data){
	var html=``;
	var sub_tbl_area = `
		<div class="accod-view" style="display:none;">
			<table class="evt-tbl">
				<colgroup>
					<col>
					<col>
				</colgroup>
				<thead>
					<tr>
						<th>금년전체</th>
						<th class="total">누계</th>
					</tr>
				</thead>
				<tbody>
					${fn_mkSubTblRow(data)}
				</tbody>
			</table>
		</div>
	`;
	return sub_tbl_area;
}

//서브 데이터 생성
function fn_mkSubTblRow(data){
	var html = ``;
//	for(var i in data){
//		html += `
//		<tr class='${ i%4 == 0 ? 'bdiv':''}'>
//			<td>${data[i].col1}</td>
//			<td>${data[i].col2}</td>
//		</tr>
//		`
//	}
	
	for(var i in data){
		html += `<tr class='${i%4 == 0 ? 'bdiv' : ''}'>`;
		for(var key in data[i]){
			var colData = data[i][key];
			var gainFallClass = "";
			
			if(data[i]["cGbun"] == "GAP" && colData > 0){
				gainFallClass = "gain";
				colData = Math.abs(colData);
			}else if(data[i]["cGbun"] == "GAP" && colData < 0){
				gainFallClass = "fall";
				colData = Math.abs(colData);
			}else if(data[i]["cGbun"] == "GAP" && colData == 0){
				gainFallClass = "";
				colData = "-";
			}
			if(key == "col1" || key == "col2"){
				if(data[i]["cGbun"] == "달성률" && colData != "0"){
					html += `<td style='background:#f7f7f7;' class='align-r'>${colData}%</td>`;
				}else{
					html += `<td style='background:#f7f7f7;' class='align-r'>
								<span class='${gainFallClass}'>${fn_setNumberUnit(colData)}</span>
							</td>`;
				}
			}
		}
		html +=`</tr>`;
	}
	
	return html;
}

/* 서브테이블 showHide */
function fn_toggleSubTbl(){
	$("#frzTbl .accod-view").toggle();
	$("#frzTbl .accod-view").css("left", $("#subTblHead").outerWidth(true));
	$("#frzTbl .accod-view").css("border-left", "1px solid #ccc");
//	$("#frzTbl .accod-view").animate({
//		width: "toggle"
//	});
//	var width = $("#frzTbl .accod-view").width();
//	$(".freeze-multi-scroll-table-body").css("padding-left",width);
}

/* 차트 showHide */
function fn_toggleChart(){
	$(".scroll_chart").toggle();
	$(".lgnd-area").toggle();
}



/* 좌측 고정 테이블 ROW 생성 */
function fn_mkFrzTblRow(data){
	var html = ``;
	
//	for(var i in data){
//		html += `<tr class='${i%4 == 0 ? 'bdiv' : ''}'>`;
//
//		for(var key in data[i]){
//			var colData = data[i][key];
//			if(key == "col0"){
//				console.log(colData);
//				if(i%4 == 0) html += `<th class='chain' rowspan=4>${colData}</th>`;
//			}else if(key == "col1"){
//				html += `<th>${colData}</th>`;
//			}else{
//				html += `<td class='align-r'>${colData}</td>`;
//			}
//		}
//		html +=`</tr>`;
//	}
	
//	fn_flNullData(data); //0 -> -
//	console.log(data);
	for(var i in data){
		html += `<tr class='${i%4 == 0 ? 'bdiv' : ''}'>`;
		for(var key in data[i]){
			var colData = data[i][key];
			var gainFallClass = "";
			var fontColorClass = "";
			
			if(data[i]["cGbun"] == "GAP" && colData > 0){
				gainFallClass = "gain";
				colData = Math.abs(colData);
			}else if(data[i]["cGbun"] == "GAP" && colData < 0){
				gainFallClass = "fall";
				colData = Math.abs(colData);
			}else if(data[i]["cGbun"] == "GAP" && colData == 0){
				gainFallClass = "";
				colData = "-";
			}
			
			if(key.indexOf("col") > -1){
				var dateStr = key.replace("col","");
				var nowMm = $("#srchDate").val().replace(/-/gi,"").substr(4,2);
//				var nowYear = $("#srchDate").val().replace(/-/gi,"").substr(0,4);
//				var nowDate = new Date();
//				if(Number(dateStr) > Number(nowDate.format("MM"))-1 && Number(nowDate.format("yyyy")) == nowYear){
				if(Number(dateStr) > Number(nowMm)){
					gainFallClass = "";
					fontColorClass = "f-color05";
					if("목표" != data[i]["cGbun"]) colData = "-";
				}else{
					fontColorClass = "";
				}
			}

			if(key == "cUnit"){
				if(i%4 == 0) html += `<th class='chain' rowspan=4>${colData}</th>`;
			}else if(key == "cGbun"){
				html += `<th>${colData}</th>`;
			}else if(data[i]["cGbun"] == "달성률" && colData != "0" && colData != "-"){
				html += `<td class='align-r'>
							<span>${colData}%</span>
						</td>`;
			}else{
				html += `<td class='align-r'>
							<span class='${gainFallClass} ${fontColorClass}'>${fn_setNumberUnit(colData)}</span>
						</td>`;
			}
		}
		html +=`</tr>`;
	}
	
	return html;
}

/* 좌측 고정 테이블 컬럼 생성 */
function fn_mkFrzTblCol(weekList,type){
	var html = ``;
	if(type == "grp"){
		for(var i in weekList){
			html += `<col style='width:70px'>`;
		}
	}else{
		for(var i in weekList){
			html += `<th>${weekList[i].year}<br/>${weekList[i].month}</th>`
		}
	}
	return html;
}

/* 차트 생성 */
function fn_mkChart01(data){
	var maxData = 0;
	for(var i in data){
		var temp1 = data[i].spct;
		data[i].outVal = fn_setNumberUnit(temp1);

		var temp2 = data[i].plnSpct;
		data[i].outVal1 = fn_setNumberUnit(temp2);

		if(maxData < data[i].plnSpct ) maxData = data[i].plnSpct;
		if(maxData < data[i].spct )    maxData = data[i].spct;
	}

	if(chart01) chart01.dispose();
	chart01 = gfn_mkXYChart(data,{
		chartDivId : "chart01"
		,categoryName : "nm"
		,guideLine   : true
		,inversed    : false
		,isWide      : true
		,cursor      : true
		,cursorFocus : data[0].nm
		,max : maxData * 1.1
		,series : [
			 {type : "col"  , name : "plnSpct"   , valueKey : "plnSpct"   , color: COLOR_ARR[5] ,tooltipText: "{outVal1}", clusteredYn: true , padding : 10}
			,{type : "col"  , name : "spct"      , valueKey : "spct"      , color: COLOR_ARR[0] ,tooltipText: "{outVal}", clusteredYn:true}
			,{type : "line" , name : "spctRat"   , valueKey : "spctRat"   , color: COLOR_ARR[3] ,tooltipText: "{spctRat}%", valueAxisType:2}
		]
	});
	
}

//function fn_mkRow(data){
//	var html;
//	for(var i in data){
//		html +=
//		`<tr>
//		<td>${data[i].country}</td>
//		<td>${data[i].actual}</td>
//		<td>${data[i].budget}</td>
//		<td>${data[i].vsBudget}</td>
//		<td>${data[i].occ}</td>
//		</tr>`;
//	}
//
//	$("#tbl_country").empty().append(html);
//}

//function fn_mkTestData(){
//	var countryList = [
//		{name: '대한민국'  ,cd :'KR'  }
//		,{name: '중국'      ,cd :'CN'   }
//		,{name: '베트남'    ,cd :'VN'   }
//		,{name: '인도네시아' ,cd:'ID'  }
//		,{name: '터키'      ,cd :'TR'  }
//		,{name: '미얀마'    ,cd :'MM'  }
//		,{name: '미국'     ,cd :'US'   }
//		,{name: '러시아'    ,cd :'RU'  }
//	]
//
//	var dataList = [];
//	for(var i in countryList){
//		var dataObj = {};
//		dataObj.country = countryList[i].cd;
//		dataObj.countryNm = countryList[i].name;
//		dataObj.actual = getRandomInt(100,10000);
//		dataObj.budget = getRandomInt(100,10000);
//		dataObj.vsBudget = getRandomInt(100,10000);
//		dataObj.occ = getRandomInt(1,99);
//		dataList.push(dataObj);
//	}
//	return dataList;
//}

//object를 키 이름으로 정렬하여 반환
function sortObject(o){
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

/*천명 절삭*/
function fn_setNumberUnit(number){
	if("number" != typeof number ) return number;
	if(number == 0) return "0"
	convertedNum = number/1000;
	convertedNum = Math.round(convertedNum);
	convertedNum = gfn_numberFormat(convertedNum);
	return convertedNum;
};
/** ************[ FUNCTION E ]******************* */