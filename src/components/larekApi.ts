import { IOrder, IOrderResult, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";

//Определение интерфейа ILarekApi
export interface ILarekApi {
	getProductList: () => Promise<IProduct[]>; // Получение списка товаров
	getProductItem: (id: string) => Promise<IProduct>; // Получение информации о конкретном товаре
	orderProduct: (order: IOrder) => Promise<IOrderResult>; // Оформление заказа товаров
}

//Класс LarekApi реализует интерфейс ILarekApi и расширяет класс Api.
export class LarekApi extends Api implements ILarekApi {
	readonly cdn: string;//URL-адрес CDN

	//В конструкторе класса LarekApi принимаются значения cdn, baseUrl и options, которые передаются в конструктор класса Api.
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	//Метод getProductList() использует метод get() из класса Api, чтобы получить список продуктов.
	//После получения данных, каждый элемент списка модифицируется, добавляя к нему URL изображения из cdn.
	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	//Метод getProductItem(id: string) также использует метод get(), чтобы получить информацию о конкретном продукте по его идентификатору.
	//Затем информация о продукте модифицируется аналогично getProductList().
	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	//Метод orderProduct(order: IOrder) использует метод post() из класса Api для оформления заказа товаров.
	// Данные о заказе возвращаются в виде объекта IOrderResult.
	orderProduct(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}