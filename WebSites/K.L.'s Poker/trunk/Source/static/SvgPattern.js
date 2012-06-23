
var poker = poker || {};


poker.SvgPattern = {
	ids: [
		"1_spade", "1_heart", "1_diamond", "1_club",
		"2_spade", "2_heart", "2_diamond", "2_club",
		"3_spade", "3_heart", "3_diamond", "3_club",
		"4_spade", "4_heart", "4_diamond", "4_club",
		"5_spade", "5_heart", "5_diamond", "5_club",
		"6_spade", "6_heart", "6_diamond", "6_club",
		"7_spade", "7_heart", "7_diamond", "7_club",
		"8_spade", "8_heart", "8_diamond", "8_club",
		"9_spade", "9_heart", "9_diamond", "9_club",
		"10_spade", "10_heart", "10_diamond", "10_club",
		"jack_spade", "jack_heart", "jack_diamond", "jack_club",
		"queen_spade", "queen_heart", "queen_diamond", "queen_club",
		"king_spade", "king_heart", "king_diamond", "king_club",
		"black_joker", "red_joker",
		"back"
	],
	load: function(finish) {
		$("body").prepend("<div id='poker-svg-pattern-container' style='display:none'></div>");
		$("#poker-svg-pattern-container").load("/static/svg-cards.svg svg", function() {
			poker.SvgPattern.loaded = true;

			if (finish)
				finish($("#poker-svg-pattern-container"));
		});
	},
	cardHtml: function(card) {
		var id;
		if (card.positive) {
			id = poker.SvgPattern.ids[card.identity];
		}
		else {
			id = "back";
		}

		var g = $("#" + id);
		var x = g.find("use:first").attr("x").animVal.value - 2;
		var y = g.find("use:first").attr("y").animVal.value - 236;

		return "<svg class='poker-pattern poker-svg-card-pattern' xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='" + x + " " + y + " 170 246'><g>" + g.html() + "</g></svg>";
	}
};
