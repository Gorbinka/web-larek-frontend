//Этот код представляет класс формы, обрабатывающий ввод пользователя, валидацию, отображение ошибок и генерацию событий.

import { ensureElement } from "../../utils/utils";
import { component } from "../base/component";
import { IEvents } from "../base/events";

// Определение интерфейса IFormState, который описывает состояние формы.
// Свойства: valid (флаг валидности формы) и errors (массив строк с ошибками).
export interface IFormState {
	valid: boolean;
	errors: string[];
}

//Класс Form расширяет класс component и указывает тип данных интерфейса IFormState.
//Он принимает тип T в качестве генерического типа.
//Конструктор принимает контейнер формы и экземпляр IEvents.
export class Form<T> extends component<IFormState> {
	protected _submit: HTMLButtonElement;//кнопка submit формы
	protected _errors: HTMLElement;//элемент для отображения ошибок

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);


		//Cлушатели событий input и submit на контейнер формы.
		//При отправке формы вызывается соответствующий метод для обработки события submit.
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	//При вводе данных вызывается метод onInputChange, который генерирует событие change с измененными данными.
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	//Cеттер для свойства valid, который управляет доступностью кнопки submit.
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}
	//Cеттер для свойства errors, который устанавливает текст ошибок в элемент _errors.
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	// Метод render обновляет состояние формы, включая валидность и ошибки.
	// Он вызывает метод родительского класса render, передавая валидность и ошибки,
	// а также применяет остальные данные из объекта состояния к текущему экземпляру формы.
	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}