//Этот код представляет класс корзины, который отображает элементы, обновляет общую сумму и реагирует на действия пользователя, используя события.

import { createElement, ensureElement } from "../../utils/utils";
import { component } from "../base/component";
import { EventEmitter } from "../base/events";


//Опрелеление интерфейса IBasket, который описывает свойства корзины.
//Cвойства: items (массив элементов DOM), total (общая цена) и selected (выбранные элементы).
export interface IBasket {
	items:HTMLElement[];
	total:number;
	selected:string[];
}

//Класс Basket расширяет класс component и указывает тип данных интерфейса IBasket.
// Он содержит элементы DOM для списка _list, общей цены _total и кнопки _button.
// Конструктор принимает контейнер и экземпляр EventEmitter.
export class Basket extends component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container:HTMLElement, protected events:EventEmitter) {
		super(container);

		//Создает или находит элемент с селектором .basket__list в контейнере и присваивает его свойству _list.
		this._list = ensureElement<HTMLElement>(".basket__list" , this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('delivery:open');
			});
		}
		this.items = [];
	}

	//Установка свойства items обновляет содержимое списка корзины в зависимости от переданных элементов DOM.
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

    checkBasket(total: number) {
        if (total === 0) {
            this._button.setAttribute('disabled', 'disabled');
        } else {
            this._button.removeAttribute('disabled');
        }
    }

	//Установка свойства selected включает или отключает кнопку корзины в зависимости от выбранных элементов.
	set selected(items: string[]) {
		if (items.length !== 0) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	//Установка свойства total обновляет содержимое элемента _total с общей суммой синапсов, преобразуя ее в строку.
	set total(total: number) {
		this.setText(this._total, `${total.toString()} синапсов`);
		this.checkBasket(total);
	}
}