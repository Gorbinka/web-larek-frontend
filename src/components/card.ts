//В этом коде определен класс Card, который представляет карточку товара и расширяет класс component<ICard>.
//Класс Card имеет свойства для элементов карточки товара, такие как заголовок, изображение, описание, категория, цена и индекс.

import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { component } from "./base/component";

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// Интерфейс для данных карточки товара
interface ICard extends IProduct {
	index?: string; // Индекс карточки
	buttonTitle?: string; // Название кнопки
}

export class Card<T> extends component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _index?: HTMLElement;
	protected _button?: HTMLButtonElement;

	// В конструкторе класса Card принимаются параметры blockName (название блока), container (контейнер, в котором будет создана карточка) 
	//и actions (действия, связанные с карточкой, например, обработчик события клика).
	constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
		super(container);

		//Инициализируются элементы карточки товара из контейнера и добавляются обработчики событий.
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector<HTMLElement>(`.${blockName}__text`);
		this._category = container.querySelector(`.card__category`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._index = container.querySelector<HTMLElement>(`.basket__item-index`);
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	//задает и возвращает идентификатор карточки;
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	//задает и возвращает заголовок карточки;
	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	//задает изображение карточки с возможностью указать заголовок;
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	//задает и возвращает описание карточки;
	set description(value: string) {
		this.setText(this._description, value);
	}

	//задает и возвращает категорию карточки;
	set category(value: string) {
		this.setText(this._category, value);
	}

	//задает и возвращает цену карточки, при этом если цена null, текст устанавливается как "Бесценно";
	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	//задает и возвращает индекс карточки.
	set index(value: string) {
		this.setText(this._index, value);
	}
}