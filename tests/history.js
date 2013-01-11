
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
	this.clean();

	this.test.assertTitleMatch(/TodoMVC$/, 'Page title contains TodoMVC');

	// TODO test for initial status ?
	// with storage tests ?
	this.assertItemCount(0 , 'No todo at start');

	// TODO assert history "all" has class selected

	this.assertLeftItemsString('0 items left', 'Left todo list count is 0');

	this.test.assertNotVisible('#main', '#main section is hidden');
	this.test.assertNotVisible('#toggle-all', '#toggle-all checkbox is hidden');
	this.test.assertNotVisible('#todo-count', '#todo-count span is hidden');
});

// Create 3 todos
casper.then(function () {
	this.addTodo('Some Task');
	this.addTodo('Another Task');
	this.addTodo('A third Task');

	this.assertItemCount(3 , 'We now have displayed 3 todos');

	this.assertLeftItemsString('3 items left', 'Left todo list count is 3');

	this.click('#todo-list li:nth-child(2) input[type=checkbox]');

	this.assertLeftItemsString('2 items left', 'Left todo list count is 2');
});

casper.then(function () {
	// TODO use [href=#/selected] would be better, but not necessarly a link ?
	// GWT model...
	this.click('#filters li:nth-child(2) a');

	// TODO test URL at each time

	this.assertItemCount(2 , 'Completed todo has been hidden, just 2 are displayed');
	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'A third Task', 'Second displayed todo is "A third Task"');

	this.click('#filters li:nth-child(3) a');

	this.assertItemCount(1 , 'Just one Todo is displayed');
	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(1) label'), 'Another Task', 'Displayed todo is "Another Task"');
});

// TODO test by modifying URL

casper.run(function () {
	this.test.renderResults(true);
});
