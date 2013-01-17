
// TODO http://stackoverflow.com/questions/13749213/clear-localstorage-with-casperjs

var casper = require('casper').create();

// test URL : '../architecture-examples/angularjs/index.html';
var URL = casper.cli.get(0);

casper.addTodo = function(title) {
	// TODO about initial focus testing
	this.page.sendEvent('keydown', title);
	// TODO remove one, but keep which event ? Jquery impl prefers keyup...
	this.page.sendEvent('keydown', this.page.event.key.Enter);
	this.page.sendEvent('keyup', this.page.event.key.Enter);
};

casper.assertItemCount = function(itemsNumber, message) {
	this.test.assertEval(function (itemsNumber) {
		return document.querySelectorAll('#todo-list li').length === itemsNumber;
	}, message, {itemsNumber: itemsNumber});
}

casper.assertLeftItemsString = function(leftItemsString, message) {
	var displayedString = this.fetchText('#todo-count').replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim();
	this.test.assertEquals(displayedString, leftItemsString, message);
};

// TODO find why most times useless
// TODO remove localstorage instead
casper.clean = function() {
	this.evaluate(function() {
		document.querySelector('#clear-completed').click();
	});
	this.evaluate(function() {
		document.querySelector('#toggle-all').click();
	});
	this.evaluate(function() {
		document.querySelector('#clear-completed').click();
	});
};

casper.start(URL, function () {
	//this.clean();

	this.test.assertTitleMatch(/TodoMVC$/, 'Page title contains TodoMVC');

	// TODO test for initial status ?
	// with storage tests ?
	this.assertItemCount(0 , 'No todo at start');

	this.assertLeftItemsString('0 items left', 'Left todo list count is 0');

	this.test.assertNotVisible('#main', '#main section is hidden');
	this.test.assertNotVisible('#toggle-all', '#toggle-all checkbox is hidden');
	this.test.assertNotVisible('#todo-count', '#todo-count span is hidden');
});

// Create a first todo
casper.then(function () {
	this.addTodo('Some Task');
	this.addTodo('Another Task');
	this.addTodo('A third Task');

	this.assertItemCount(3 , 'We now have 3 todos');
});

casper.run(function () {
	this.test.renderResults(true);
	//this.test.renderResults(true);
});
