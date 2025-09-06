const xhr = new XMLHttpRequest();
xhr.addEventListener('load', () => {
  console.log(xhr.response);
});
xhr.open('GET', 'amazon.html');
xhr.send();