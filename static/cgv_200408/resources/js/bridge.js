const BRIDGE_NAME = "cgvsmsBridge";

function isAndroid() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (/android/i.test(userAgent)) {
		return true;
	} else if (/MOS_AND_WEB_KIT/i.test(userAgent)) {
		return true;
	} else {
		return false;
	}
}

function isIos() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return true;
	} else if (/MOS_IOS_WEB_KIT/.test(userAgent) && !window.MSStream) {
		return true;
	} else {
		return false;
	}
}

/**
 * Native 함수 호출
 * @param name
 * @param params
 * @return
 * ex) gfn_callApp("externalBrowser", "http://m.naver.com");
 */
function gfn_callApp(name, params) {
	console.log(name);
	console.log(params);
	
	try {
		if (isAndroid()) {
			if (params) {
				var result = window[BRIDGE_NAME][name](JSON.stringify(params));
				fn_appCallback(name, result);
			} else {
				var result = window[BRIDGE_NAME][name]();
				fn_appCallback(name, result);
			}
		} else if (isIos()) {
			window.webkit.messageHandlers[BRIDGE_NAME].postMessage({
				name: name,
				params: params
			});
		} else {
			fn_appCallback(name);
		}
	} catch (e) {
		console.error("Is not supported.");
	}
}

/**
 * Native 브라우저 여부 확인
 * @return
 * ex) gfn_callApp();
 */
function gfn_supportApp(profile) {
	if (profile == "WKR") {
		return true;
	}
	try {
		if (isAndroid()) {
			if (window[BRIDGE_NAME]) {
				return true;
			} else {
				alert("잘못된 접근입니다.\n앱 설치 후 이용해 주세요.");
				if (profile == 'PRD') {
					location.replace("/download.html?mode="+profile);
					return false;
				}
			}
		} else if (isIos()) {
			if (window.webkit.messageHandlers[BRIDGE_NAME]) {
				return true;
			} else {
				alert("잘못된 접근입니다.\n앱 설치 후 이용해 주세요.");
				if (profile == 'PRD') {
					location.replace("/download.html?mode="+profile);
					return false;
				}
			}
		} else {
			alert("잘못된 접근입니다.\n앱 설치 후 이용해 주세요.");
			if (profile == 'PRD') {
				location.replace("/download.html?mode="+profile);
				return false;
			} else {
				return true;
			}
		}
	} catch (e) {
		alert("잘못된 접근입니다.\n앱 설치 후 이용해 주세요.");
		if (profile == 'PRD') {
			location.replace("/download.html?mode="+profile);
			return false;
		}
		return true;
	}
}

