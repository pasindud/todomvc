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

// TODO : does not work : this.click('#filters li:nth-child(2) a');
// make it work, and test url result
// GWT model...
casper.thenOpen(URL + '#/active');
casper.then(function () {
	this.assertItemCount(2, 'Completed todo has been hidden, just 2 are displayed');
	// TODO test <a> style ?
});

casper.thenOpen(URL + '#/completed');
casper.then(function () {
	this.assertItemCount(1, 'Only the completed Todo is displayed');
});

casper.thenOpen(URL + '#/');
casper.then(function () {
	this.assertItemCount(3, 'Three Todos are displayed again');
});

// TODO test http://casperjs.org/api.html#casper.back

casper.run(function () {
	this.test.renderResults(true);
});
