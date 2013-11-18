// __parentSymbol is the host window
var tabs = Widget.createWidget(Widget.widgetId, "tabs", __parentSymbol);

// methods
exports.addTab = tabs.addTab;
exports.open = tabs.open;
exports.configure = tabs.configure;
exports.getActiveTab = tabs.getActiveTab;
exports.setActiveTab = tabs.setActiveTab;
exports.hide = tabs.hide;
exports.show = tabs.show;

// properties
Object.defineProperty($, "activeTab", {
	get : tabs.getActiveTab,
	set : tabs.setActiveTab
});

Object.defineProperty($, "hidden", {
	get : tabs.hidden,
});

// events
tabs.on('tabs:focus', function(e){
   $.trigger('focus', e); 
});
