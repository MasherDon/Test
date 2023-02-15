const list = document.querySelector('ul'); //найти список
let numberElement = 10; //стартовое количество элементов

const slider = document.querySelector(".slider"); //полузнок
const output = document.querySelector(".demo"); //вывод

slider.oninput = function() { //изсенение ползунка
    numberElement = this.value;
    output.innerHTML = this.value;
}

async function response(numberElement) { //функция запроса
    try {
        const productsList = await fetch(`https://dummyjson.com/products?limit=${numberElement}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (productsList.ok === true) {
            return await productsList.json()
        }
    } catch (error) {
        console.log('error');
    }
}

function addingElement(product) { //функция добавления элемента списка
    const li = document.createElement('li'); //сохадние элемента
    li.draggable = true; //перетасивание
    li.className = 'lab';
    document.querySelector('ul').appendChild(li); //добавление элемента
    li.appendChild(document.createTextNode(product['title']))
    setTimeout(function() { //задежка для анимации
        li.className = 'lab show';
    }, 600);

    const pop = document.createElement('div'); //раздел
    pop.className = 'pop';
    const pointer = document.createElement('span'); //стрлека пеехода
    pointer.className = 'fa fa-chevron-right';
    const popUp = document.createElement('div'); //всплывающее окно
    popUp.className = 'popUp';

    const categoryBrand = document.createElement('p'); //категория и бренд
    categoryBrand.className = 'brand';
    categoryBrand.innerHTML = `${product['category']} / ${product['brand']}`;

    const thumbnail = document.createElement('img'); //главное изображение
    thumbnail.alt = product['title'];
    thumbnail.src = product['thumbnail'];
    thumbnail.draggable = false; //чтоб не двигали

    const priceDiscountPercentage = document.createElement('p'); //зона информации
    priceDiscountPercentage.className = 'buffer'
    const price = document.createElement('mark'); //стоимость
    price.innerHTML = `${product['price']} $`;
    const discountPercentage = document.createElement('i'); //округленная скидка
    discountPercentage.innerHTML = ` - ${Math.round(product['discountPercentage'])} % `;
    const startingPrice = document.createElement('s'); //округленная цена без скидки
    startingPrice.innerHTML = `${Math.trunc(product['price']+(product['price']*(product['discountPercentage'])/100))} $`;

    priceDiscountPercentage.appendChild(price); //добавленеи параметов выше
    priceDiscountPercentage.appendChild(discountPercentage);
    priceDiscountPercentage.appendChild(startingPrice);

    const rating = document.createElement('sup'); //рейтинг
    rating.innerHTML = product['rating'];
    priceDiscountPercentage.appendChild(rating);

    for (let x = Math.round(product['rating']); x < 5; x++) { //добавляем незакрышенные звезды
        const ratingBleak = document.createElement('span');
        ratingBleak.className = 'fa fa-star';
        priceDiscountPercentage.appendChild(ratingBleak);
    }
    for (let x = 0; x < Math.round(product['rating']); x++) { //звезды
        const ratingStar = document.createElement('span');
        ratingStar.className = 'fa fa-star dedicated';
        priceDiscountPercentage.appendChild(ratingStar);
    }

    const description = document.createElement('p'); //описание
    description.className = 'description';
    description.innerHTML = product['description'];

    const stock = document.createElement('p'); //в наличии
    stock.className = 'stock';
    stock.innerHTML = `in stock: ${product['stock']}`;

    popUp.appendChild(categoryBrand); //добваление всего остального
    popUp.appendChild(thumbnail);
    popUp.appendChild(priceDiscountPercentage);
    popUp.appendChild(description);
    popUp.appendChild(stock);
    pop.appendChild(pointer);
    pop.appendChild(popUp);
    li.appendChild(pop);

    pop.onmouseenter = function() { //событие при наведении
        li.draggable = false; //блокирование перетаскивания при всплывающем окне
        popUp.style.display = 'flex'; //для анимации высплывающего окна
        setTimeout(function() {
            popUp.className = 'popUp hi';
        }, 300);
    }
    pop.onmouseleave = function() { //при выходе
        li.draggable = true;
        popUp.className = 'popUp';
        setTimeout(function() {
            popUp.style.display = 'none';
        }, 10);
    }
}

list.addEventListener('dragstart',(evt) => { //событие начало
    evt.target.classList.add('selected');
});
list.addEventListener('dragend',(evt) => { //после
    evt.target.classList.remove('selected');
});

list.addEventListener('dragover',(evt) => { //перетаскиваем
    evt.preventDefault(); //элемент для сброса
    const active = list.querySelector('.lab.show.selected'); //активный элемент
    const current = evt.target; //куда
    if (active === current || current.classList.value !== 'lab show') {
        return;
    } //исключение повтор
    const currentCenter = current.getBoundingClientRect().y + current.getBoundingClientRect().height / 2;
    const next = (evt.clientY < currentCenter) ? current : current.nextElementSibling; //нахождение следующего элемента если дальше
    if (next && active === next.previousElementSibling || active === next) {
        return;
    } //исключение
    list.insertBefore(active, next); //замена
});

async function startAddingElement() { //начально добваление
    const products = await response(10); //запрос на 10 элементов
    if (products !== undefined) {
        for (let i = 0; i < 10; i++) {
            await new Promise(r => setTimeout(r, 50)); //задежка мужду
            addingElement(products['products'][i]);
        }
    }
}

startAddingElement().then(r => r);

async function sortingAddingElement() { //добавить элементы
    const button = document.querySelector(".button"); //кнопка
    button.disabled = true; //блокировка от дурака
    const select = document.querySelector('#select'); //список
    select.disabled = true;
    const slider = document.querySelector('.slider'); //ползунок
    slider.disabled = true;
    const valueSelect = document.querySelector('#select').value; //сортировка
    const products = await response(numberElement); //запрос
    const ollLi = document.querySelectorAll('li'); //найти все элементы
    for (let li = ollLi.length - 1; li > - 1; li--) {
        await new Promise(r => setTimeout(r, 50)); //задержака между
        ollLi[li].className = 'lab';
        setTimeout(function() { //задржка для анимации
            ollLi[li].remove(); //удаление
        }, 600);
    }
    if (products !== undefined) {
        if (valueSelect !== 'none') {
            for (let i = 0; i < numberElement; i++) { //сортировка
                let ind = 1;
                for (let x = 0; x < numberElement; x++) {
                    if (products['products'][x][valueSelect] > products['products'][ind][valueSelect]) {
                        ind = x;
                    }
                }
                await new Promise(r => setTimeout(r, 50)); //задржка между
                addingElement(products['products'][ind]); //добавляем элемент
                products['products'][ind][valueSelect] = 0;
            }
        } else { //в случае отсутствия сортировки
            for (let i = 0; i < numberElement; i++) {
                await new Promise(r => setTimeout(r, 50));
                addingElement(products['products'][i]);
            }
        }
    }
    button.disabled = false; //разблокирование элементов управления
    select.disabled = false;
    slider.disabled = false;
}
