$(function() {
	$('#log-in-help').popover({
		title: 'Your Google account will be associated with premium backgrounds that you purchase, so you can use them on any of your computers.',
		placement: 'bottom',
		trigger: 'hover'
	});
	$('#background-width-settings-title').popover({
		content: 'In "Tile Mode" backgrounds will not change size and they will repeat horizontally and vertically. In "Stretch Mode" backgrounds will be the same width as your screen, and adjust as you resize the window.',
		placement: 'left',
		trigger: 'hover'
	});
});