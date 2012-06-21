
var poker = poker || {};


poker.namesToEnum = function(names) {
	var e = {};
	for (var i in names)
		e[names[i]] = i;

	return e;
};

poker.random = function(max) {
	return Math.floor(Math.random() * max);
};


poker.SET_SIZE = 54;
poker.suit_names = ['SPADE', 'HEART', 'DIAMOND', 'CLUB'];
poker.value_names = [0, 'ACE', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'JACK', 'QUEEN', 'KING', 'JOKER'];
poker.identity_names = [
	'SA', 'HA', 'DA', 'CA',
	'S2', 'H2', 'D2', 'C2',
	'S3', 'H3', 'D3', 'C3',
	'S4', 'H4', 'D4', 'C4',
	'S5', 'H5', 'D5', 'C5',
	'S6', 'H6', 'D6', 'C6',
	'S7', 'H7', 'D7', 'C7',
	'S8', 'H8', 'D8', 'C8',
	'S9', 'H9', 'D9', 'C9',
	'S10', 'H10', 'D10', 'C10',
	'SJ', 'HJ', 'DJ', 'CJ',
	'SQ', 'HQ', 'DQ', 'CQ',
	'SK', 'HK', 'DK', 'CK',
	'JOD', 'JOP'
];

poker.identity_pattern_names = [
	'\u2660A', '\u2661A', '\u2662A', '\u2663A',
	'\u26602', '\u26612', '\u26622', '\u26632',
	'\u26603', '\u26613', '\u26623', '\u26633',
	'\u26604', '\u26614', '\u26624', '\u26634',
	'\u26605', '\u26615', '\u26625', '\u26635',
	'\u26606', '\u26616', '\u26626', '\u26636',
	'\u26607', '\u26617', '\u26627', '\u26637',
	'\u26608', '\u26618', '\u26628', '\u26638',
	'\u26609', '\u26619', '\u26629', '\u26639',
	'\u266010', '\u266110', '\u266210', '\u266310',
	'\u2660J', '\u2661J', '\u2662J', '\u2663J',
	'\u2660Q', '\u2661Q', '\u2662Q', '\u2663Q',
	'\u2660K', '\u2661K', '\u2662K', '\u2663K',
	'joker', 'JOKER'
];

poker.suits = poker.namesToEnum(poker.suit_names);
poker.values = poker.namesToEnum(poker.value_names);
poker.identities = poker.namesToEnum(poker.identity_names);

poker.id = function(suit, value) {
	return (value - 1) * 4 + suit;
};

poker.suit = function(id) {
	return id % 4;
};

poker.value = function(id) {
	return Math.floor(id / 4) + 1;
};


poker.BasePattern = {
	cardHtml: function(card) {
		return "<span class='poker-base-card-pattern'>" + (card.positive ? poker.identity_pattern_names[card.identity] : "?") + "</span>";
	},
};

poker.PatternScheme = poker.BasePattern;


poker.card = function(id, positive, position) {
	this.identity = id;
	this.positive = positive === undefined ? true : positive;
	this.node = $("<div class='poker-card'></div>");

	this.updateNode();

	if(position)
		this.moveTo(position.x, position.y);
};

poker.card.prototype.id = function() {
	return this.identity;
};

poker.card.prototype.suit = function() {
	return poker.suit(this.identity);
};

poker.card.prototype.value = function() {
	return poker.value(this.identity);
};

poker.card.prototype.updateNode = function() {
	this.node.html(poker.PatternScheme.cardHtml(this));
	this.node.attr("class", "poker-card");
	if(this.positive)
		this.node.addClass("poker-" + poker.suit_names[this.suit()]);
	else
		this.node.addClass("poker-back");
};

poker.card.prototype.moveTo = function(x, y) {
	this.node.css({left: x + "px", top: y + "px"});
};

poker.card.prototype.flip = function(positive) {
	if (positive == undefined)
		positive = !this.positive;
	this.positive = positive;

	this.updateNode();
};


poker.card.makeSet = function(parent, positive, posfn) {
	var s = [];
	for (var id = 0; id < poker.SET_SIZE; ++id) {
		var position;
		if(posfn)
			position = posfn(id);
		s[id] = new poker.card(id, positive, position);

		if(parent)
			s[id].node.appendTo(parent);
	}

	return s;
};
