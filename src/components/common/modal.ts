//Код представляет класс модального окна, который открывает, закрывает и обновляет контент модального окна.

import { ensureElement } from "../../utils/utils";
import { component } from "../base/component";
import { IEvents } from "../base/events";

//Определение интерфейса IModalData, которым описывается данные для модального окна.
//В данном случае, модальное окно содержит свойство content, которое является HTML элементом.
export interface IModalData {
	content:HTMLElement;
}

//Класс Modal расширяется от базового класса component и указывает тип данных интерфейса IModalData.
export class Modal extends component<IModalData> {
	protected _closeButton:HTMLButtonElement;//кнопка закрытия модального окна
	protected _content: HTMLElement;//контент модального окна

	//Конструктор класса принимает контейнер для модального окна и экземпляр IEvents.
	constructor(container:HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(".modal__close", container);

		//Cлушатели событий для кнопки закрытия модального окна, контейнера модального окна и контента модального окна.
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	//Cеттер для свойстаа content, который обновляет контент модального окна.
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	//Метод open добавляет класс modal_active к контейнеру модального окна и генерирует событие modal:open.
	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	//Метод close удаляет класс modal_active у контейнера модального окна, очищает контент модального окна и генерирует событие modal:close.
	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	//Метод render вызывает метод родительского класса render, открывает модальное окно и возвращает контейнер модального окна.
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}