
var casper = require('casper').create();

// TODO test http://casperjs.org/api.html#casper.back

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
	this.test.assertEval(function (itemsAwaitedNumber) {
		var items = document.querySelectorAll('#todo-list li');
		var number = 0;
		for(var i = 0 ; i < items.length ; i++) {
			// how to accept only displayed elements ?
			// => https://groups.google.com/forum/?fromgroups=#!topic/jquery-dev/4Ys5mzbQP08
			// __utils__.visible seems not to work in this case...
			if(items[i].offsetWidth > 0 || items[i].offsetHeight > 0) {
				number++;
			}
			if(__utils__.visible('#todo-list li:nth-child(' + i + ')')) {
				//number++;
			}
		}
		//__utils__.echo(number);
		return number === itemsAwaitedNumber;
	}, message, itemsNumber);
}

casper.assertLeftItemsString = function(leftItemsString, message) {
	// Backbone for example does not update string since it's not displayed. It's a valid optimization
	if(leftItemsString == '0 items left' && !this.visible('#todo-count')) {
		this.test.assertTrue(true, 'Left items label is not displayed - ' + message);
		return;
	}
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
	this.assertItemCount(0, 'No todo at start');

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

	this.assertItemCount(3, 'We now have displayed 3 todos');

	this.assertLeftItemsString('3 items left', 'Left todo list count is 3');

	this.click('#todo-list li:nth-child(2) input[type=checkbox]');

	this.assertLeftItemsString('2 items left', 'Left todo list count is 2');
});

// TODO : do not seems to work : this.click('#filters li:nth-child(2) a'); & test URL
// GWT model...
casper.thenOpen(URL + '#/active');
casper.then(function () {
	this.assertItemCount(2, 'Completed todo has been hidden, just 2 are displayed');
	// TODO test class selected for bold test ?
});

casper.thenOpen(URL + '#/completed');
casper.then(function () {
	this.assertItemCount(1, 'Only the completed Todo is displayed');
});

casper.thenOpen(URL + '#/');
casper.then(function () {
	this.assertItemCount(3, 'Three Todos are displayed again');
});

// TODO test by modifying URL

casper.run(function () {
	this.test.renderResults(true);
});
