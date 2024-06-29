//Этот код представляет класс AppState, который расширяет класс Model<IAppState> и содержит логику управления состоянием приложения.
import { IEvents } from '../components/base/events';
import { FormErrors , IAppState , IContactForm, IDeliveryForm, IOrder, IProduct } from "../types";
import { Model } from "./base/model";

//определение типа CatalogChangeEvent для события изменения каталога товаров.
export type CatalogChangeEvent = {
	catalog: IProduct[];
};

//класс AppState также расширяется от Model<IAppState> и содержит состояние приложения,
//такие как catalog, basket (корзина), order (заказ), preview (предпросмотр) и formErrors (ошибки формы).
export class AppState extends Model<IAppState> {
	catalog: IProduct[];
	basket: IProduct[] = [];
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
	clearBasket():void {
		this.basket = [];
		this.resetOrder();
		this.emitChanges('basket:change', this.basket);
	}

	//Добавляет продукт в корзину и обновляет статус заказа.
	addProduct(item: IProduct): void {
		this.basket.push(item);
		this.order.items.push(item.id);
		this.emitChanges('basket:change', this.basket);
	}

	//Удаляет продукт из корзины и обновляет статус заказа.
	deleteProduct(item: IProduct): void {
		const index = this.basket.indexOf(item);
		if (index !== -1) {
			this.basket.splice(index, 1);
			this.order.items.splice(index, 1);
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

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	  }
	  

	getOrderedProducts(): IProduct[] {
		return this.basket;
	}

	//Устанавливает товар для предпросмотра и генерирует соответствующее событие.
	setPreview(item: IProduct) {
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


	orderStatus(item: IProduct): boolean {
		return this.basket.includes(item);
	   }
}