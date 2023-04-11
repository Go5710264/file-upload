// TODO: write your code here
import { mdConvert } from 'md-converter';

document.addEventListener('DOMContentLoaded', () => {
  const fileContainer = document.querySelector('.file-container');
  const fieldDraggingFile = document.querySelector('.field_dragging_file');
  const fileInput = fileContainer.querySelector('.overlapped')

  const previewItem = document.querySelectorAll('.preview');
  const previewTitle = document.querySelector('.preview-title');
  const previewText = document.querySelector('.preview-text');
  const previewHTML = document.querySelector('.preview-html');
  const previewImage = document.querySelector('.preview-image');


  fileContainer.addEventListener('click', (e) => {
    fileInput.dispatchEvent(new MouseEvent('click'))
  })

  const displayTextContent = (e) => {
    previewText.textContent = e.target.result;
  }

  const displayMDContent = (e) => {
    previewHTML.innerHTML = mdConvert(e.target.result);
  }

  const displayImageContent = (e) => {
    previewImage.src = e.target.result;
  }

  fileInput.addEventListener('change', (e) => {
    const file = fileInput.files && fileInput.files[0];

    if(!file) return;

    previewTitle.textContent = file.name;

    const reader = new FileReader();

    [...previewItem].forEach( item => {
      if(item === previewText && previewText.textContent) item.textContent = '';
      if(item === previewHTML && previewHTML.firstElementChild) item.innerHTML = '';
      if(item === previewImage && previewImage.src) item.removeAttribute('src');
    })
    
    if (file.name.match(/\.(png|svg|jpg|jpeg|gif)$/i)){
      reader.addEventListener('load', displayImageContent);
      reader.readAsDataURL(file);
    } else if (file.name.match(/\.(html|css|js|json|txt)$/i)){
      reader.addEventListener('load', displayTextContent);
      reader.readAsText(file); 
    } else if (file.name.match(/\.md$/i)){
      reader.addEventListener('load', displayMDContent);
      reader.readAsText(file); 
    }

  })

  
  // drag and drop API

  fieldDraggingFile.addEventListener('dragover', (e) => {
    e.preventDefault();
  })

  fieldDraggingFile.addEventListener('drop', (e) => {
    e.preventDefault();

    previewTitle.textContent = e.dataTransfer.files[0].name;

    previewImage.src = URL.createObjectURL(e.dataTransfer.files[0])
  })


  const items = document.querySelector('.items');
  let actualElement;
  
  const onMouseOver = (e) => {
    actualElement.style.top = e.clientY + 'px';
    actualElement.style.left = e.clientX + 'px';
  }

  const onMouseUp = (e) => { 
    const mouseDownItem = e.target;

    items.insertBefore(actualElement, mouseDownItem);
    actualElement.classList.remove('dragged');

    actualElement = undefined;

    document.documentElement.removeEventListener('mouseup', onMouseUp);
    document.documentElement.removeEventListener('mouseover', onMouseOver);
  }

  
  items.addEventListener('mousedown', (e) => {
    e.preventDefault(); 
    actualElement = e.target;
    
    actualElement.classList.add('dragged');

    document.documentElement.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseover', onMouseOver);
  })

});



