
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

	this.assertItemCount(0 , 'No todo at start');

	this.assertLeftItemsString('0 items left', 'Left todo list count is 0');

	this.test.assertNotVisible('#main', '#main section is hidden');
	this.test.assertNotVisible('#toggle-all', '#toggle-all checkbox is hidden');
	this.test.assertNotVisible('#todo-count', '#todo-count span is hidden');
});

// Create a first todo
casper.then(function () {
	this.addTodo('Some Task');

	this.assertItemCount(1, 'One todo has been added, list contains 1 item');

	this.assertLeftItemsString('1 item left', 'Left todo list count is 1');

	this.test.assertEquals(this.fetchText('#todo-list li:first-child label'), 'Some Task', 'First todo is "Some Task"');

	this.test.assertVisible('#main', '#main section is displayed');
	this.test.assertVisible('#toggle-all', '#toggle-all checkbox is displayed');
	this.test.assertVisible('#todo-count', '#todo-count span is displayed');
});

// remove one
casper.then(function () {
	this.click('#todo-list li:nth-child(1) button');
	//this.mouseEvent('click', '#todo-list li:nth-child(1) button');
	//this.evaluate(function() {
	//	__utils__.mouseEvent('click', '#todo-list li:nth-child(1) button');
	//});

	this.assertLeftItemsString('0 items left', 'Todo has been removed');
});

// edit one
casper.then(function() {
	this.addTodo('Some Task');
	this.test.assertVisible('#todo-list li:nth-child(1) label');
	this.test.assertNotVisible('#todo-list li:nth-child(1) .edit');
	//this.click('#todo-list li:nth-child(1) label');
	// TODO how to dblclick ?
	
	//this.click('#todo-list li:nth-child(1) label');
	this.mouseEvent('dblclick', '#todo-list li:nth-child(1) label');
	//this.evaluate(function() {
	//	__utils__.mouseEvent('dblclick', '#todo-list li:nth-child(1) label');
	//});
	this.test.assertNotVisible('#todo-list li:nth-child(1) label');
	this.test.assertVisible('#todo-list li:nth-child(1) .edit');
	// Specs do not specify if text must be selected (?)
	this.page.sendEvent('keydown', ' edited');
	// TODO remove one, but keep which event ? Jquery impl prefers keyup...
	this.page.sendEvent('keydown', this.page.event.key.Enter);
	this.page.sendEvent('keyup', this.page.event.key.Enter);
	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(1) label'), 'Some Task edited', 'Task title has been changed');
});

casper.run(function () {
	this.test.renderResults(true);
});
