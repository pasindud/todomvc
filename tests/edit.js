
var casper = require('casper').create();

// test URL : '../architecture-examples/angularjs/index.html';
var URL = casper.cli.get(0);

casper.addTodo = function(title) {
	// TODO about initial focus testing
	this.evaluate(function() {
		document.querySelector('#new-todo').focus();
	});
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

// Implementations differ but text in input should not be selected when editing
// => this function should not have to be called
casper.unselectText = function(selector) {
	var textLength = this.getElementAttribute(selector, 'value').length;
	this.evaluate(function(selector, textLength) {
		document.querySelector(selector).setSelectionRange(textLength, textLength);
	}, selector, textLength);
}

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

	this.test.assertNotVisible('#main', '#main section is hidden');
	this.test.assertNotVisible('#toggle-all', '#toggle-all checkbox is hidden');
	this.test.assertNotVisible('#todo-count', '#todo-count span is hidden');
});

// Create and remove a first todo
casper.then(function () {
	this.addTodo('Some Task');
	this.assertItemCount(1, 'One todo has been added, list contains 1 item');
	this.click('#todo-list li:first-child button');
	this.assertItemCount(0, 'Todo has been removed');
});

// edit one
casper.then(function() {
	this.addTodo('Another Task');

	this.test.assertVisible('#todo-list li:first-child label');
	this.test.assertNotVisible('#todo-list li:first-child .edit');

	this.mouseEvent('dblclick', '#todo-list li:first-child label');
	this.unselectText('#todo-list li:first-child .edit');

	this.test.assertNotVisible('#todo-list li:first-child label');
	this.test.assertVisible('#todo-list li:first-child .edit');
	
	this.page.sendEvent('keypress', ' edited');
	// this.page.sendEvent('keyup', ' edited');
	// TODO remove one, but keep which event ? Jquery impl prefers keyup...
	this.page.sendEvent('keypress', this.page.event.key.Enter);
	
	this.test.assertVisible('#todo-list li:first-child label');
	this.test.assertNotVisible('#todo-list li:first-child .edit');

	this.test.assertEquals(this.fetchText('#todo-list li:first-child label'), 'Another Task edited', 'Task title has been changed');
});


// edit one and onblur
casper.then(function() {
	this.addTodo('Conquer the world');

	this.test.assertVisible('#todo-list li:nth-child(2) label');

	this.mouseEvent('dblclick', '#todo-list li:nth-child(2) label');
	this.unselectText('#todo-list li:nth-child(2) .edit');

	this.page.sendEvent('keypress', ' and the neighborhood');

	this.evaluate(function() {
		// Focus another element
		document.querySelector('#todo-list li:nth-child(2) .edit').blur();
	});
	//this.test.assertEquals(this.getElementAttribute('#todo-list li:first-child .edit', 'value'), 'Some Task edited', 'Task title has been changed');
	// this.page.sendEvent('keyup', this.page.event.key.Enter);

	this.test.assertVisible('#todo-list li:nth-child(2) label');
	this.test.assertNotVisible('#todo-list li:nth-child(2) .edit');

	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'Conquer the world and the neighborhood', 'Task title has been changed');
});

casper.run(function () {
	this.test.renderResults(true);
});
