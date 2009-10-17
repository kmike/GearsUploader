Element.implement({hide:function(){var b;try{if((b=this.getStyle("display"))=="none"){b=null}}catch(a){}return this.store("originalDisplay",b||"block").setStyle("display","none")},show:function(a){return this.setStyle("display",a||this.retrieve("originalDisplay")||"block")}});(function(a){this.ProgressBar=new Class({Implements:[Events,Options],options:{container:document.body,boxID:"progress-bar-box-id",percentageID:"progress-bar-percentage-id",displayID:"progress-bar-display-id",startPercentage:0,displayText:false,speed:10,step:1,allowMore:false},initialize:function(b){this.setOptions(b);this.options.container=a(this.options.container);this.createElements()},createElements:function(){var c=new Element("div",{id:this.options.boxID});var b=new Element("div",{id:this.options.percentageID,style:"width:0px;"});b.inject(c);c.inject(this.options.container);if(this.options.displayText){var d=new Element("div",{id:this.options.displayID});d.inject(this.options.container)}this.set(this.options.startPercentage)},calculate:function(b){return(a(this.options.boxID).getStyle("width").replace("px","")*(b/100)).toInt()},animate:function(c){var d=false;var b=this;if(!b.options.allowMore&&c>100){c=100}b.to=c.toInt();a(b.options.percentageID).set("morph",{duration:this.options.speed,link:"cancel",onComplete:function(){b.fireEvent("change",[b.to]);if(c>=100){b.fireEvent("complete",[b.to])}}}).morph({width:b.calculate(c)});if(b.options.displayText){a(b.options.displayID).set("text",b.to+"%")}},set:function(b){this.animate(b)},step:function(){this.set(this.to+this.options.step)}})})(document.id);(function(){if(window.google&&google.gears){return}var a=null;if(typeof GearsFactory!="undefined"){a=new GearsFactory()}else{try{a=new ActiveXObject("Gears.Factory");if(a.getBuildInfo().indexOf("ie_mobile")!=-1){a.privateSetGlobalObject(this)}}catch(b){if((typeof navigator.mimeTypes!="undefined")&&navigator.mimeTypes["application/x-googlegears"]){a=document.createElement("object");a.style.display="none";a.width=0;a.height=0;a.type="application/x-googlegears";document.documentElement.appendChild(a)}}}if(!a){return}if(!window.google){google={}}if(!google.gears){google.gears={factory:a}}})();var GearsMultipartForm=function(c){this.options={onprogress:function(){},onreadystatechange:function(){},files:{},fields:{}};var b=this;var a=function(){for(opt in c){b.options[opt]=c[opt]}};a();this.buildData=function(d){var l="\r\n";var j=google.gears.factory.create("beta.blobbuilder");var m=this;function f(i,n){j.append("--"+d+l);j.append(m.getContentDispositionHeader(i)+l);j.append(l);j.append(n);j.append(l)}function g(i,n){j.append("--"+d+l);j.append(m.getContentDispositionHeader(i,n.name)+l);var o="application/octet-stream";if("mime" in n){o=n.mime}j.append("Content-Type: "+o+l+l);j.append(n.blob);j.append(l)}for(name in this.options.fields){var k=this.options.fields[name];if(k.constructor!=Array){k=[k]}for(var h=0;h<k.length;h++){f(name,k[h])}}for(name in this.options.files){var e=this.options.files[name];g(name,e)}j.append("--"+d+"--"+l);return j.getAsBlob()};this.getContentDispositionHeader=function(e,d){var f='Content-Disposition: form-data; name="'+e+'"';if(d){f=f+'; filename="'+d+'"'}return f};this.getContentTypeHeader=function(d){if(d==null){d="text/plain"}return"Content-Type:"+d+this.crlf};this.generateBoundary=function(){function d(e){var j="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";var h="";for(var g=0;g<e;g++){var f=Math.floor(Math.random()*j.length);h+=j.substring(f,f+1)}return h}return"-------------------------"+d(24)};this.post=function(d){var e=this.generateBoundary();this.request=google.gears.factory.create("beta.httprequest");this.request.upload.onprogress=this.options.onprogress;this.request.onreadystatechange=this.options.onreadystatechange;this.request.open("POST",d);this.request.setRequestHeader("content-type","multipart/form-data; boundary="+e);this.request.setRequestHeader("X-Requested-With","XMLHttpRequest");this.request.send(this.buildData(e))}};(function(a){this.GearsUploader=new Class({Implements:[Options,Events],options:{progressBar:null,statusElement:null,statuses:{},verboseProcessing:true,queueProcessing:true,uploadHandler:"upload-handler",selectHandler:"select-handler",fileOpenOptions:{singleFile:false},url:".",fileElementName:"file",formElement:null,hideUploadHandler:true,onUploadUninitialized:function(){this.setStatus("stateUninitialized")},onUploadOpen:function(){this.setStatus("stateOpen")},onUploadSent:function(){this.setStatus("stateSent")},onUploadInteractive:function(){this.setStatus("stateInteractive")},onUploadComplete:function(){this.setStatus("stateComplete")},onBeforeProcess:$empty,onAfterProcess:$empty,onBeforeUpload:$empty},initialize:function(b){this.setOptions(b);this.files=[];this.alreadyUploaded=false;this.attachHandlers();this.setStatus("noFiles")},getFileElementName:function(b){return this.options.fileElementName+b},getFormFiles:function(){var c={};for(var b=0;b<this.files.length;b++){c[this.getFileElementName(b)]=this.files[b]}return c},getExistingFormFields:function(){if(this.options.formElement==null){return{}}var c=a(this.options.formElement);if(!c){return{}}var b={};c.getElements("input, textarea").each(function(d){if(d.name&&d.value!=""){b[d.name]=d.value}});c.getElements("select").each(function(e){var d=[];$each(e.options,function(f){if(f.selected){d.push(f.value)}});if(d){b[e.name]=d}});return b},getFormFields:function(){return this.getExistingFormFields()},handleFile:function(b){this.files.push(b)},handleFilesOpen:function(d){var b=this;b.fireEvent("beforeProcess");if(this.options.queueProcessing){function c(e){if(b.options.verboseProcessing){b.setStatus("processing"," ("+(e+1)+"/"+d.length+")")}else{b.setStatus("processing")}setTimeout(function(){b.handleFile(d[e]);if(e<d.length-1){c(e+1)}else{b.setStatus("selected");a(b.options.uploadHandler).show()}},0)}c(0)}else{b.setStatus("processing");d.each(function(f,e){b.handleFile(f)});b.setStatus("selected");a(b.options.uploadHandler).show();b.fireEvent("afterProcess")}},attachHandlers:function(){var c=this;a(c.options.selectHandler).addEvent("click",function(d){d.stop();var e=google.gears.factory.create("beta.desktop");e.openFiles(function(f){if(!f.length){return}c.alreadyUploaded=false;c.hideProgressBar();c.handleFilesOpen(f)},c.options.fileOpenOptions)});var b=a(c.options.uploadHandler);b.store("originalDisplay",b.getStyle("display"));b.addEvent("click",function(e){e.stop();if(c.alreadyUpladed){c.setStatus("alreadyUploaded");return}if(!c.files.length){return}c.showProgressBar();c.setProgressNow(0);var d=new GearsMultipartForm({files:c.getFormFiles(),fields:c.getFormFields(),onprogress:function(f){if(f.lengthComputable){c.setProgress(f.loaded/f.total*100)}},onreadystatechange:function(){switch(d.request.readyState){case 0:c.fireEvent("uploadUninitialized");break;case 1:c.fireEvent("uploadOpen");break;case 2:c.fireEvent("uploadSent");break;case 3:c.fireEvent("uploadInteractive");break;case 4:c.fireEvent("uploadComplete");c.alreadyUploaded=true;break}}});c.fireEvent("beforeUpload");d.post(c.options.url)});if(c.options.hideUploadHandler){b.hide()}},setRawStatus:function(b){if(this.options.statusElement){a(this.options.statusElement).set("html",b)}},setStatus:function(c,b){if(!b){b=""}if(c in this.options.statuses){this.setRawStatus(this.options.statuses[c]+b)}else{this.setRawStatus(c+b)}},showProgressBar:function(){if(this.options.progressBar){a(this.options.progressBar.options.container).show()}},hideProgressBar:function(){if(this.options.progressBar){a(this.options.progressBar.options.container).hide()}},setProgress:function(b){if(this.options.progressBar){this.options.progressBar.set(b)}},setProgressNow:function(c){if(this.options.progressBar){var b=this.options.progressBar;b.to=c.toInt();a(b.options.percentageID).setStyle("width",b.calculate(b.to));if(b.options.displayText){a(b.options.displayID).set("text",b.to+"%")}}}});this.GearsSingleFileUploader=new Class({Extends:GearsUploader,options:{verboseProcessing:false,fileOpenOptions:{singleFile:true},statuses:{}},getFileElementName:function(b){return this.options.fileElementName}})})(document.id);(function(a){this.GearsImageUtilsMixin=new Class({canvasFromBlob:function(b,d){var c=google.gears.factory.create("beta.canvas");c.decode(b);if(d){this.makeThumbnail(c,d)}return c},makeThumbnail:function(c,f){var b=c.width;var e=c.height;var d=e/b;if(f<b){b=f;e=b*d}c.resize(parseInt(b),parseInt(e))},blobFromCanvas:function(b,c){return b.encode("image/jpeg",{quality:c})},imgFromBlob:function(c,e){var f=google.gears.factory.create("beta.localserver");var b=f.createStore("store");var d=d?d:"/image"+Math.random()+".jpg?";b.captureBlob(c,d,"image/jpeg");a(e).setProperty("src",d);setTimeout(function(){b.remove(d)},1000)}});this.GearsImageUploader=new Class({Extends:GearsUploader,Implements:GearsImageUtilsMixin,options:{statuses:{},maxWidth:600,previewWidth:null,quality:0.9,fileOpenOptions:{filter:["image/jpeg","image/png"],singleFile:false},previewsElement:"gears-previews",fileElementName:"image",onUploadComplete:function(){this.files.each(function(b){b.img.dispose()});this.files=[];this.setStatus("stateComplete")}},injectImage:function(b){var c=a(this.options.previewsElement);if(c){b.inject(c,"top")}return b},handleFile:function(g){var f=this.canvasFromBlob(g.blob,this.options.maxWidth);var e=this.blobFromCanvas(f);var b=f;var h=e;if(this.options.previewWidth){this.makeThumbnail(b,this.options.previewWidth);h=this.blobFromCanvas(b)}var d=this;var c=new Element("img",{events:{click:function(){d.files=d.files.filter(function(i){return i.img!=c});c.dispose();if(!d.files.length){d.setStatus("noFiles")}}}});c=this.injectImage(c);this.imgFromBlob(h,c);this.files.push({name:g.name,blob:e,img:c})}});this.GearsSingleImageUploader=new Class({Extends:GearsImageUploader,options:{verboseProcessing:false,fileElementName:"image",statuses:{},fileOpenOptions:{filter:["image/jpeg","image/png"],singleFile:true},onUploadComplete:function(){this.files=[];this.setStatus("stateComplete")}},getFileElementName:function(b){return this.options.fileElementName},injectImage:function(b){var c=a(this.options.previewsElement);if(c){c.src=b.src;return a(this.options.previewsElement)}return b}})})(document.id);(function(a){this.DjangoFormsetMixin=new Class({options:{formsetPrefix:"form"},getManagementFields:function(){var c=this.options.formsetPrefix;var b={};b[c+"-INITIAL_FORMS"]="0";b[c+"-TOTAL_FORMS"]=this.files.length.toString();return b},getFormFiles:function(){var e={};var b=this.options.formsetPrefix+"-";var c="-"+this.options.fileElementName;for(var d=0;d<this.files.length;d++){e[b+d+c]=this.files[d]}return e},getFormFields:function(){return $merge(this.getExistingFormFields(),this.getManagementFields())}});this.DjangoUploader=new Class({Extends:GearsUploader,Implements:DjangoFormsetMixin});if(window.GearsImageUploader){this.DjangoImageUploader=new Class({Extends:GearsImageUploader,Implements:DjangoFormsetMixin})}})(document.id);if(window.GearsUploader){GearsUploader.implement("options",{statuses:{noFiles:"Please select some files to upload.",alreadyUploaded:"Files was already uploaded.",processing:"Processing files..",selected:"Files are selected.",stateUninitialized:"Initializing..",stateOpen:"Uploading files..",stateSent:"Files are uploaded, waiting for server response..",stateInteractive:"Reading server response..",stateComplete:"Files are uploaded."}})}if(window.GearsSingleFileUploader){GearsSingleFileUploader.implement("options",{statuses:{noFiles:"Please select file to upload.",alreadyUploaded:"File was already uploaded.",processing:"Processing file..",selected:"File is selected.",stateUninitialized:"Initializing..",stateOpen:"File is being uploaded..",stateSent:"File is uploaded, waiting for server response..",stateInteractive:"Reading server response..",stateComplete:"File is uploaded."}})}if(window.GearsImageUploader){GearsImageUploader.implement("options",{statuses:{noFiles:"Please select some files to upload.",alreadyUploaded:"Images was already uploaded.",processing:"Processing images..",selected:"Images are selected.",stateUninitialized:"Initializing..",stateOpen:"Uploading images..",stateSent:"Images are uploaded, waiting for server response..",stateInteractive:"Reading server response..",stateComplete:"Images are uploaded."}})}if(window.GearsSingleImageUploader){GearsSingleImageUploader.implement("options",{statuses:{noFiles:"Image is not selected.",alreadyUploaded:"This image is already uploaded.",processing:"Processing an image..",selected:"Image is selected.",stateUninitialized:"Initializing..",stateOpen:"Uploading image..",stateSent:"Waiting for server response..",stateInteractive:"Reading server response..",stateComplete:"Image is uploaded."}})};