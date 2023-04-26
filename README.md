**Стек разработки:** JS, HTML, CSS

**Задание:**
На входе имеем массив объектов. Необходимо отобразить их в виде списка. 
При наведении на название элемента из списка, должна появиться панель, в которой будет отображено описание и характеристики выделенного элемента. 
Если ни один из элементов не выделен, всплывающая панель не отображается.

**Основные цели:**
+	Приложение должно включать в себя минимум два основных компонента:
    + Вертикальный список с наименованиями элементов – по умолчанию должно отображаться 10 элементов;
    + Всплывающая панель с параметрами элемента.
+ Данные для списка нужно получать http-запросами с fake api [dummyjson.com]( https://dummyjson.com) (запрос к «/products»).
+ Должна быть возможность перетаскивать элементы внутри списка, менять их местами.

**Дополнительные цели:**
+	Добавить возможность указывать, сколько элементов мы хотим видеть в текущем списке (и, соответственно, отображать столько же).
+ Добавить возможность сортировки элементов по разным параметрам (по имени, по цене и т.п.) – достаточно будет 1-2 параметра.
