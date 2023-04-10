// TODO: write your code here
import sum from './basic';
import { mdConvert } from 'md-converter';

document.addEventListener('DOMContentLoaded', () => {
/*
весь код приложения внутри обработчика
данного события начнет работать после загрузки DOM
*/

  console.log('worked');
  console.log(sum([1, 2]));

  const fileContainer = document.querySelector('.file-container');
  const fileInput = fileContainer.querySelector('.overlapped')

  const previewTitle = document.querySelector('.preview-title');
  const previewText = document.querySelector('.preview-text');
  const previewHTML = document.querySelector('.preview-html');
  const previewImage = document.querySelector('.preview-image');


  fileContainer.addEventListener('click', (e) => {
    console.log('click');

    fileInput.dispatchEvent(new MouseEvent('click'))
  })

  const displayTextContent = (e) => {
    console.log(e); // ВАЖНО! 
    // ProgressEvent => CurrentTarget => result (содержимое файла пользователя) 
    previewText.textContent = e.target.result;
  }

  const displayMDContent = (e) => {
    console.log(e);

    previewHTML.innerHTML = mdConvert(e.target.result);
  }

  const displayImageContent = (e) => {
    console.log(e);

    previewImage.src = e.target.result;
  }

  fileInput.addEventListener('change', (e) => {
    console.log(e)
    console.dir(fileInput); // доступ к объекту-узлу

    //если файл прикреплен, то file === fileInput.files[0], если нет - то false
    const file = fileInput.files && fileInput.files[0];

    if(!file) return;

    previewTitle.textContent = file.name;

    const url = URL.createObjectURL(file);

    previewImage.src = url; // отправление ссылки в тег

    const link = document.createElement('a'); 
    link.href = url;
    link.rel = 'noopener'; // скачивание файла по ссылке, 
    // так же возможно открытие в новой или в текущей вкладке
    link.download = file.name; // с каким именем будет скачиваться файл

    link.click(); // метод клик, который вызывает despachEvent();

    setTimeout(() => URL.revokeObjectURL(url), 0); // удаляет файл из памяти пользователя

    console.log(url)

    // прочитать содержимое файла
    // const reader = new FileReader();

    // reader.addEventListener('load', displayTextContent);
    // reader.addEventListener('load', displayMDContent);
    // Прочитать содержимое как текст
    // reader.readAsText(file);


    // reader.addEventListener('load', displayImageContent);
    // //Прочитать содержимое как dataURL
    // reader.readAsDataURL(file);


  })

  const items = document.querySelector('.items');
  const itemsElements = items.querySelector('.items-item');

  let actualElement; // перенос элемента в замыкание для доступа 
  
  const onMouseOver = (e) => {
    console.log(e);

    actualElement.style.top = e.clientY + 'px';
    actualElement.style.left = e.clientX + 'px';

  }

  const onMouseUp = (e) => { // снять класс перетаскивания с актуального элемента
    const mouseDownItem = e.target; // элемент на котором произошло событие mousedown

    items.insertBefore(actualElement, mouseDownItem); // поменять местами элементы
    actualElement.classList.remove('dragged');

    actualElement = undefined;

    document.documentElement.removeEventListener('mouseup', onMouseUp);
    document.documentElement.removeEventListener('mouseover', onMouseOver);
  }

  // перехват всплытия события mousedown на контейнере
  items.addEventListener('mousedown', (e) => {
    e.preventDefault(); // отменить выделение текста при перемещении курсора
    actualElement = e.target; // из объекта события достать тот элемент, на который кликнули
    
    actualElement.classList.add('dragged');

    document.documentElement.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseover', onMouseOver);
  })
});



