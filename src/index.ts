import './scss/styles.scss';

import { AppState, CatalogChangeEvent } from './components/appData';
import { LarekApi } from './components/larekApi';
import { ContactForm, DeliveryForm } from './components/order';
import { Page } from './components/page';
import { EventEmitter } from './components/base/events';
import { Card } from './components/card';
import { Basket } from './components/common/basket';
import { Modal } from './components/common/modal';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate,createElement,ensureElement } from './utils/utils';
import { IContactForm,IDeliveryForm,IOrder,IProduct } from './types';
import { Success } from './components/common/success';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(
	cloneTemplate<HTMLTemplateElement>(basketTemplate),
	events
);

const delivery = new DeliveryForm(
	cloneTemplate<HTMLFormElement>(deliveryTemplate),
	events
);
const contacts = new ContactForm(
	cloneTemplate<HTMLFormElement>(contactsTemplate),
	events
);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
	
});

events.on('preview:changed', (item: IProduct) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), {

		onClick: () => {
			if (item.price) {
				if (appData.orderStatus(item)) {
					appData.deleteProduct(item);
					modal.close();
				}
			 	else {
					events.emit('product:add', item);
				}
			}
		},
		}
		 );
		 const buttonText = item.price
		  ? appData.orderStatus(item)
		   ? 'Убрать'
		   : 'В корзину'
		  : '∞';
		 card.setDisabledNonPriceButton(!item.price);
		 card.btnText(buttonText);

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		}),
	});
});

events.on('product:add', (item: IProduct) => {
	appData.addProduct(item);
basket.render();
	modal.close();
});

events.on('product:delete', (item: IProduct) => {
	appData.deleteProduct(item);
	basket.total = appData.getTotal();
	modal.close();
	basket.selected = appData.order.items;
	basket.checkBasket(basket.total);
});

events.on('basket:change', () => {
	basket.items = appData.basket.map((item, index) => {
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.deleteProduct(item);
				basket.selected = appData.order.items;
				basket.total = appData.getTotal();
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: (index + 1).toString(),
		});
	});
	basket.selected = appData.order.items;
	basket.total = appData.getTotal();
	page.counter = appData.basket.length;
	basket.checkBasket(basket.total);
});

events.on('basket:open', () => {
	basket.selected = appData.order.items;
	
	modal.render({
		content: basket.render(),
	});
});

events.on('delivery:open', () => {
	appData.order.total = appData.getTotal();
	modal.render({
		content: delivery.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('deliveryErrors:change', (errors: Partial<IDeliveryForm>) => {
	const { payment, address } = errors;
	delivery.valid = !payment && !address;
	delivery.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('payment:change', (target: HTMLButtonElement) => {
	appData.order.payment = target.name;
});

events.on(
	'order.address:change',
	(data: { field: keyof IDeliveryForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {

	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});

});

events.on('contactsErrors:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');

});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
	  modal.close(); 
	},
  });
  
  events.on('contacts:submit', () => {
	api.orderProduct(appData.order)
	  .then((result) => {
		modal.render({
		  content: success.render({
			total: appData.getTotal(),
		  }),
		});
		
		appData.clearBasket();
		basket.total = appData.getTotal();
		basket.selected = appData.order.items;
		page.counter = appData.basket.length;
	  })
	  .catch((err) => {
		console.error(err);
	  });
  });

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
