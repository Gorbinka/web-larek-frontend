export abstract class component<T> {

	//Конструктор класса, принимающий контейнер (HTMLElement),
	// в котором будет происходить отображение компонента.
	protected constructor(protected readonly container:HTMLElement) {}

	//Метод для переключения класса у элемента. Если указан параметр force, 
	//то класс будет установлен или удален в зависимости от его значения.
	toggleClass(element:HTMLElement, className:string, force?:boolean) {
		element.classList.toggle(className, force);
	}

	//Метод для установки текстового содержимого элемента.
	protected setText(element:HTMLElement,value:unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	//Метод для установки статуса блокировки элемента.
	setDisabled(element:HTMLElement, state:boolean) {
		if(element) {
			if(state) {
				element.setAttribute("disabled", "disabled");
			}
			else {
				element.removeAttribute("disabled");
			}
		}
	}
	
	//Метод для скрытия элемента.
	protected setHidden(element:HTMLElement) {
		element.style.display = "none";
	}

	//Метод для отображения элемента (удаление стиля display: none).
	protected setVisible(element:HTMLElement) {
		element.style.removeProperty("disabled");
	}

	//Метод для установки изображения с возможностью указания альтернативного текста.
	protected setImage(element:HTMLImageElement, src:string, alt?:string) {
		if(element) {
			element.src = src;
			if(alt) {
				element.alt = alt;
			}
		}
	}

	//Метод для рендеринга компонента, принимающий частичные 
	//данные и возвращающий корневой DOM-элемент.
	render(data?:Partial<T>):HTMLElement {
		Object.assign(this as object, data?? {});
		return this.container;
	}
}