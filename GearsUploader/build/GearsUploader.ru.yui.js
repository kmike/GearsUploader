Element.implement({hide:function(){var b;try{if((b=this.getStyle("display"))=="none"){b=null}}catch(a){}return this.store("originalDisplay",b||"block").setStyle("display","none")},show:function(a){return this.setStyle("display",a||this.retrieve("originalDisplay")||"block")}});var ProgressBar=new Class({Implements:[Events,Options],options:{container:document.body,boxID:"progress-bar-box-id",percentageID:"progress-bar-percentage-id",displayID:"progress-bar-display-id",startPercentage:0,displayText:false,speed:10,step:1,allowMore:false},initialize:function(a){this.setOptions(a);this.options.container=$(this.options.container);this.createElements()},createElements:function(){var b=new Element("div",{id:this.options.boxID});var a=new Element("div",{id:this.options.percentageID,style:"width:0px;"});a.inject(b);b.inject(this.options.container);if(this.options.displayText){var c=new Element("div",{id:this.options.displayID});c.inject(this.options.container)}this.set(this.options.startPercentage)},calculate:function(a){return($(this.options.boxID).getStyle("width").replace("px","")*(a/100)).toInt()},animate:function(b){var c=false;var a=this;if(!a.options.allowMore&&b>100){b=100}a.to=b.toInt();$(a.options.percentageID).set("morph",{duration:this.options.speed,link:"cancel",onComplete:function(){a.fireEvent("change",[a.to]);if(b>=100){a.fireEvent("complete",[a.to])}}}).morph({width:a.calculate(b)});if(a.options.displayText){$(a.options.displayID).set("text",a.to+"%")}},set:function(a){this.animate(a)},step:function(){this.set(this.to+this.options.step)}});(function(){if(window.google&&google.gears){return}var a=null;if(typeof GearsFactory!="undefined"){a=new GearsFactory()}else{try{a=new ActiveXObject("Gears.Factory");if(a.getBuildInfo().indexOf("ie_mobile")!=-1){a.privateSetGlobalObject(this)}}catch(b){if((typeof navigator.mimeTypes!="undefined")&&navigator.mimeTypes["application/x-googlegears"]){a=document.createElement("object");a.style.display="none";a.width=0;a.height=0;a.type="application/x-googlegears";document.documentElement.appendChild(a)}}}if(!a){return}if(!window.google){google={}}if(!google.gears){google.gears={factory:a}}})();var GearsMultipartForm=function(c){this.options={onprogress:function(){},onreadystatechange:function(){},files:{},fields:{}};var b=this;var a=function(){for(opt in c){b.options[opt]=c[opt]}};a();this.buildData=function(d){var l="\r\n";var j=google.gears.factory.create("beta.blobbuilder");var m=this;function f(i,n){j.append("--"+d+l);j.append(m.getContentDispositionHeader(i)+l);j.append(l);j.append(n);j.append(l)}function g(i,n){j.append("--"+d+l);j.append(m.getContentDispositionHeader(i,n.name)+l);var o="application/octet-stream";if("mime" in n){o=n.mime}j.append("Content-Type: "+o+l+l);j.append(n.blob);j.append(l)}for(name in this.options.fields){var k=this.options.fields[name];if(k.constructor!=Array){k=[k]}for(var h=0;h<k.length;h++){f(name,k[h])}}for(name in this.options.files){var e=this.options.files[name];g(name,e)}j.append("--"+d+"--"+l);return j.getAsBlob()};this.getContentDispositionHeader=function(e,d){var f='Content-Disposition: form-data; name="'+e+'"';if(d){f=f+'; filename="'+d+'"'}return f};this.getContentTypeHeader=function(d){if(d==null){d="text/plain"}return"Content-Type:"+d+this.crlf};this.generateBoundary=function(){function d(e){var j="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";var h="";for(var g=0;g<e;g++){var f=Math.floor(Math.random()*j.length);h+=j.substring(f,f+1)}return h}return"-------------------------"+d(24)};this.post=function(d){var e=this.generateBoundary();this.request=google.gears.factory.create("beta.httprequest");this.request.upload.onprogress=this.options.onprogress;this.request.onreadystatechange=this.options.onreadystatechange;this.request.open("POST",d);this.request.setRequestHeader("content-type","multipart/form-data; boundary="+e);this.request.setRequestHeader("X-Requested-With","XMLHttpRequest");this.request.send(this.buildData(e))}};var GearsUploader=new Class({Implements:[Options,Events],options:{progressBar:null,statusElement:null,statuses:{},verboseProcessing:true,queueProcessing:true,uploadHandler:"upload-handler",selectHandler:"select-handler",fileOpenOptions:{singleFile:false},url:".",fileElementName:"file",formElement:null,hideUploadHandler:true,onUploadUninitialized:function(){this.setStatus("stateUninitialized")},onUploadOpen:function(){this.setStatus("stateOpen")},onUploadSent:function(){this.setStatus("stateSent")},onUploadInteractive:function(){this.setStatus("stateInteractive")},onUploadComplete:function(){this.setStatus("stateComplete")}},initialize:function(a){this.setOptions(a);this.files=[];this.alreadyUploaded=false;this.attachHandlers();this.setStatus("noFiles")},getFileElementName:function(a){return this.options.fileElementName+a},getFormFiles:function(){var b={};for(var a=0;a<this.files.length;a++){b[this.getFileElementName(a)]=this.files[a]}return b},getExistingFormFields:function(){if(this.options.formElement==null){return{}}var b=$(this.options.formElement);if(!b){return{}}var a={};b.getElements("input, textarea").each(function(c){if(c.name&&c.value!=""){a[c.name]=c.value}});b.getElements("select").each(function(d){var c=[];$each(d.options,function(e){if(e.selected){c.push(e.value)}});if(c){a[d.name]=c}});return a},getFormFields:function(){return this.getExistingFormFields()},handleFile:function(a){this.files.push(a)},handleFilesOpen:function(c){var a=this;if(this.options.queueProcessing){function b(d){if(a.options.verboseProcessing){a.setStatus("processing"," ("+(d+1)+"/"+c.length+")")}else{a.setStatus("processing")}setTimeout(function(){a.handleFile(c[d]);if(d<c.length-1){b(d+1)}else{a.setStatus("selected");$(a.options.uploadHandler).show()}},0)}b(0)}else{a.setStatus("processing");c.each(function(e,d){a.handleFile(e)});a.setStatus("selected");$(a.options.uploadHandler).show()}},attachHandlers:function(){var a=this;$(a.options.selectHandler).addEvent("click",function(b){b.stop();var c=google.gears.factory.create("beta.desktop");c.openFiles(function(d){if(!d.length){return}a.alreadyUploaded=false;a.hideProgressBar();a.handleFilesOpen(d)},a.options.fileOpenOptions)});$(a.options.uploadHandler).addEvent("click",function(c){c.stop();if(a.alreadyUpladed){a.setStatus("alreadyUploaded");return}if(!a.files.length){return}a.showProgressBar();a.setProgressNow(0);var b=new GearsMultipartForm({files:a.getFormFiles(),fields:a.getFormFields(),onprogress:function(d){if(d.lengthComputable){a.setProgress(d.loaded/d.total*100)}},onreadystatechange:function(){switch(b.request.readyState){case 0:a.fireEvent("uploadUninitialized");break;case 1:a.fireEvent("uploadOpen");break;case 2:a.fireEvent("uploadSent");break;case 3:a.fireEvent("uploadInteractive");break;case 4:a.fireEvent("uploadComplete");a.alreadyUploaded=true;break}}});b.post(a.options.url)});if(a.options.hideUploadHandler){$(a.options.uploadHandler).hide()}},setRawStatus:function(a){if(this.options.statusElement){$(this.options.statusElement).set("html",a)}},setStatus:function(b,a){if(!a){a=""}if(b in this.options.statuses){this.setRawStatus(this.options.statuses[b]+a)}else{this.setRawStatus(b+a)}},showProgressBar:function(){if(this.options.progressBar){$(this.options.progressBar.options.container).show()}},hideProgressBar:function(){if(this.options.progressBar){$(this.options.progressBar.options.container).hide()}},setProgress:function(a){if(this.options.progressBar){this.options.progressBar.set(a)}},setProgressNow:function(b){if(this.options.progressBar){var a=this.options.progressBar;a.to=b.toInt();$(a.options.percentageID).setStyle("width",a.calculate(a.to));if(a.options.displayText){$(a.options.displayID).set("text",a.to+"%")}}}});var GearsSingleFileUploader=new Class({Extends:GearsUploader,options:{verboseProcessing:false,fileOpenOptions:{singleFile:true},statuses:{}},getFileElementName:function(a){return this.options.fileElementName}});var GearsImageUtilsMixin=new Class({canvasFromBlob:function(a,c){var b=google.gears.factory.create("beta.canvas");b.decode(a);if(c){this.makeThumbnail(b,c)}return b},makeThumbnail:function(b,e){var a=b.width;var d=b.height;var c=d/a;if(e<a){a=e;d=a*c}b.resize(parseInt(a),parseInt(d))},blobFromCanvas:function(a,b){return a.encode("image/jpeg",{quality:b})},imgFromBlob:function(b,d){var e=google.gears.factory.create("beta.localserver");var a=e.createStore("store");var c=c?c:"/image"+Math.random()+".jpg?";a.captureBlob(b,c,"image/jpeg");$(d).setProperty("src",c);setTimeout(function(){a.remove(c)},1000)}});var GearsImageUploader=new Class({Extends:GearsUploader,Implements:GearsImageUtilsMixin,options:{statuses:{},maxWidth:600,previewWidth:null,quality:0.9,fileOpenOptions:{filter:["image/jpeg","image/png"],singleFile:false},previewsElement:"gears-previews",fileElementName:"image",onUploadComplete:function(){this.files.each(function(a){a.img.dispose()});this.files=[];this.setStatus("stateComplete")}},injectImage:function(a){var b=$(this.options.previewsElement);if(b){a.inject(b,"top")}return a},handleFile:function(f){var e=this.canvasFromBlob(f.blob,this.options.maxWidth);var d=this.blobFromCanvas(e);var a=e;var g=d;if(this.options.previewWidth){this.makeThumbnail(a,this.options.previewWidth);g=this.blobFromCanvas(a)}var c=this;var b=new Element("img",{events:{click:function(){c.files=c.files.filter(function(h){return h.img!=b});b.dispose();if(!c.files.length){c.setStatus("noFiles")}}}});b=this.injectImage(b);this.imgFromBlob(g,b);this.files.push({name:f.name,blob:d,img:b})}});var GearsSingleImageUploader=new Class({Extends:GearsImageUploader,options:{verboseProcessing:false,fileElementName:"image",statuses:{},fileOpenOptions:{filter:["image/jpeg","image/png"],singleFile:true},onUploadComplete:function(){this.files=[];this.setStatus("stateComplete")}},getFileElementName:function(a){return this.options.fileElementName},injectImage:function(a){var b=$(this.options.previewsElement);if(b){b.src=a.src;return $(this.options.previewsElement)}return a}});var DjangoFormsetMixin=new Class({options:{formsetPrefix:"form"},getManagementFields:function(){var b=this.options.formsetPrefix;var a={};a[b+"-INITIAL_FORMS"]="0";a[b+"-TOTAL_FORMS"]=this.files.length.toString();return a},getFormFiles:function(){var d={};var a=this.options.formsetPrefix+"-";var b="-"+this.options.fileElementName;for(var c=0;c<this.files.length;c++){d[a+c+b]=this.files[c]}return d},getFormFields:function(){return $merge(this.getExistingFormFields(),this.getManagementFields())}});var DjangoUploader=new Class({Extends:GearsUploader,Implements:DjangoFormsetMixin});if(window.GearsImageUploader){var DjangoImageUploader=new Class({Extends:GearsImageUploader,Implements:DjangoFormsetMixin})}if(window.GearsUploader){GearsUploader.implement("options",{statuses:{noFiles:"Ни одного файла не выбрано.",alreadyUploaded:"Эти файлы уже были загружены.",processing:"Обработка файлов..",selected:"Файлы подготовлены к загрузке.",stateUninitialized:"Подготовка..",stateOpen:"Идет загрузка файлов..",stateSent:"Файлы отправлены, ждем ответ сервера..",stateInteractive:"Получаем ответ сервера..",stateComplete:"Файлы загружены."}})}if(window.GearsSingleFileUploader){GearsSingleFileUploader.implement("options",{statuses:{noFiles:"Файл не выбран.",alreadyUploaded:"Этот файл уже был загружен.",processing:"Обработка..",selected:"Файл готов к загрузке.",stateUninitialized:"Подготовка..",stateOpen:"Идет загрузка файла..",stateSent:"Файл отправлен, ждем ответ сервера..",stateInteractive:"Получаем ответ сервера..",stateComplete:"Файл загружен на сервер."}})}if(window.GearsImageUploader){GearsImageUploader.implement("options",{statuses:{noFiles:"Ни одного файла не выбрано.",alreadyUploaded:"Эти файлы уже были загружены.",processing:"Обработка изображений..",selected:"Изображения готовы к загрузке.",stateUninitialized:"Подготовка..",stateOpen:"Идет загрузка файлов..",stateSent:"Файлы отправлены, ждем ответ сервера..",stateInteractive:"Получаем ответ сервера..",stateComplete:"Изображения загружены."}})}if(window.GearsSingleImageUploader){GearsSingleImageUploader.implement("options",{statuses:{noFiles:"Изображение не выбрано.",alreadyUploaded:"Это изображение уже было загружено.",processing:"Обработка изображения..",selected:"Изображение готово к загрузке.",stateUninitialized:"Подготовка..",stateOpen:"Идет загрузка изображения..",stateSent:"Файл отправлен, ждем ответ сервера..",stateInteractive:"Получаем ответ сервера..",stateComplete:"Изображение загружено."}})};