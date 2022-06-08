
document.addEventListener('DOMContentLoaded', function() {

  const percent = document.getElementById('percent');
  
  let countPercent = 0;

  console.log(window);
  
  window.electronAPI.handlePercent((event, value) => {
    console.log(event);
    const oldValue = countPercent;
    const newValue = oldValue + value
    percent.style.width = newValue + '%';
  })

})