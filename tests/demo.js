define(['backbone.commerce','backbone.listview','backbone.formview'], function(Commerce, ListView, FormView) {

	/**
	 * The cart collection
	 */
	var cart = window.cart = new Commerce.Cart([], {
		price: function(model) {
			return model.get('price');
		}
	});

	/**
	 * The order model constructor
	 */
	var Order = Commerce.Order.extend({
		initialize: function(attr, options) {
			Commerce.Order.prototype.initialize.call(this, attr, options);

			// listen to changes on cep
			this.on('change:cep', this.getAddress);

			// listen to changes on 'envio-metodo'
			this.on('change:envio-metodo', this.setShippingCost)
		},

		getAddress: function(model, cep) {

			setTimeout(function() {
				model.set({
					logradouro: 'Rua lalalalala',
					uf: 'RJ',
					cidade: 'Cidade qualquer do Rio',
				})
			}, 1400);
		},

		setShippingCost: function(model, metodo) {

			var cep = model.get('cep');

			if (!cep) {
				alert('CEP requisitado para cálculo de frete.')
			} else {

				setTimeout(function() {
					model.set('envio-custo', 40);
				}, 2000);

			}
		},
	});

	/**
	 * The order model.
	 */
	var order = window.order = new Order({}, {
		cart: cart,
	});



	/**
	 * order view Constructor
	 */
	var OrderView = FormView.extend({
		events: {
			'change .cep': 'buildShippingForm'
		},

		buildShippingForm: function(e) {
			var $target = $(e.target),
				cep = $target.val();
		},
	});

	/**
	 * order view instance
	 */
	var orderView = new OrderView({
		el: $('#order-data'),
		model: order,
		map: {
			productTotal: '.produtos-custo',
			cep: '.cep',
			uf: '.uf',
			cidade: '.cidade',
			logradouro: '.logradouro',
			complemento: '.complemento',
			'envio-metodo': '.envio-metodo',
			'envio-custo': '.envio-custo',
		},
		data: function(model) {
			return model.attributes;
		}
	});



	/**
	 * The product collection
	 */
	var fruits = new Backbone.Collection([
		{ id: 1, name: 'Banana', price: 2 },
		{ id: 2, name: 'Apple', price: 6 },
		{ id: 3, name: 'Orange', price: 4 },
		{ id: 4, name: 'Watermelon', price: 10 },
		{ id: 5, name: 'Pineapple', price: 7 }
	]);



	/**
	 * The shop view constructor
	 */
	var ShopView = ListView.extend({

		initialize: function(options) {
			// call listView initialize
			ListView.prototype.initialize.call(this, options);

			_.bindAll(this, 'increase', 'decrease');

			// a collection of available products
			this.products = options.products;

			// a collection of the products to buy
			this.cart = options.cart;
		},

		events: {
			'click .increase': 'increase',
			'click .decrease': 'decrease'
		},

		increase: function(e) {
			var $target = $(e.target),
				prodId = $target.attr('data-prod-id'),
				// use the collection already provided by ListView to get the product.
				product = this.products.get(prodId);

			// add 1 item to the cart.
			this.cart.increase(product, 1);
		},


		decrease: function(e) {
			var $target = $(e.target),
				prodId = $target.attr('data-prod-id'),
				product = this.products.get(prodId);

			this.cart.decrease(product, 1);
		}
	});
	/** 
	 * The shop view
	 */
			/**
			 * Options:
			 *	- el: html list
			 *	- collection
			 *	- itemTemplate: template function used to render the book thumbnail.
			 *	- itemData: function that intercepts the model rendering
			 */
	var shop = new ShopView({
		el: $('#shop-items'),
		products: fruits,
		cart: cart,

		collection: fruits,
		itemData: function(model) {
			return model.attributes;
		},
		itemTemplate: function(data) {
			return '<li class="increase" data-prod-id="' + data.id + '">' + data.name + ' - R$ ' + data.price + '</li>';
		},
	});





	/** 
	 * The cart view constructor
	 */
	var CartView = ShopView.extend({
		initialize: function(options) {
			ShopView.prototype.initialize.call(this, options);

			_.bindAll(this, 'updateQuantity');

			this.cart.on('increase decrease', this.updateQuantity);
		},

		updateQuantity: function(product, quantity) {
			var $tr = this.$el.find('tr[data-prod-id="'+ product.id +'"]');

			$tr.find('.quantity').html(quantity);
		},
	});
	/**
	 * Cart view instance
	 */
	var cartView = new CartView({
		el: $('#checkout-table'),
		products: fruits,
		cart: cart,

		collection: cart,
		itemData: function(model) {
			return model.attributes;
		},
		itemTemplate: function(data) {
			return '<tr data-prod-id="'+ data.id +'"><td>'+ data.name +'</td><td class="increase" data-prod-id="'+ data.id +'"> ADD </td><td class="decrease" data-prod-id="'+ data.id +'"> REMOVE </td><td class="quantity">'+ data.quantity +'</td></tr>'
		},
		itemSelector: function(model) {
			return 'tr[data-prod-id="'+ model.id +'"]';
		},

		moments: {
			afterAdd: function($el, model) {
				return $el.animate({ opacity: 1, height: 40 });
			},

			beforeRemove: function($el, model) {
				return $el.css({ overflow: 'hidden', display: 'block' }).animate({ height: 0, opacity: 0 });
			}
		}
	})

});