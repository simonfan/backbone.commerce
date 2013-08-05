define(['backbone','backbone.commerce.cart','backbone.commerce.order'], function(Backbone, Cart, Order) {
	/**
	 * Export var.
	 */
	var Commerce = Backbone.Commerce = {
		Cart: Cart,
		Order: Order,
	};

	return Commerce;
});