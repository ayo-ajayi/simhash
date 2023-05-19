async function fetchData() {
   const options = {
    method: 'GET',
   } 

    const res = await fetch('https://api.quotable.io/random') 
    const rec = await res.json()
   console.log('rec', rec)
   document.getElementById("author").innerHTML = rec.author
}
fetchData();


  