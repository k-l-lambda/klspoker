
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
	loaded: true,
	load: function(finish) {
		finish();
	},
	cardHtml: function(card) {
		return "<span class='poker-pattern poker-base-card-pattern'>" + (card.positive ? poker.identity_pattern_names[card.identity] : "?") + "</span>";
	}
};

poker.PatternScheme = poker.BasePattern;


poker.Card = function(options) {
	this.identity = options.id;
	this.positive = options.positive === undefined ? true : options.positive;
	this.node = $("<div class='poker-card'></div>");

	this.updateNode();

	if(options.position)
		this.moveTo(options.position.x, options.position.y);
};

poker.Card.prototype.id = function() {
	return this.identity;
};

poker.Card.prototype.suit = function() {
	return poker.suit(this.identity);
};

poker.Card.prototype.value = function() {
	return poker.value(this.identity);
};

poker.Card.prototype.attachNode = function(parent) {
	this.node.detach();
	this.node.appendTo(parent);
};

poker.Card.prototype.updateNode = function() {
	if(!poker.PatternScheme.loaded)
		poker.PatternScheme.load();

	this.node.html(poker.PatternScheme.cardHtml(this));
	this.node.removeClass("poker-SPADE");
	this.node.removeClass("poker-HEART");
	this.node.removeClass("poker-DIAMOND");
	this.node.removeClass("poker-CLUB");
	this.node.removeClass("poker-back");
	this.node.addClass("poker-Card");
	if(this.positive)
		this.node.addClass("poker-" + poker.suit_names[this.suit()]);
	else
		this.node.addClass("poker-back");
};

poker.Card.prototype.moveTo = function(x, y) {
	//if(this.node.offset().left != x || this.node.offset().top != y)
		this.node.css({left: x + "px", top: y + "px"});
};

poker.Card.prototype.alignTo = function(node, relative) {
	relative = relative || {x: 0, y: 0};

	var offset = node.offset();
	this.moveTo(offset.left + relative.x, offset.top + relative.y);
};

poker.Card.prototype.flip = function(positive) {
	if (positive == undefined)
		positive = !this.positive;

	if (this.positive != positive) {
		this.positive = positive;

		this.updateNode();
	}
};

poker.Card.prototype.animate = function() {
	poker.animator_pool.push(this.node);
};

poker.Card.prototype.setOnClick = function(e) {
	var self = this;

	if (this.node) {
		this.node.unbind("click");
		this.node.click(function() { e(self); });
	}
};

poker.Card.makeSet = function(options) {
	var s = new poker.CardQueue({parentNode: options.parentNode, cardParentNode: options.cardParentNode});
	for (var id = 0; id < poker.SET_SIZE; ++id) {
		var position;
		if(options.posfn)
			position = options.posfn(id);
		var card = s.pushBack(new poker.Card({id: id, positive: options.positive, position: position}));
	}

	if(options.shuffle)
		s.shuffle();

	s.updateCards();

	return s;
};

poker.Card.disturb = function(cards) {
	for (var i in cards)
		cards[i].sortValue = Math.random();

	cards.sort(function(a, b) { return a.sortValue - b.sortValue; });

	return cards;
};


poker.CardQueue = function(options){
	this.cards = [];
	this.parentNode = options.parentNode;
	this.cardParentNode = options.cardParentNode;
};

poker.CardQueue.prototype.size = function(){
	return this.cards.length;
};

poker.CardQueue.prototype.front = function(){
	return this.cards[0];
};

poker.CardQueue.prototype.back = function(){
	return this.cards[this.size() - 1];
};

poker.CardQueue.prototype.push = function(pos, card) {
	this.cards.splice(pos, 0, card);

	if (this.cardParentNode)
		card.attachNode(this.cardParentNode);

	if (this.parentNode) {
		card.locateNode = $("<li></li>");
		if (pos >= this.size() - 1) {
			card.locateNode.appendTo(this.parentNode);

			card.node.detach();
			card.node.appendTo(this.cardParentNode);
		}
		else {
			card.locateNode.insertBefore(this.parentNode.find("li:eq(" + pos + ")"));

			card.node.detach();
			card.node.insertBefore(this.cards[pos + 1].node);
		}
	}

	return card;
};

poker.CardQueue.prototype.pushFront = function(card){
	return this.push(0, card);
};

poker.CardQueue.prototype.pushBack = function(card){
	return this.push(this.size(), card);
};

poker.CardQueue.prototype.pop = function(pos){
	if(!this.size()) {
		console.warn("pop card from empty queue.");
		return null;
	}

	var card = this.cards.splice(pos, 1)[0];

	if(card.locateNode) {
		card.locateNode.remove();
		card.locateNode = null;
	}

	return card;
};

poker.CardQueue.prototype.popFront = function(){
	return this.pop(0);
};

poker.CardQueue.prototype.popBack = function(){
	return this.pop(-1);
};

poker.CardQueue.prototype.updateCards = function(){
	for(var i in this.cards) {
		if(this.cards[i].locateNode)
			this.cards[i].alignTo(this.cards[i].locateNode);
	}
};

poker.CardQueue.prototype.shuffle = function() {
	poker.Card.disturb(this.cards);

	if (this.parentNode) {
		for (var i in this.cards) {
			if (this.cards[i].locateNode)
				this.cards[i].locateNode.remove();
			this.cards[i].locateNode = $("<li></li>");
			this.cards[i].locateNode.appendTo(this.parentNode);

			if (this.cardParentNode)
				this.cards[i].attachNode(this.cardParentNode);
		}
	}

	this.updateCards();
};

poker.CardQueue.prototype.flip = function(positive) {
	for (var i in this.cards)
		this.cards[i].flip(positive);
};


poker.AnimatorPool = function(options) {
	options = options || {};

	this.pool = [];
	this.limit = (options.limit === undefined) ? -1 : options.limit;
};

poker.AnimatorPool.ANIMATOR_CLASS_NAME = "poker-animator";

poker.AnimatorPool.prototype.push = function(node) {
	var index = this.pool.indexOf(node);
	if (index >= 0) {
		this.pool.splice(index, 1);
	}

	this.pool.splice(0, 0, node);
	node.addClass(poker.AnimatorPool.ANIMATOR_CLASS_NAME);

	this.trim();
};

poker.AnimatorPool.prototype.pop = function() {
	var tail = this.pool[this.pool.length - 1];
	tail.removeClass(poker.AnimatorPool.ANIMATOR_CLASS_NAME);
	this.pool.splice(-1, 1);

	return tail;
};

poker.AnimatorPool.prototype.trim = function() {
	if (this.limit >= 0) {
		while (this.pool.length > this.limit)
			this.pop();
	}
};

poker.animator_pool = new poker.AnimatorPool;
