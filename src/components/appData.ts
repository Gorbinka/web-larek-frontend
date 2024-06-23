//Этот код представляет класс AppState, который расширяет класс Model<IAppState> и содержит логику управления состоянием приложения.

import { FormErrors , IAppState , IContactForm, IDeliveryForm, IOrder, IProduct } from "../types";
import { Model } from "./base/model";

//определение типа CatalogChangeEvent для события изменения каталога товаров.
export type CatalogChangeEvent = {
	catalog: Product[];
};

//определяется класс Product, который наследуется от Model<IProduct> и имеет свойства id, description, image, title, category и price.
//Этот класс используется для представления информации о продукте.
export class Product extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

//класс AppState также расширяется от Model<IAppState> и содержит состояние приложения,
//такие как catalog, basket (корзина), order (заказ), preview (предпросмотр) и formErrors (ошибки формы).
export class AppState extends Model<IAppState> {
	catalog: Product[];
	basket: Product[] = [];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	//Очищает корзину и заказ.
	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

	//Добавляет продукт в корзину и обновляет статус заказа.
	addProduct(item: Product): void {
		this.basket.push(item);
		this.order.items.push(item.id);
		this.emitChanges('basket:change', this.basket);
	}

	//Удаляет продукт из корзины и обновляет статус заказа.
	deleteProduct(item: Product): void {
		const index = this.basket.indexOf(item);
		if (index !== -1) {
			this.basket.splice(index, 1);
		}
		this.emitChanges('basket:change', this.basket);
	}

	//Сбрасывает данные заказа.
	resetOrder() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
	}

	//Получить общую стоимость заказа
	getTotal(): number {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	//Устанавливает каталог товаров и генерирует соответствующее событие изменения.
	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}


	//Устанавливает товар для предпросмотра и генерирует соответствующее событие.
	setPreview(item: Product) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	//Устанавливает значение поля заказа и проверяет форму доставки.
	setOrderField(field: keyof IDeliveryForm, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('delivery:ready', this.order);
		}
	}

	// Проверить форму доставки
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		this.formErrors = errors;
		this.events.emit('deliveryErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Установить значения полей контактов
	setContactField(field: keyof IContactForm, value: string) {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	// Проверяет форму контактов и генерирует соответствующее событие.
	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Укажите адрес электронной почты';
		}
		if (!this.order.phone) {
			errors.phone = 'Укажите номер тедефона';
		}
		this.formErrors = errors;
		this.events.emit('contactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}

