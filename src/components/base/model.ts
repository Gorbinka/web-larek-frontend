//Этот код взаимодействует с внешним интерфейсом событий IEvents

import { IEvents } from "./events";

//Функция isModel принимает объект типа unknown и проверяет, является ли он экземпляром класса Model<any>.
//Она возвращает логическое значение: true, если объект является экземпляром Model<any>,в противном случае false.
export const isModel = (obj:unknown): obj is Model<any> => {
	return obj instanceof Model;
}

//В этом классе Model<T> определен конструктор, который принимает частичные данные типа T и экземпляр интерфейса IEvents. 
//Метод Object.assign(this, data) копирует свойства из data в экземпляр класса Model. 
//Метод emitChanges используется для генерации событий через экземпляр IEvents.
export class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}
	//Сообщение о смене модели
	emitChanges(event: string, playload?: object) {
	this.events.emit(event, playload ?? {});
	}
}