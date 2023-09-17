const debounce = (fn) => {
  let start;
  return function (){
      clearTimeout(start)
      start = setTimeout(() => {
           fn.apply(this, arguments)                   
          }, 1000)
  }
};

const input = document.querySelector('.input');
const section = document.querySelector('.section');
const result = document.querySelector('.result');

input.addEventListener('keyup', debounce(async function(e){
  const value = e.target.value.trim();
  if(value.length !== 0){
    const repositories = await searchRepo(value);
    createAutoCompletions (repositories.items) 
  }
}));

result.addEventListener('click', closeSelected);

async function searchRepo(inputValue) {
  try{
    const searchRepo = await fetch(
    `https://api.github.com/search/repositories?q=${inputValue}&per_page=5`
    );
    const searchRepoJson = await searchRepo.json();
    return searchRepoJson;
  } catch (err){
    console.log(err)
  }
};

function createAutoCompletions (repoResult) {
  if (repoResult.length === 0) {
    input.value = "";
    alert('Таких репозиториев не найдено')
  } else {
      repoResult.forEach(element => {
        let div = document.createElement('div');
        div.className = 'selection';
        div.innerText = element.name;
        section.append(div);
      });
      section.addEventListener('click', function(e) {
        userSelection (e, repoResult)}, { once: true });
    }
};

function userSelection (e, repoResult){ 
  repoResult.forEach(item =>{
    if (item.name == e.target.innerText){
      let div = document.createElement('div');
      let btnClose = document.createElement('button');
      div.className = 'result-selection';
      div.innerText = 'Name: ' + item.name + '\n' + 'Owner: ' + item.owner.login + '\n'+ 'Stars: ' + item.stargazers_count;
      btnClose.className = 'button-close';
      div.append(btnClose);
      result.append(div);
    }
  })
  clearInput();
};

function clearInput(){ 
  input.value = '';
  while(section.firstChild){  
    section.removeChild(section.firstChild)
  }
};

function closeSelected (e){
  if (e.srcElement.className == 'button-close'){
    e.target.parentElement.remove();
  }
}
