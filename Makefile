YUI = ~/dev/yuicompressor-2.4.2.jar --charset=UTF-8
BUILD = GearsUploader/build

ProgressBar = GearsUploader/external/ProgressBar.js 
GearsInit = GearsUploader/external/gears_init.js
MooMore = GearsUploader/external/Element.Shortcuts.js

GearsUploader = GearsUploader/GearsMultipartForm.js GearsUploader/GearsUploader.js GearsUploader/GearsImageUploader.js GearsUploader/DjangoUploader.js
Complete = $(MooMore) $(ProgressBar) $(GearsInit) $(GearsUploader)

all: cleanup ru-complete en-complete prepare-examples

cleanup:
	rm $(BUILD)/*

ru-complete: $(Complete) GearsUploader/Localization/ru.js
	cat $+ > $(BUILD)/GearsUploader.ru.js 
	java -jar $(YUI) $(BUILD)/GearsUploader.ru.js > $(BUILD)/GearsUploader.ru.yui.js 
	
en-complete: $(Complete) GearsUploader/Localization/en.js
	cat $+ > GearsUploader/build/GearsUploader.en.js
	java -jar $(YUI) $(BUILD)/GearsUploader.en.js > $(BUILD)/GearsUploader.en.yui.js

prepare-examples: ru-complete en-complete
	cp $(BUILD)/GearsUploader.en.js examples/django_example/static/js
	