let modal = document.getElementById('ms-modal')
let selectairtime = document.getElementById("selectairtime")
let phonenumber = document.getElementById('phonenumber')
let ar = Math.floor(Math.random()*10)

function purchase_airtime() {
    modal.style.display = "block"
}
function closeupt() {
    modal.style.display = "none"
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function buyairtime() {
    const user = firebase.auth().currentUser
    var docRef = db.collection("users").doc(user.email);

    docRef.get().then((doc) => {
        if (doc.exists) {
            if (phonenumber.value == '' || selectairtime.value == '') {
                alert('cant be empty')
            } else {
                currentAccountbalance = Number(doc.data().account_balance) - Number(selectairtime.value)
                console.log(currentAccountbalance);
                alert(`Recharge of ${selectairtime.value} Airtime successful`)
                selectairtime.value = ""
                phonenumber.value = ""
                //    accountBalance.innerHTML = currentAccountbalance
                var userRef = db.collection("users").doc(user.email);
                // Set the "capital" field of the city 'DC'
                return userRef.update({
                    account_balance: currentAccountbalance
                })
                    .then(() => {
                        db.collection("users").doc(user.email)
                            .onSnapshot((doc) => {
                                accountBalance.innerHTML = '₦' + doc.data().account_balance
                            });
                        console.log("Document successfully updated!");
    

                    })
                    .catch((error) => {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });
            }
            // console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
   savingTransaction()
    // console.log(selectairtime.value);
    // console.log(accountBalance);
    // currentAccountbalance = Number(accountBalance) - Number(selectairtime.value)
    // console.log(currentAccountbalance);

}
function savingTransaction() {
    let select = Number(selectairtime.value)
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("users").doc(user.email);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    userName.innerHTML = doc.data().username;
                    acc_number.innerHTML = doc.data().accountNumber;
                    accountBalance.innerHTML = '₦' + doc.data().account_balance;
                    let getemail = doc.data().email;

                    // Now, inside this block, you have access to getemail
                    const airtimetransactionData = {
                        date: new Date(),
                        airtimeamount: select,
                        airtimesenderemail:getemail,
                        airtimesenderusername: userName.innerHTML,
                        
                    };

                    // Save the transaction document with the transactionData
                    db.collection("airtimetransactions").doc().set(airtimetransactionData)
                        .then(() => {
                            console.log("airtimeTransaction document successfully written");
                            // Optionally, call getTransactions() to update the transaction history
                            // getTransactions();
                        })
                        .catch((error) => {
                            console.error("Error writing transaction document: ", error);
                        });
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        } else {
            console.log("No user found");
            
        }
    });
}
    
    // // Add a new document in collection "cities"
    // db.collection("airtimetransactions").doc(userName.innerHTML).set({
    //     date: new Date(),
    //     airtimeamount: selectairtime.value,
    //     // senderName: sender.data().username,
    //     // senderBalance:currentAccountbalance,
    // })
    //     .then(() => {
    //         console.log("Document successfully written!");
    //     })
    //     .catch((error) => {
    //         console.error("Error writing document: ", error);
    //         console.log(error);
    //     });



// function gettransaction(){
//     var docRef = db.collection("airtimetransactions").doc(selectairtime.value);
//     docRef.get().then((doc) => {
//         if (doc.exists) {
//             tbody.innerHTML += `
//             <tr>
//                 <td><img style="width: 50px;" src="airtime.jpg" alt=""><img src="" alt=""></td>
//                 <td>${-doc.data().airtimeamount}</td>
//             </tr>
//         `;


//         } else {
//             // doc.data() will be undefined in this case
//             console.log("No such document!");
//             //   console.log("cant find");
//         }
//     }).catch((error) => {
//         console.log("Error getting document:", error);
//         console.log(error);
//     });
// }
// gettransaction()

// function gettransaction() {
//     // Clear the tbody before appending new data
//     tbody.innerHTML = '';

//     // Get all documents from the "airtimetransactions" collection
//     db.collection("airtimetransactions").get().then((querySnapshot) => {
//         // Iterate through each document
//         querySnapshot.forEach((doc) => {
//             // Display data from each document in the table
//             tbody.innerHTML += `
//                 <tr>
//                     <td><img style="width: 50px;" src="airtime.jpg" alt=""></td>
//                     <td>Airtime</td>
//                     <td>${-doc.data().airtimeamount}</td>
//                 </tr>
//             `;
//         });
//     }).catch((error) => {
//         console.error("Error getting documents: ", error);
//     });
// }

// Call the function to load transaction history when the page loads or when needed
// gettransaction();
