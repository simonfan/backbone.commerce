define(['backbone.quantified'], function(Quantified) {

	/**
	 * Product extends Quantified.Model's functionality.
	 * Provides convenience price and total methods.
	 */
	var Product = Quantified.Model.extend({
		/**
		 * Proxy method that uses the Cart's price method.
		 */
		price: function() {
			return this.collection.price(this);
		},

		/**
		 * Calculates the total cost for the product.
		 */
		total: function() {
			return this.price() * this.quantity();
		},

		/**
		 * Describes the order for this product
		 */
		describe: function() {
			return {
				id: this.id,
				quantity: this.quantity(),
				price: this.price(),
				total: this.total(),
			};
		}
	});

	/**
	 * Cart Collection extends the backbone quantified collection functionalities
	 * just by providing price calculation methods.
	 * 
	 */
	var Cart = Quantified.Collection.extend({
		/**
		 * Uses Product model, which is just an extension of Quantified.Model
		 */
		model: Product,

		initialize: function(models, options) {
			Quantified.Collection.prototype.initialize.call(this, models, options);

			options = options || {};

			/**
			 * method to get price. Defaults to return model.get('price')
			 */
			this.price = options.price || this.price;
		},

		/**
		 * The price function that gets the price from the model.
		 */
		price: function(model) {
			return model.get('price');
		},

		/**
		 * Polymorphic method:
		 * 	- no arguments: Calculates the total amount for the products in the cart.
		 *	- model argument: calculates the total amount for the given product.
		 */
		total: function(model) {

			if (typeof model === 'undefined') {
				// no model passed, return full total.
				var _this = this,
					total = this.reduce(function(total, cartProduct) {
						return total + ( _this.price(cartProduct) * cartProduct.quantity() );
					}, 0);

				return total;

			} else {
				// model is set, get the total for the given product.
				var id = typeof model === 'object' ? model.id : model,
					product = this.get(id);

				return product.total();
			}
		},

		/**
		 * Returns a list of products 
		 */
		products: function() {
			var list = [];

			this.each(function(product) {
				var qtty = product.quantity();

				while (qtty) {
					var attr = _.clone(product.attributes);

					delete attr.quantity;

					list.push(attr);
					qtty -= 1;
				}
			});

			return list;
		},

		/**
		 * Returns a descriptive object of the products in cart
		 */
		describe: function() {
			var _this = this,
				description = {};

			this.each(function(product, id) {
				description[ id ] = product.describe();
			});

			return description;
		},
	});

	return Cart;
});