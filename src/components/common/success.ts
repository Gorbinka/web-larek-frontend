//Код представляет класс Success, который отображает успешное сообщение 
//с общим количеством синапсов и имеет возможность передать действие при клике на элемент закрытия.

import { ensureElement, formatNumber } from "../../utils/utils";
import { component } from "../base/component";


//Определение интерфейса ISuccess, которым описывается объект с одним свойством total, которое представляет собой число.
export interface ISuccess {
	total: number; 
}

//Опрелеление интерфейса ISuccessActions, который описывает объект с одним свойством onClick, представляющим собой функцию без параметров и возвращения.
export interface ISuccessActions {
	onClick: () => void;
}

//Класс Success расширяется от базового класса component и указывает тип данных интерфейса ISuccess.
export class Success extends component<ISuccess> {
	protected _close: HTMLElement;//элемент закрытия успешного сообщения
	protected _total: HTMLElement;//элемент, отображающий общее количество синапсов

	//Конструктор класса принимает контейнер для успешного сообщения и экземпляр ISuccessActions.
	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._total = ensureElement<HTMLElement>('.order-success__description',container);

		this._close = ensureElement<HTMLElement>('.order-success__close',this.container);
//В конструкторе класса устанавливаются элементы _total и _close, а также добавляется слушатель событий.
//При клике на элемент вызвано действие.
		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	//Сеттер, который устанавливает текст элемента _total в переданное значение total.
	set total(total: number) {
		this.setText(this._total, `${total.toString()} синапсов`);
	}
}