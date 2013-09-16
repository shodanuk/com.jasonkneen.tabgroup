var args = arguments[0] || {};

var helpers = require(WPATH("helpers"));

var tabBackgroundColor;

var subWins = [];

$.tab.backgroundSelectedColor = args.backgroundSelectedColor || "#fff";

if (args.view) {

	// custom view
	$.wrapper.add(args.view);

} else {

	// create our icon and caption
	var icon = Widget.createWidget(Widget.widgetId, "icon", args);
	var caption = Widget.createWidget(Widget.widgetId, "caption", args);

	// use default icon / caption
	$.wrapper.add(icon.getView());
	$.wrapper.add(caption.getView());

	$.tab.applyProperties({
		backgroundColor : args.backgroundColor || "transparent",
		backgroundImage : args.backgroundImage || null
	});

}

$.clickZone.addEventListener("click", function() {
	$.trigger("tab:click");
});

function setActive() {

	if (!args.selectedView) {

		$.tab.backgroundColor = $.tab.backgroundSelectedColor || $.tab.backgroundColor;

		icon.setActive();
		caption.setActive();

	} else {

		$.wrapper.add(args.selectedView);
		$.wrapper.remove(args.view);

	}

	if (args.win) {

		args.win.show();

		if (args.win.__navGroup) {
			args.win.__navGroup.show();
		}

		subWins.forEach(function(win) {
			win.show();
		});

	}
}

function setInactive() {

	if (!args.selectedView) {

		$.tab.backgroundColor = tabBackgroundColor;

		icon.setInactive();
		caption.setInactive();

	} else {

		$.wrapper.add(args.view);
		$.wrapper.remove(args.selectedView);

	}

	if (args.win) {

		args.win.hide();

		if (args.win.__navGroup) {
			args.win.__navGroup.hide();
		}

		subWins.forEach(function(win) {
			win.hide();
		});

	}
}

function open(subWindow) {

	if (OS_IOS) {

		args.win.__navGroup.open(subWindow);

	} else if (OS_ANDROID) {

		if (!args.settings.lightWeightMode) {
			subWindow.modal = subWindow.modal || false;
		} else {

			if (args.settings.tabsAtBottom) {
				subWindow.applyProperties({
					top : 0,
					bottom : args.settings.tabHeight
				});
			} else {
				subWindow.applyProperties({
					top : args.settings.tabHeight,
					bottom : 0
				});
			}

			if (!subWindow.leftNavButton) {
				subWindow.leftNavButton = Ti.UI.createButton({
					height : 38,
					title : "back"
				});
			}

			subWindow.leftNavButton.applyProperties({
				top : subWindow.leftNavButton.top || 5,
				left : subWindow.leftNavButton.left || 5,
				height : subWindow.leftNavButton.height || 38,
				width : subWindow.leftNavButton.width || 75
			});

			subWindow.leftNavButton.addEventListener("click", function() {
				close(subWindow);
			});

			subWindow.add(subWindow.leftNavButton);

			subWins.push(subWindow);

		}

		subWindow.open();

	} else {
		subWindow.open();
	}
}

function close(subWindow) {
	if (OS_IOS) {

		args.win.__navGroup.close(subWindow);

	} else if (OS_ANDROID) {

		if (args.settings.lightWeightMode) {

			subWins.pop();

		}

		subWindow.close();

		subWindow = null;

	} else {

		subWindow.close();

	}
}

exports.setInactive = setInactive;
exports.setActive = setActive;
exports.open = open;
exports.close = close;
