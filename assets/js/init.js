var deviceReady = false;
var initCalled = false;
var initialized = false;

function onBodyLoad() {
    if(typeof window.device === 'undefined') {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
}

function isLivePreview() {
    return (window.location.pathname.indexOf("\/livepreview") === 0);
}

function onDeviceReady() {
    deviceReady = true;
    if(initCalled === true)
        initializeCP();
}

function isLivePreviewDirty() {
    var reqUrl = window.location.protocol + "//" + window.location.host + "/livepreview/isLivePreviewDirty?folder=" + cp.previewFolder;
    var request = new XMLHttpRequest();
    request.open('GET', reqUrl);
    request.responseType = 'text';
    request.onload = function() {
        var response = JSON.parse(request.response);
        if(response.isDirty == false) {
            return;
        }
        window.location.href = window.location.protocol + "//" + window.location.host + "/livepreview/" + response.folder + "/index.html";
    };
    request.send();
}

function initializeCP() {
    if(initialized)
        return;
    initCalled = true;
    if(cp.pg && deviceReady === false)
        return;

    function cpInit() {
        document.body.innerHTML = " <div class='cpMainContainer' id='cpDocument' style='left: 0px; top:0px;' >	<div id='main_container' style='top:0px;position:absolute;'>	<div id='projectBorder' style='top:0px;left:0px;position:absolute;display:block'></div>	<div class='shadow' id='project_container' style='left: 0px; top:0px;position:absolute;' >	<div id='project' class='cp-movie' style='width:1018px ;height:627px '>		<div id='project_main' class='cp-timeline cp-main'>			<div id='div_Slide' onclick='cp.handleClick(event)' style='top:0px; width:1018px ;height:627px ;position:absolute;-webkit-tap-highlight-color: rgba(0,0,0,0);'></div>			<canvas id='slide_transition_canvas'></canvas>		</div>		<div id='autoplayDiv' style='display:block;text-align:center;position:absolute;left:0px;top:0px;'>			<img id='autoplayImage' src='' style='position:absolute;display:block;vertical-align:middle;'/>			<div id='playImage' tabindex='9999' role='button' aria-label='play' onkeydown='cp.CPPlayButtonHandle(event)' onClick='cp.movie.play()' style='position:absolute;display:block;vertical-align:middle;'></div>		</div>		<div id='cc' style='left:0px; float:left;position:absolute;visibility:hidden;pointer-events:none;' onclick='cp.handleCCClick(event)'>			<div id='ccText' style='left:0px;float:left;position:absolute;width:100%;height:100%;'>			<p style='margin-left:8px;margin-right:8px;margin-top:2px;'>			</p>			</div>			<div id='ccClose' style='background-image:url(./assets/htmlimages/ccClose.png);right:0px; float:right;position:absolute;cursor:pointer;width:13px;height:11px;' onclick='cp.showHideCC()'>			</div>		</div>	</div>	<div id='toc' style='left:0px; float:left;position:absolute;-webkit-tap-highlight-color: rgba(0,0,0,0);'>	</div>	<div id='playbar' style='left:0px; float:left;position:absolute'>	</div>	<div id='gestureIcon' class='gestureIcon'>	</div>	<div id='gestureHint' class='gestureHintDiv'>		<div id='gImage' class='gesturesHint'></div>	</div>	<div id='pwdv' style='display:block;text-align:center;position:absolute;width:100%;height:100%;left:0px;top:0px'></div>	<div id='exdv' style='display:block;text-align:center;position:absolute;width:100%;height:100%;left:0px;top:0px'></div>	</div>	</div></div><div id='blockUserInteraction' class='blocker' style='width:100%;height:100%;'>	<table style='width:100%;height:100%;text-align:center;vertical-align:middle' id='loading' class='loadingBackground'>		<tr style='width:100%;height:100%;text-align:center;vertical-align:middle'>			<td style='width:100%;height:100%;text-align:center;vertical-align:middle'>				<image id='preloaderImage'></image>				<div id='loadingString' class='loadingString'>Chargement...</div>			</td>		</tr>	</table></div> <div id='initialLoading'></div>";
        cp.DoCPInit();
        var lCpExit = window["DoCPExit"];
        window["DoCPExit"] = function() {
            if(cp.UnloadActivties)
                cp.UnloadActivties();
            lCpExit();
        };

        if(window.CPYTAPINeeded) {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.getElementsByTagName('head')[0].appendChild(tag);
        }

        if(window.CPVimeoAPINeeded) {
            var tag = document.createElement('script');
            tag.src = "https://player.vimeo.com/api/player.js";
            document.getElementsByTagName('head')[0].appendChild(tag);
        }
    }
    
    cpInit();
    initialized = true;
    if(isLivePreview() === true) {	
        cp.previewFolder = window.location.href.split("\/")[4];
        setInterval(isLivePreviewDirty, 1000);
    }
}

// Load required resources
window.addEventListener("load", function() {
    setTimeout(function() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'assets/js/CPXHRLoader.js';
        script.defer = 'defer';
        script.onload = function() {
            var lCSSLoaded = false;
            var lJSLoaded = false;
            function constructDIVs() {
                if(lCSSLoaded && lJSLoaded) {
                    initializeCP();
                }
            }
            cpXHRJSLoader.css('assets/css/CPLibraryAll.css',function() {
                lCSSLoaded = true;
                constructDIVs();
            });
            var lJSFiles = ['assets/js/jquery-3.3.1.min.js','assets/js/CPM.js'];
            cpXHRJSLoader.js(lJSFiles,function() {
                var imagesJSONFiles = ['dr/imgmd.json'];
                cpXHRJSLoader.loadImagesJSON(imagesJSONFiles,function(imageToJSONPathMap) {
                    cp.imageToJSONPathMap = imageToJSONPathMap;
                    var imageJSONFiles = ['dr/img1.json','dr/img2.json','dr/img3.json'];
                    if(window.location.protocol.substr(0,4) == "file")
                        cpXHRJSLoader.preloadURLs(imageJSONFiles, constructDIVs);
                    lJSLoaded = true;
                    if(window.location.protocol.substr(0,4) != "file" || !imageJSONFiles.length)
                        constructDIVs();
                });
            });
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    }, 1);
}, false); 