var rootWindow = arguments[0] || {};

var helpers = require(WPATH("helpers"));

var navGroup, activeTab, tabGroupWindow, tabs = [];
var isHidden = false;

// defaults
var settings = {
	captions : true,				// display captions
	tabHeight : OS_IOS ? 49 : 69,
	tabsAtBottom : true,
	tabGroup : {},
	tabs : {},
	lightWeightMode : false
};

// initialise the tabGroup Window
function init() {

	// hide the root window
	// before opening it
	rootWindow.visible = false;
	rootWindow.open();

	if(!settings.captions) 	settings.tabHeight -= 9;

	var config = {
		width : Ti.UI.FILL,
		height : settings.tabHeight,
		backgroundColor : 'blue'
	};

	if (!settings.tabsAtBottom) {
		//rootWindow.top = settings.tabHeight;
		config.top = 0;
	} else {
		//rootWindow.bottom = settings.tabHeight;
		config.bottom = 0;
	}

	// create our tab window to hold the tabs
	tabGroupWindow = Ti.UI.createWindow(config);


//  TODO  -  add tabs.close()  +  hook up back button to close tabs

if(OS_ANDROID){
    // Back Button
    tabGroupWindow.addEventListener('androidback', function() {
    	Ti.API.info('TO DO:  need to implement close tabs');
        // $.tabGroup.close();
    });
}


	// set top/bottom of root window
	// and position of tabgroup
}

function addTab(props) {

	// merge our defaults with the tab properties
	props = helpers.merge({

		backgroundSelectedColor : props.backgroundSelectedColor || settings.tabs.backgroundSelectedColor,
		font : props.font || settings.tabs.font,
		selectedFont : props.selectedFont || settings.tabs.selectedFont,
		selectedColor : props.selectedColor || settings.tabs.selectedColor,
		color : props.color || settings.tabs.color,
		settings : settings

	}, props);

	// create a new Tab instance
	var tab = Widget.createWidget(Widget.widgetId, "tab", props);

	// mark as active
	activeTab = activeTab || tab;

	// add to tabs collection
	tabs.push(tab);

	// if we have a window, configure and open it
	if (props.win) {

		tab.win = props.win;

		if (!settings.tabsAtBottom) {
			var extendTop = tab.win.extendEdges && _.contains(tab.win.extendEdges, Ti.UI.EXTEND_EDGE_TOP);
			tab.win.applyProperties({
				top : extendTop ? 0 : settings.tabHeight,
				bottom : 0
			});
			//tab.win.top = settings.tabHeight;

		} else {
			var extendBottom = tab.win.extendEdges && _.contains(tab.win.extendEdges, Ti.UI.EXTEND_EDGE_BOTTOM);
			tab.win.applyProperties({
				top : 0,
				bottom : extendBottom ? 0 : settings.tabHeight
			});
			//tab.win.bottom = settings.tabHeight;
		}

		tab.win.visible = false;

		if (OS_IOS) {

			navGroup = Ti.UI.iOS.createNavigationWindow({
				window : tab.win,
				visible : false
			});

			navGroup.open();
			tab.win.__navGroup = navGroup;
		}

		tab.win.open();

		tab.win.hide();

	}

	// user clicks this tab
	tab.on("tab:click", function() {

		if (tab !== activeTab) {

			tab.setActive();
			activeTab.setInactive();
			activeTab = tab;

		}

		$.trigger('tabs:focus', {
            tab: tab,
            index: _.indexOf(tabs, tab)
        });


	});

	// add the tab to the view
	$.tabGroup.add(tab.getView());
}

// used to set initial settings
function configure(args) {

	// copy over the tabs settings
    if ("undefined" !== typeof args.captions) {
        settings.captions = args.captions;
    }
	settings.tabs = args.tabs || {};

	if (!OS_IOS) {
		settings.tabsAtBottom = args.tabsAtBottom;
	}

	if (OS_ANDROID) {
		settings.lightWeightMode = args.lightWeightMode;
	}

	init();

	// set defaults for background color and images
	tabGroupWindow.backgroundColor = args.backgroundColor || "#000";
	tabGroupWindow.backgroundImage = args.backgroundImage || null;

}

function open() {
	// refresh the layout
	refresh();

	// add the tabs
	tabGroupWindow.add($.getView());

	// open the tabgroup window
	tabGroupWindow.open();

	// show the root window
	rootWindow.show();

	// set the default tab
	activeTab.setActive();

	// check for rotation, need to refresh
	Ti.Gesture.addEventListener("orientationchange", refresh);
}

function refresh() {

	// cache values to speed things up
	var deviceWidth = Ti.Platform.displayCaps.platformWidth;
	var tabCount = $.tabGroup.children.length;

	// iterate through the tabs and lay out
	$.tabGroup.children.forEach(function(tab) {

		// for some reason, issues with display caps on emulator so
		// %ages used for Android, absolute division for iOS
		if (OS_IOS) {
			tab.width = deviceWidth / tabCount;
		} else {
			tab.width = (99 / tabCount) + "%";
		}

	});
}

function getTabs() {
	return tabs;
}

function getActiveTab() {
	return activeTab;
}

function setActiveTab(t) {

	if (!isNaN(t)) {
		var tab = tabs[t];

		if (tab !== activeTab) {

			tab.setActive();
			activeTab.setInactive();
			activeTab = tab;

		}
	}
}

function hidden() {
	return isHidden;
}

function hide(animate) {
	isHidden = true;
	rootWindow.hide();
	animate ? tabGroupWindow.animate({ bottom: -tabGroupWindow.height, duration: 70, curve: Ti.UI.ANIMATION_CURVE_EASE_IN }) : tabGroupWindow.bottom = -tabGroupWindow.height;
}

function show(animate) {
	isHidden = false;
	rootWindow.show();
	animate ? tabGroupWindow.animate({ bottom: 0, duration: 80, curve: Ti.UI.ANIMATION_CURVE_EASE_OUT }) : tabGroupWindow.bottom = 0;
}

exports.configure = configure;
exports.init = init;
exports.open = open;
exports.refresh = refresh;
exports.addTab = addTab;
exports.getActiveTab = getActiveTab;
exports.setActiveTab = setActiveTab;
exports.hidden = hidden;
exports.hide = hide;
exports.show = show;
