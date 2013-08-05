define(['backbone','backbone.commerce.cart'], function(Backbone, Cart) {
	var Order = Backbone.Model.extend({
		defaults: {
			products: [],		// array containing products ordered.
			total: 0,			// the order total amount to be paid for
		},

		initialize: function(attributes, options) {
			/**
			 * Options:
			 * 		products: Backbone.Collection
			 * 		price: function(model) { return model.get('price-of-product') }
			 */

			/**
			 * Product collection. May either be a Backbone.Commerce.Cart
			 * or a simple Backbone.Collection
			 */
			this.cart = options.cart || new Cart();

			/**
			 * Listen to events
			 */
			// when a new product is added to the cart
			this.listenTo(this.cart, 'add remove reset increase decrease', this._addremres);

			// start things up
			this.total();
			this.products();
		},

		/**
		 * Hnadles changes on the product collection
		 */
		_addremres: function() {
			// update total
			this.total();

			// update products
			this.products();
		},

		total: function() {
			var total = this.cart.total();

			this.set('productTotal', total);

			return total;
		},

		/**
		 * Gets the json value from the collection
		 */
		products: function() {
			var products = this.cart.toJSON();

			this.set('products', products);

			return products;
		},
	});

	return Order;
})