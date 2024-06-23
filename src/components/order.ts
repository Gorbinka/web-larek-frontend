import { IContactForm, IDeliveryForm } from "../types";
import { ensureAllElements } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/form";


//Класс DeliveryForm расширяет класс Form<IDeliveryForm>
export class DeliveryForm extends Form<IDeliveryForm> {
	protected _paymentButtons: HTMLButtonElement[];

	//Конструктор принимает контейнер формы и объект events.
	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		//Ищутся и сохраняются все кнопки с классом button_alt из контейнера формы.
		this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

		//Для каждой кнопки устанавливается слушатель события click, который при активации обновляет свойство payment и генерирует событие 'payment:change'.
		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				events.emit('payment:change', button);
			});
		});
	}

	//Сеттер payment, который переключает класс button_alt-active на кнопках в соответствии с переданным именем.
	set payment(name: string) {
		this._paymentButtons.forEach((button) => {
			if (button.name === name) {
				button.classList.add('button_alt-active');
			} else {
				button.classList.remove('button_alt-active');
			}
		});
	}

	//Сеттер address, который устанавливает значение поля формы с именем address.
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}

// Класс ContactForm также расширяет класс Form<IContactForm>.
export class ContactForm extends Form<IContactForm> {
	//Конструктор класса ContactForm принимает контейнер формы и объект events.
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
	
//Сеттеры phone и email, которые устанавливают значения полей формы с именами phone и email соответственно.
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}
}