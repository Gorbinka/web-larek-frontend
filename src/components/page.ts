//Код представляет класс Page, который отображает страницу с возможностью обновления счётчика,
//замены каталога элементов и управления блокировкой контента на странице.
//Реагирует на событие открытия корзины при клике на элемент корзины.

import { ensureElement } from "../utils/utils";
import { component } from "./base/component";
import { IEvents } from "./base/events";

//Определение интерфейса IPage, описывающий страницу тремя свойствами: counter, catalog(элементы каталога) и locked.
export interface IPage {
	counter: number | null;
	catalog: HTMLElement[];
	locked: boolean;
}

//Класс Page расширяется от базового класса component и указывает тип данных интерфейса IPage.
export class Page extends component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	//Конструктор класса принимает контейнер для страницы и объект IEvents.
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		//Слушатель событий, который при клике на элементе вызывает событие 'basket:open' с помощью метода emit из объекта events.
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}
	
	//Сеттер, который устанавливает текст элемента _counter в переданное значение value.
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	//Сеттер, который заменяет содержимое элемента _catalog массивом переданных элементов.
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	//Сеттер, который добавляет или удаляет класс page__wrapper_locked у элемента _wrapper в зависимости от переданного значения value.
	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}