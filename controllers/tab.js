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
	$.wrapper.add(icon.getView());

	if (args.settings.captions) {
		var caption = Widget.createWidget(Widget.widgetId, "caption", args);
		$.wrapper.add(caption.getView());
	}

	$.tab.applyProperties({
		backgroundColor : args.backgroundColor || "transparent",
		backgroundImage : args.backgroundImage || null
	});

}

$.clickZone.addEventListener("touchstart", function() {
	$.trigger("tab:click");
});

function setActive() {

	if (!args.selectedView) {

		$.tab.backgroundColor = $.tab.backgroundSelectedColor || $.tab.backgroundColor;

		icon.setActive();
		
		if (args.settings.captions) {
			caption.setActive();
		}

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
		
		if (args.settings.captions) {
			caption.setInactive();
		}

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

	if (args.settings.tabsAtBottom) {
		var extendBottom = subWindow.extendEdges && _.contains(subWindow.extendEdges, Ti.UI.EXTEND_EDGE_BOTTOM);
		subWindow.applyProperties({
			top : 0,
			bottom : extendBottom ? 0 : args.settings.tabHeight
		});
	} else {
		var extendTop = subWindow.extendEdges && _.contains(subWindow.extendEdges, Ti.UI.EXTEND_EDGE_TOP);
		subWindow.applyProperties({
			top : extendTop ? 0 : args.settings.tabHeight,
			bottom : 0
		});
	}

	if (OS_IOS) {

		if (args.win.navBarHidden) {// assume custom navBar

			if (!subWindow.leftNavButton) {
				subWindow.leftNavButton = Ti.UI.createButton({
					height : 38,
					title : "back"
				});

				subWindow.leftNavButton.applyProperties({
					top : subWindow.leftNavButton.top || 5,
					left : subWindow.leftNavButton.left || 5,
					height : subWindow.leftNavButton.height || 38,
					width : subWindow.leftNavButton.width || 75
				});

				subWindow.add(subWindow.leftNavButton);
			}

			subWindow.leftNavButton.addEventListener("click", function(e) {
				close(subWindow);
			});
			subWindow.leftNavButton.visible = true;
		}

		args.win.__navGroup.openWindow(subWindow);

	} else if (OS_ANDROID) {

		if (!args.settings.lightWeightMode) {
			subWindow.modal = subWindow.modal || false;
		} else {

			if (!subWindow.leftNavButton) {
				subWindow.leftNavButton = Ti.UI.createButton({
					height : 38,
					title : "back"
				});

				subWindow.leftNavButton.applyProperties({
					top : subWindow.leftNavButton.top || 5,
					left : subWindow.leftNavButton.left || 5,
					height : subWindow.leftNavButton.height || 38,
					width : subWindow.leftNavButton.width || 75
				});

				subWindow.add(subWindow.leftNavButton);
			}

			// Back Button
			subWindow.leftNavButton.addEventListener("click", function() {
				close(subWindow);
			});

			subWindow.addEventListener('androidback', function() {
				close(subWindow);
			});

			subWindow.leftNavButton.visible = true;

			subWins.push(subWindow);

			subWindow.open();

		}

	} else {
		subWindow.open();
	}
}

function close(subWindow) {

	if (OS_IOS) {

		args.win.__navGroup.closeWindow(subWindow);

	} else if (OS_ANDROID) {

		if (args.settings.lightWeightMode) {
			var currentWin = subWins[subWins.length - 1];

			currentWin.close();
			subWins.pop();

		} else {
			subWindow.close();
		}

	} else {

		subWindow.close();

	}
}

exports.setInactive = setInactive;
exports.setActive = setActive;
exports.open = open;
exports.close = close;
