require.config({
	urlArgs: "bust=" + Math.random(),
	baseUrl: '',
	paths: {
		// basic libraries
		'jquery': 'components/jquery/jquery',
		'underscore': 'components/underscore/underscore',
		'backbone': 'components/backbone/backbone',

		'jquery.fill': 'components/jquery.fill/jquery.fill',

		'backbone.listview': 'components/backbone.listview/backbone.listview',
		'backbone.modelview': 'components/backbone.modelview/backbone.modelview',
		'backbone.formview': 'components/backbone.formview/backbone.formview',

		'backbone.quantified': 'components/backbone.quantified/backbone.quantified',

		'backbone.commerce.cart': '../backbone.commerce.cart',
		'backbone.commerce.order': '../backbone.commerce.order',
		'backbone.commerce': '../backbone.commerce',

		// DEMO
		'demo-main': 'demo',	// the main file for the demo

		// UNIT TESTS
		'tests-main': 'tests',	// the main file for tests

		// other tests go here
		'example-tests': 'tests/example-tests',
	},
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	}
});
	
if (window.__unit) {

	// load the tests
	require(['tests-main'], function(undef) {

		// tests were already run in the main tests file

		// QUnit was set not to autostart inline in tests.html
		// finally start the QUnit engine.
		QUnit.load();
		QUnit.start();
	});

} else {

	require(['demo-main'], function(demo) {

	});

}