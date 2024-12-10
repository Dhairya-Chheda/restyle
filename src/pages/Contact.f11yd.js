// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixAnimations from 'wix-animations';

const ACTIVE_COLOR = '#212121';
const DEFAULT_COLOR = '#545454';

$w.onReady(function () {
	initProfilerepeater();
});

function initProfilerepeater() {
	$w('#profilesectionrepeater').forEachItem(( $item, itemData, index) => {
		$item('#Sectionbutton').onClick(() => {
			openRelevantContent(index);
		});
	});
}

function openRelevantContent(targetIndex) {
	$w('#profilesectionrepeater').forEachItem(( $item, itemData, index) => {
		const contentBox = $item('#profilesectioncontent');
		const button = $item('#Sectionbutton');
		const arrow = $item('#Sectionarrow');
		
		if (targetIndex === index) {
			contentBox.collapsed ? expandProfileContent(contentBox, button, arrow) : collapseProfileContent(contentBox, button, arrow);
		} else {
			collapseProfileContent(contentBox, button, arrow);
		}
	})
}

function expandProfileContent(contentBox, button, arrow) {
	contentBox.expand()
	button.style.color = ACTIVE_COLOR;
	wixAnimations.timeline()
	.add(arrow, { rotate: 45, duration: 300 })
	.play();
}

function collapseProfileContent(contentBox, button, arrow) {
	contentBox.collapse()
	button.style.color = DEFAULT_COLOR;
	wixAnimations.timeline()
	.add(arrow, { rotate: 0, duration: 300 })
	.play();
}


/**
 *	REMEMBER TO ADD IN TAILOR DATASET + MAKE SURE IT CORRELATES TO THE ONE BELOW
 */

/**
 *	Adds an event handler that runs when the dataset is ready.
 */
export function tailordataset_ready() {
	initProfilerepeater();
}