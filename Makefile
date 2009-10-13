YUI = ~/dev/yuicompressor-2.4.2.jar --charset=UTF-8
BUILD = GearsUploader/build

ProgressBar = GearsUploader/ProgressBar.js 
GearsUploader = GearsUploader/GearsMultipartForm.js GearsUploader/GearsUploader.js GearsUploader/GearsImageUploader.js GearsUploader/DjangoUploader.js
Complete = $(ProgressBar) GearsUploader/gears_init.js $(GearsUploader)

all: cleanup ru-complete en-complete

cleanup:
	rm $(BUILD)/*

ru-complete: $(Complete) GearsUploader/Localization/ru.js
	cat $+ > $(BUILD)/GearsUploader.ru.js 
	java -jar $(YUI) $(BUILD)/GearsUploader.ru.js > $(BUILD)/GearsUploader.ru.yui.js 
    
en-complete: $(Complete) GearsUploader/Localization/en.js
	cat $+ > GearsUploader/build/GearsUploader.en.js
	java -jar $(YUI) $(BUILD)/GearsUploader.en.js > $(BUILD)/GearsUploader.en.yui.js

