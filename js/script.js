const list = document.querySelector('ul');
let numberElement = 10;

const slider = document.querySelector(".slider");
const output = document.querySelector(".demo");
output.innerHTML = numberElement;

slider.oninput = function() {
    numberElement = this.value;
    output.innerHTML = this.value;
}

async function responseApi(numberElement) {
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
    } catch (err) {
        console.log('error ' + err);
    }
}

function addingElement(product) {
    const li = document.createElement('li');
    li.draggable = true;
    li.className = 'lab';
    document.querySelector('ul').appendChild(li);
    li.appendChild(document.createTextNode(product['title']))
    setTimeout(function() {
        li.className = 'lab show';
    }, 500);

    const pop = document.createElement('div');
    pop.className = 'pop';
    const pointer = document.createElement('span');
    pointer.className = 'fa fa-chevron-right';
    const popUp = document.createElement('div');
    popUp.className = 'popUp';

    const categoryBrand = document.createElement('p');
    categoryBrand.className = 'brand';
    categoryBrand.innerHTML = `${product['category']} / ${product['brand']}`;

    const thumbnail = document.createElement('img');
    thumbnail.alt = product['title'];
    thumbnail.src = product['thumbnail'];
    thumbnail.draggable = false;

    const priceDiscountPercentage = document.createElement('p');
    priceDiscountPercentage.className = 'buffer'
    const price = document.createElement('mark');
    price.innerHTML = `${product['price']} $`;
    const discountPercentage = document.createElement('i');
    discountPercentage.innerHTML = ` - ${Math.round(product['discountPercentage'])} % `;
    const startingPrice = document.createElement('s');
    startingPrice.innerHTML = `${Math.trunc(product['price']+(product['price']*(product['discountPercentage'])/100))} $`;

    priceDiscountPercentage.appendChild(price);
    priceDiscountPercentage.appendChild(discountPercentage);
    priceDiscountPercentage.appendChild(startingPrice);

    const rating = document.createElement('sup');
    rating.innerHTML = product['rating'];
    priceDiscountPercentage.appendChild(rating);

    for (let x = Math.round(product['rating']); x < 5; x++) {
        const ratingBleak = document.createElement('span');
        ratingBleak.className = 'fa fa-star';
        priceDiscountPercentage.appendChild(ratingBleak);
    }
    for (let x = 0; x < Math.round(product['rating']); x++) {
        const ratingStar = document.createElement('span');
        ratingStar.className = 'fa fa-star dedicated';
        priceDiscountPercentage.appendChild(ratingStar);
    }

    const description = document.createElement('p');
    description.className = 'description';
    description.innerHTML = product['description'];

    const stock = document.createElement('p');
    stock.className = 'stock';
    stock.innerHTML = `in stock: ${product['stock']}`;

    popUp.appendChild(categoryBrand);
    popUp.appendChild(thumbnail);
    popUp.appendChild(priceDiscountPercentage);
    popUp.appendChild(description);
    popUp.appendChild(stock);
    pop.appendChild(pointer);
    pop.appendChild(popUp);
    li.appendChild(pop);

    pop.onmouseenter = function() {
        li.draggable = false;
        popUp.style.display = 'flex';
        setTimeout(function() {
            popUp.className = 'popUp hi';
        });
    }
    pop.onmouseleave = function() {
        li.draggable = true;
        popUp.className = 'popUp';
        setTimeout(function() {
            popUp.style.display = 'none';
        });
    }
}

async function startAddingElement() {
    const productsList = await responseApi(10);
    if (!!productsList) {
        for (let i = 0; i < 10; i++) {
            await new Promise(r => setTimeout(r, 50));
            addingElement(productsList['products'][i]);
        }
    }
}

startAddingElement().then(r => r);

async function sortingAddingElement(numberElement) {
    const button = document.querySelector(".button");
    button.disabled = true;

    const valueSelect = document.querySelector('#select').value;
    const productsList = await responseApi(numberElement);
    const ollLi = document.querySelectorAll('li');

    for (let j = ollLi.length - 1; j > - 1; j--) {
        await new Promise(r => setTimeout(r, 50));
        ollLi[j].className = 'lab';
        setTimeout(function() {
            ollLi[j].remove();
        }, 500);
    }

    if (!!productsList) {
        if (valueSelect !== 'none') {
            for (let i = 0; i < numberElement; i++) {
                let ind = 1;
                for (let k = 0; k < numberElement; k++) {
                    if (productsList['products'][k][valueSelect] > productsList['products'][ind][valueSelect]) {
                        ind = k;
                    }
                }
                await new Promise(r => setTimeout(r, 50));
                addingElement(productsList['products'][ind]);
                productsList['products'][ind][valueSelect] = 0;
            }
        } else {
            for (let j = 0; j < numberElement; j++) {
                await new Promise(r => setTimeout(r, 50));
                addingElement(productsList['products'][j]);
            }
        }
    }

    button.disabled = false;
}

list.addEventListener('dragstart',(evt) => {
    evt.target.classList.add('selected');
});

list.addEventListener('dragend',(evt) => {
    evt.target.classList.remove('selected');
});

const getNextElement = (cursorPosition, currentElement) => {
    const currentElementCord = currentElement.getBoundingClientRect();
    const currentElementCenter = currentElementCord.y + currentElementCord.height / 2;
    return (cursorPosition < currentElementCenter) ? currentElement : currentElement.nextElementSibling;
};

list.addEventListener('dragover',(evt) => {
    evt.preventDefault();
    const activeElement = list.querySelector('.selected');
    const currentElement = evt.target;
    if (activeElement === currentElement) {
        return;
    }
    const nextElement = getNextElement(evt.clientY, currentElement);
    if (nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement) {
        return;
    }
    list.insertBefore(activeElement, nextElement);
});
