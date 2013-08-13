define(['backbone','backbone.commerce.cart'], function(Backbone, Cart) {
	var Order = Backbone.Model.extend({

		initialize: function(attributes, options) {
			/**
			 * Options:
			 *		cart: Backbone.Commerce.Cart collection.
			 *		totalAttr: 'string': the attribute used to save the total amount in the order.
			 */
			this.__commerceOrderOptions = _.defaults(options, {
				totalAttr: 'total',
				productsAttr: false,
				descriptionAttr: false
			});

			/**
			 * Product collection. May either be a Backbone.Commerce.Cart
			 * or a simple Backbone.Collection
			 */
			this.cart = options.cart || new Cart();

			/**
			 * Listen to events
			 */
			// when a new product is added to the cart
			this.listenTo(this.cart, 'add remove reset increase decrease', this.update);

			// start things up
			this.update();
		},

		/**
		 * Hnadles changes on the product collection
		 */
		update: function() {
			// update total
			var totalAttr = this.__commerceOrderOptions.totalAttr;
			if (totalAttr) { this.set(totalAttr, this.total()); }

			// update products
			var productsAttr = this.__commerceOrderOptions.productsAttr;
			if (productsAttr) { this.set(productsAttr, this.products()); }
			
			// update description
			var descriptionAttr = this.__commerceOrderOptions.descriptionAttr;
			if (descriptionAttr) { this.set(descriptionAttr, this.describe()); }
		},

		total: function() {
			return this.cart.total();
		},

		products: function() {
			return this.cart.products();
		},

		describe: function() {
			return this.cart.describe();
		},
	});

	return Order;
})