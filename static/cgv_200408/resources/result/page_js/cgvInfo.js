function fn_init(){
	
	$('<style>.total-txt04 li::before{content:""; width:0px; height:0px;margin:0px;}</style>').appendTo('body');
	
	/*RS/SITE 초기화*/
	rsSiteType = "all";
	rsSiteNm = "CGV";
	$("[name='rsSiteName']").text(rsSiteNm);
	
	/* 검색 셀렉트박스 선택 이벤트 */
	$("#srchType").on("select",function(){
		var srchType = $(this).attr("data-val");
		if(srchType == "site"){
			gfn_searchSite("[name='rsSiteName']");
		}else{
			rsSiteType = "";
			rsSiteNm = "";
			rsSiteCd = "";
			$("[name='rsSiteName']").text("CGV");
			fn_initSearch();
		}
	});
	
	/* RS/SITE 검색 후 */
	$("[name='rsSiteName']").on("change",function(e){
		rsSiteType = $("#srchType").attr("data-val");
		rsSiteNm   = $(e.target).text();
		rsSiteCd   = $(e.target).attr("data-code");
		fn_initSearch();
	});
	
	/* 일자 및 Datepicker 설정 */
	if(srchDate) $("#srchDate").val(gfn_convertDateFmt("d"));
	else{
		$("#srchDate").val(fn_getFlagDate("d"));
		srchDate = fn_getFlagDate("d").replace("-","");
	}
	gfn_setDatepicker($("#srchDate"));
	
	/* 일자 변경이벤트 */
	$("#srchDate").on("change",function(e){
		srchDate = $(e.target).val().replace(/-/gi,"");
		fn_initSearch(); //조회,재조회
	});
	
	/* 서브메뉴 탭변경 이벤트 */
	$(".sPage-tab").on("click",function(e){
		$(this).addClass("active").siblings().removeClass("active");
		var tabFlag = $(this).attr("data-tab");
		$(".tab-"+tabFlag).show().siblings().hide();
		fn_initSearch();
	});
	
	/* 운영현황 > 데이터 구분탭  이벤트 */
	$(".tab01").on("click",function(e){
		$(this).addClass("active").siblings().removeClass("active");
		$("#tab-type-txt").text($(this).text());
		fn_getDmstDetailCursts();
	});
	
	/* 운영현황 > 데이터 구분탭 > 하위 서브제목 */
	$("#tab-type-txt").text($(".tab01.active").text());
	fn_initSearch();
	
	/*Ranking 정렬탭 이벤트*/
	$("#orderCol li").on("click",function(e){
		if($(this).hasClass("active")){
			var sortType = $(this).attr("data-type");
			if(sortType == "d"){
				$(this).attr("data-type","a");
			}else{
				$(this).attr("data-type","d");
			}
		}else{
			$(this).addClass("active").siblings("li").removeClass("active");
			$(this).attr("data-type","d");
		}
		fn_getTopRank();
	});
}

/* 초기검색 */
function fn_initSearch(){
	if($(".sPage-tab.active").attr("data-tab") == "rank"){
		fn_getTopRank();
	}else{
		fn_getOpperCursts();
	}
}

/*운영현황 페이지 초기화*/
function fn_getOpperCursts(){
	var params = {};
	params.srchDate = srchDate.substr(0,6);
	transaction({
		 url : "/result/pageInitForOpperCursts.do"
		,params : params
	},function(result,e){
		if(!e){
			fn_mkRowForSttl(result.sttlList);
			fn_mkRowForDmst(result.dmstList);
		}
	});
}

/* 국내 현황 조회 */
function fn_getDmstDetailCursts(){
	var params = {};
	params.srchDate = srchDate.substr(0,6);
	params.tabFlag = $(".tab01.active").attr("data-tab");
	transaction({
		 url : "/result/getDmstDetailCursts.do"
		,params : params
	},function(result,e){
		if(!e){
			console.log(result);
			if(params.tabFlag == "SAL"){
				var datas = result.dmstList[0];
				fn_mkRowForDmstBySal("tbl_dmstDetailCurstsForSalByFnb",datas.fnbData);
				fn_mkRowForDmstBySal("tbl_dmstDetailCurstsForSalByNewb",datas.newbData);
			}else{
				fn_mkRowForDmst(result.dmstList);
			}
		}
	});
}
/* 국내 현황 탭별 상세 조회 */
function fn_getDmstDetailCurstsOfDetail(srchCd,dataType){
	if("00" == srchCd) return;
	var params = {};
	params.srchDate = srchDate.substr(0,6);
	params.tabFlag = $(".tab01.active").attr("data-tab");
	params.srchCd = srchCd.length == 1 ? "0"+srchCd : srchCd;
	var trEl = $(event.target).parent("tr");
	if(params.tabFlag == "SAL"){
		params.dataType = dataType;
		params.saleChnlCd = srchCd;
	}
	transaction({
		 url    : "/result/getDmstDetailCurstsOfDetail.do"
		,params : params
	},function(result,e){
		if(!e){
			if(dataType) fn_showCgvInfoPopForSal(result.dmstDtlList,trEl);
			else fn_showCgvInfoPop(result.dmstDtlList);
		}
	});
}

/* 역대랭킹 목록조회 */
function fn_getTopRank(){
	var params = {}
	params.orderCol = $("#orderCol li.active").attr("data-col");
	params.orderType = $("#orderCol li.active").attr("data-type");
	rsSiteType = rsSiteType? rsSiteType : null;
	rsSiteCd = rsSiteCd? rsSiteCd : null;
	params.srchType = rsSiteType != "all" ? rsSiteType : null;
	params.srchValue = rsSiteCd;
	
	transaction({
		 url : "/result/getTopRank.do"
		,params : params
	},function(result,e){
		if(!e){
			fn_mkRowForRank(result.rankList);
			var activeIndex = 4;
			if(srchType && params.orderCol == "cgvSpctCnt") activeIndex = 3;
			$("#tbl_rank tbody tr").each(function(e){
				$(this).find("td").eq(activeIndex).addClass("point-bg");
			});
		}
	});
}

/* 운영현황 테이블 생성 */
function fn_mkRowForSttl(data){
	var html = ``;
	for(var i in data){
		if(data[i].ctryCd == "00"){
			$("#siteCnt").text(gfn_numberFormat(data[i].scnThatCnt)+"개");
			$("#screenCnt").text(gfn_numberFormat(data[i].scnScreenCnt)+"개");
//			$("#seatCnt").text(gfn_numberFormat(data[i].totSeatCnt));
		}
			
		html += `
			<tr class="${data[i].ctryCd=="00"? "point-bg02 total" : "" }">
				<td class="${data[i].ctryCd != "00" ? "c-icon" : "" } ctry-${data[i].ctryCd}">${data[i].ctryNm}</td>
				<td>${gfn_numberFormat(data[i].scnThatCnt)}</td>
				<td>${gfn_numberFormat(data[i].scnScreenCnt)}</td>
				<td>${data[i].totSeatCnt == 0 ? '-' : gfn_numberFormat(data[i].totSeatCnt)}</td>
			</tr>
		`;
	}
	if(!data || !data.length) html = `<tr><td colspan=4>데이터가 없습니다.</td></tr>`;
	$("#tbl_sttlBasicCursts tbody").empty().append(html);
}

/* 국내현황 테이블 생성  ( RS,지역,상영관 ) */
function fn_mkRowForDmst(data){
	var html = ``;
	for(var i in data){
		var style = "";
		if( i == 1) style = ` style='border-bottom:0;' `;
		html += `
			<tr class="${data[i].rsltCd == '0000' ? 'th-style' : data[i].rsltCd == '00' ? 'th-style' : ''}" onclick="fn_getDmstDetailCurstsOfDetail('${data[i].rsltCd}')">
				<td ${i==1 ? "style='border-bottom:0;'" : ''}>${data[i].rsltNm}</td>
				<td ${i==1 ? "style='border-bottom:0;'" : ''}>${gfn_numberFormat(data[i].thatSum)}</td>
				<td ${i==1 ? "style='border-bottom:0;'" : ''}>${gfn_numberFormat(data[i].scnSum)}</td>
				<td ${i==1 ? "style='border-bottom:0;'" : ''}>${data[i].seatSum == 0 ? '-' : gfn_numberFormat(data[i].seatSum)}</td>
			</tr>
		`;
	}
	if(!data || !data.length) html = `<tr><td colspan=4>데이터가 없습니다.</td></tr>`;
	$(".tab-rslt").hide();
	$("#tbl_dmstDetailCursts tbody").parents(".tab-rslt").show();
	$("#tbl_dmstDetailCursts tbody").empty().append(html);
}
/* 국내현황 테이블 생성  ( 매장별 ) */
function fn_mkRowForDmstBySal(tableId,data){
	var dataType = tableId == 'tbl_dmstDetailCurstsForSalByNewb' ? 'NEWB' : 'FNB' ;
	var html = ``;
	for(var i in data){
		html+= `
			<tr onclick="fn_getDmstDetailCurstsOfDetail('${data[i].saleChnlCd}' , '${dataType}')">
				<td>${data[i].saleChnlNm}</td>
				<td>${gfn_numberFormat(data[i].cnt)}</td>
			</tr>
		`
	};
	if(data.length == 0) html+= `<tr><td colspan=2> 데이터가 없습니다. </td></tr>`;
	$(".tab-rslt").hide();
	$("#"+tableId+" tbody").parents(".tab-rslt").show();
	$("#"+tableId+" tbody").empty().append(html);
}

/* Top Rank 테이블 생성 */
function fn_mkRowForRank(data){
	var html = ``;
	for(var i in data){
		html+=`
		<tr>
			<td>${data[i].rnk}</td>
			<td>${data[i].scnDy.substr(0,4)}-${data[i].scnDy.substr(4,2)}-${data[i].scnDy.substr(6,2)}</td>
			<td>${gfn_numberFormat(data[i].totBktQty)}</td>
			<td>${gfn_numberFormat(data[i].cgvBktQty)}</td>
			<td><span>${data[i].cgvBktMs}</span>%</td>
			<td class="movie-name">
				<span>${data[i].top1KoficMovNm}</span>
				<span class="s-font no-tooltip f-color04 align-r"><span>${data[i].top1Rate}</span>%</span>
			</td>
			<td class="movie-name">
				<span>${data[i].top2KoficMovNm}</span>
				<span class="s-font no-tooltip f-color04 align-r"><span>${data[i].top2Rate}</span>%</span>
			</td>
			<td class="movie-name last">
				<span>${data[i].top3KoficMovNm}</span>
				<span class="s-font no-tooltip f-color04 align-r"><span>${data[i].top3Rate}</span>%</span>
			</td>
		</tr>
		`;
	}
	fn_mkFreezeArea();
	$("#tbl_rank tbody").empty().append(html);
	setTimeout(() => {
		fn_freezeTable();
	}, 10);
}

function fn_mkFreezeArea(){
	var html = `
		<table id="tbl_rank" class="table-freeze-multi" data-scroll-height="auto" data-cols-number=1>
			<colgroup>
				<col class="col-rank" width="20px">
				<col >
				<col >
				<col >
				<col >
				<col class="col-mov">
				<col class="col-mov">
				<col class="col-mov">
			</colgroup>
			<thead>
				<tr>
					<th rowspan="2">순위</th>
					<th rowspan="2">일자</th>
					<th rowspan="2">전국</th>
					<th rowspan="2" name="rsSiteName">${rsSiteNm ? rsSiteNm : 'CGV'}</th>
					<th rowspan="2">관객<br>MS</th>
					<th colspan="3">전국 주요 상영작 (관객비중)</th>
				</tr>
				<tr>
					<th style="display:none;">TOP1</th> <!-- IOS 이슈처리로 인한 더미 태그 -->
					<th>TOP1</th>
					<th>TOP2</th>
					<th>TOP3</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		<span class="icon-x-scroll"></span>
	`;
	$("#dv_freeze").empty().append(html);
}
//스크롤 이벤트 바인딩
$(document).on("click",".icon-x-scroll",function(e){
	if($(this).hasClass("a")){
		$('.freeze-multi-scroll-table-body').animate({scrollLeft : 0}, 500);
		$(this).css("transform","rotate(0deg)");
		$(this).removeClass("a");
	}else{
		$('.freeze-multi-scroll-table-body').animate({scrollLeft : $('.freeze-multi-scroll-table-body').width()}, 500);
		$(this).css("transform","rotate(180deg)");
		$(this).addClass("a");
	}
});