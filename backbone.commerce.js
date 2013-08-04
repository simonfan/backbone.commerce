define(['backbone'], function(Backbone) {

	/**
	 * Cart and Order are independent modules!
	 */

	/**
	 * Cart is a Backbone.Collection with modified add and remove behaviours,
	 * in addProduct and removeProduct
	 * 
	 * The Cart collection works as follows:
	 * addProduct is called with a 'model' and a 'quantity' parameter.
	 * The model may be any backbone model. The addProduct method builds up
	 * a new set of attributes (based on the model's attributes) and creates a
	 * product model which then is added to the cart collection.
	 * 
	 * When removing products (removeProduct), the Cart finds the 
	 */
	var Cart = Backbone.Collection.extend({
		initialize: function(models, options) {
			_.bindAll(this, 'addProduct','removeProduct','add','remove')
		},


		/**
		 * The big trick lies here:
		 * set the idAttribute of the model used by this collection
		 * as being another idAttribute other than the classic 'id',
		 * so that when adding models to this collection they are not considered repeated.
		 */
		model: Backbone.Model.extend({
			idAttribute: 'productId'
		}),

		/**
		 * Adds a product to the cart based on the given mode.
		 */
		addProduct: function(model, qtty) {
			qtty = qtty || 1;

			/**
			 * model: any Backbone Model
			 */
			if (_.isArray(model)) {

				_.each(model, this.addProduct);
			} else {

					// clone the model attributes 
				var modelAttributes = _.clone(model.attributes);

				do {
					this.add(modelAttributes);

					qtty = qtty - 1;

				} while (qtty);
			}

			return this;
		},

		/**
		 * Removes product instances from the cart collection based on given model.
		 */
		removeProduct: function(model, qtty) {
			// defaults to remove 1.
			qtty = qtty || 1;

			if (_.isArray(model)) {
				_.each(model, this.removeProduct);
			} else {

				/**
				 * It is important to remember that modelId is different from
				 * the id used internally in the Cart
				 */
					// get the model's id.
				var modelId = (typeof model === 'object') ? model.id : model,
					// get the product models based on modelId.
					products = this.where({ id: modelId }),
					// the removed count (always start at 0)
					removed = 0;

				// while the removed count is not as high as the qtty to be removed 
				// and there are products in the products array
				while (removed <= qtty && p = products[ removed ]) {

					this.remove(p);

					removed += 1;
				}
			}

			return this;
		},

		/**
		 * Checks how many products of the given type are in.
		 */
		howMany: function(model) {
			var modelId = typeof model === 'object' ? model.id : model;
			return this.where({ id: modelId }).length;
		},
	});



	/**
	 * Define behaviour for hte Order Model.
	 */
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
			this.products = options.products;


			/**
			 * Method to get the price from the product.
			 */
			this.price = options.price || this.price;


			/**
			 * Listen to events
			 */
			// when a new product is added to the cart
			this.listenTo(this.products, 'add remove reset', this._addremres);
		},


		/**
		 * Hnadles changes on the product collection
		 */
		_addremres: function() {
			this.getTotal();
			this.getProducts();
		},

		/**
		 * calculate the getTotal and set it on the model
		 */
		getTotal: function() {
			var total = this.products.reduce(function(total, model) {
				return total + _this.price(model);
			}, 0);

			this.set('total', total);

			return total;
		},

		/**
		 * Gets the json value from the collection
		 */
		getProducts: function() {
			var products = this.products.toJSON();

			this.set('products', products);

			return products;
		},

		/**
		 * get the price from a product model
		 */
		price: function(model) {
			return model.get('price');
		}
	});


	/**
	 * Export var.
	 */
	var Commerce = Backbone.Commerce = {
		Cart: Cart,
		Order: Order,
	};

	return Commerce;
});