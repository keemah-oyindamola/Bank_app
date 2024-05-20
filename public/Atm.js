let atm_modal = document.getElementById('atm_modal') 
let pin1 = document.getElementById('p1')
let pin2 = document.getElementById('p2')
let pin3 = document.getElementById('p3')
let pin4 = document.getElementById('p4')
let buyAtm = document.getElementById("buyatm")


function right() {
    atm.style.left = "-300%";
    atm1.style.left = "0";
  }
  
function left() {
    atm.style.left = "0";
    atm1.style.left="-300%";
}

function showatm_modal(){
    console.log("yes see");
    atm_modal.style.display = "block"
}
function closeupd() {
    atm_modal.style.display = "none"
    atm_modal.style.cursor = "pointer"
}

function pinns() {
    if (pin1.value.length == 1) {
        pin2.focus()
    }
    if (pin2.value.length == 1) {
        pin3.focus()
    }
    if (pin3.value.length == 1) {
        pin4.focus()
    }
    if (pin4.value.length == 1) {
        buyAtm.focus()
    }
}
let atmamount = 2000

function buyingatm(){
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("users").doc(user.email);

            docRef
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        console.log(doc.data().mypin);
                        // const benbalance = finduser.balance;
                        // console.log("Document data:", doc.data());
                        // console.log('yes');

                        if (`${pin1.value}${pin2.value}${pin3.value}${pin4.value}` == doc.data().mypin) {
                            if (atmamount <= 0 || atmamount > accountBalance.innerHTML) {
                                alert("Invalid Transfer Amount");
                            } else {
                                currentAccountdbalance = Number(doc.data().account_balance) - Number(atmamount);
                                docRef.update({
                                    account_balance: currentAccountdbalance
                                })
                                    .then(() => {
                                        alert('atm purchased successfully')
                                        // Update UI for sender's balance
                                        accountBalance.innerHTML = '₦' + currentAccountdbalance;
                                        console.log("Document successfully updated!");

                                    })
                                    .catch((error) => {
                                        console.log("Error getting document:", error);
                                    });
                            }
                        } else {
                            alert('wrong pin');
                        }
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });

        } else {
            console.log("No user found");
            // window.location.href = "signup.html"

            // User is signed out
            // ...
        }
    });
}