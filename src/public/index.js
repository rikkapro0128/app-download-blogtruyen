
document.addEventListener('DOMContentLoaded', function() {

  const percent = document.getElementById('percent');
  
  let countPercent = 0;

  console.log(window);

  const idPercent = setInterval(() => {
    countPercent += 5;
    percent.style.width = countPercent + '%';
    if (countPercent == 100) clearInterval(idPercent);
  }, 500);

})