// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"name": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"name": "Дуриан", "color": "зеленый", "weight": 35},
  {"name": "Личи", "color": "розово-красный", "weight": 17},
  {"name": "Карамбола", "color": "желтый", "weight": 28},
  {"name": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

// отрисовка карточек
const display = () => {
  // очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = '';

  for (let i = 0; i < fruits.length; i++) {
    // формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    const fruit = document.createElement('li');
    fruitsList.appendChild(fruit);

  // сопоставляем русские названия цветов с английскими именами классов
   const colorClasses = {
  "фиолетовый": "violet",
  "зеленый": "green",
  "розово-красный": "carmazin",
  "желтый": "yellow",
  "светло-коричневый": "lightbrown"
  };

  // если цвет фрукта не может быть преобразован в допустимое имя класса в CSS, будет использован пустой класс.
  const colorClass = colorClasses[fruits[i].color] || '';

  fruit.classList.add('fruit__item', `fruit_${colorClass}`);

  const fruitInfo = document.createElement('div');
  fruitInfo.classList.add('fruit__info');
  
  const index = document.createElement('div');
  index.textContent = `index: ${i+1}`;
  
  const kind = document.createElement('div');
  kind.textContent = `kind: ${fruits[i].name}`;
  
  const color = document.createElement('div');
  color.textContent = `color: ${fruits[i].color}`;
  
  const weight = document.createElement('div');
  weight.textContent = `weight (кг): ${fruits[i].weight}`;
  
  fruitInfo.appendChild(index);
  fruitInfo.appendChild(kind);
  fruitInfo.appendChild(color);
  fruitInfo.appendChild(weight);
  
  fruit.appendChild(fruitInfo);
  
  fruitsList.appendChild(fruit);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let n = fruits.length;

  while (n > 1) {
    // выбираем случайный индекс из оставшихся элементов
    let k = getRandomInt(0, n - 1);

    // меняем местами текущий элемент с последним элементом в текущем массиве
    let temp = fruits[k];
    fruits[k] = fruits[n - 1];
    fruits[n - 1] = temp;

    // уменьшаем длину массива на 1
    n--;
  }

  // проверяем, изменился ли порядок в массиве fruits
  if (JSON.stringify(fruits) === JSON.stringify(result)) {
    alert('Порядок не изменился');
  }
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
  
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива

const filterFruits = () => {
  const minWeight = parseFloat(document.querySelector('.minweight__input').value);
  const maxWeight = parseFloat(document.querySelector('.maxweight__input').value);


  fruits = fruits.filter((item) => {
    const weight = parseFloat(item.weight);
    return weight >= minWeight && weight <= maxWeight;
  });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

const comparationColor = (a, b) => {
  const priority = ['красный', 'оранжевый', 'желтый', 'зеленый', 'голубой', 'синий', 'фиолетовый'];

  // Сравниваем элементы по цвету
  const aPriority = priority.indexOf(a.color);
  const bPriority = priority.indexOf(b.color);

  if (aPriority === bPriority) {
    // Если элементы равны по цвету, сравниваем их по имени
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
  // Возвращаем результат сравнения по приоритету цвета
  return aPriority - bPriority;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  },

  quickSort(arr, comparation) {
    const qSort = (arr, left, right, comparation) => {
      if (left >= right) {
        return;
      }
      let pivotIndex = Math.floor((left + right) / 2);
      let pivot = arr[pivotIndex];
      let i = left;
      let j = right;
      while (i <= j) {
        while (comparation(arr[i], pivot) < 0) {
          i++;
        }
        while (comparation(arr[j], pivot) > 0) {
          j--;
        }
        if (i <= j) {
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          i++;
          j--;
        }
      }
      qSort(arr, left, j, comparation);
      qSort(arr, i, right, comparation);
    };
    qSort(arr, 0, arr.length - 1, comparation);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if (sortKind === 'bubbleSort') {
    sortKind = 'quickSort';
  } else {
    sortKind = 'bubbleSort';
  }
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});


/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const kindValue = kindInput.value;
  const colorValue = colorInput.value;
  const weightValue = weightInput.value;

  if (!kindValue || !colorValue || !weightValue) {
    alert('Для добавления фрукта нужно заполнить все поля');
    return;
  }

  fruits.push({
    name: kindValue,
    color: colorValue,
    weight: weightValue
  });

  display();
});

