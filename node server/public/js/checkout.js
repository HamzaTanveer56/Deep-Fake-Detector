document.querySelector('.btnOneDollar').addEventListener("click",()=>{pay(1,100,"One Dollar Donation")});
document.querySelector('.btnFiveDollar').addEventListener("click",()=>{pay(2,500,"Five Dollar Donation")});
document.querySelector('.btnTenDollar').addEventListener("click",()=>{pay(3,1000,"Ten Dollar Donation")});
document.querySelector('.btnHundredDollar').addEventListener("click",()=>{pay(4,10000,"Hundred Dollar Donation")});


function pay(id,amount,name){
    fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            { id: id, quantity: 1, amount:amount, name:name }
          ],
        }),
      })
        .then((res) => {
          if (res.ok) 
            return res.json()

          return res.json().then((json) => 
            Promise.reject(json)
          )
        })
        .then(({ url }) => {
          window.location = url
        })
        .catch(e => {
          console.error(e.error)
        })
}
