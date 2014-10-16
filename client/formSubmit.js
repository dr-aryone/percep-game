var game = game || {};

game.submitForm = function() {
	var greenSquare = $('#green-s-check').prop('checked');
	var greenDiamond = $('#green-d-check').prop('checked');
	var purpleSquare = $('#purple-s-check').prop('checked');
	var purpleDiamond = $('#purple-d-check').prop('checked');
	var greenSmiley = $('#green-smiley-check').prop('checked');

	var noticed = false;

	if(game.hiddenObjectTemplate.isForegroundColor && purpleSquare) {
		noticed = true;
	}

	if(!game.hiddenObjectTemplate.isForegroundColor && greenSquare) {
		noticed = true;
	}
	
	if($('input:checked').length > 1 || $('input:checked').length == 0)
		noticed = false;

	$.post('/statistics', {
		backgroundSpeed: game.hiddenObjectTemplate.speed,
		sameAsForeground: game.hiddenObjectTemplate.isForegroundColor,
		noticedObject: noticed
	});
	$('#myModal').modal('hide');	
}