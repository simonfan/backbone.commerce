define(['backbone.quantified'], function(Quantified) {

	/**
	 * Cart Collection extends the backbone quantified collection functionalities
	 * just by providing price calculation methods.
	 * 
	 */
	var Cart = Quantified.Collection.extend({

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
		 * Calculates the total amount for the products in the cart.
		 */
		total: function() {
			var _this = this,
				total = this.reduce(function(total, cartProduct) {
					return total + ( _this.price(cartProduct) * cartProduct.quantity() );
				}, 0);

			return total;
		},

		/**
		 * Returns a list of products 
		 */
		productList: function() {
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
	});

	return Cart;
});