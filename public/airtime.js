let modal = document.getElementById('ms-modal')
let selectairtime = document.getElementById("selectairtime")
let phonenumber = document.getElementById('phonenumber')
let ar = Math.floor(Math.random() * 10)

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
    document.getElementById('loading').style.display = 'inline';
    document.getElementById('message').innerHTML = ''; // Clear previous messages

    const user = firebase.auth().currentUser;

    if (!user) {
        document.getElementById('message').innerHTML = '<span style="color: red;">User not authenticated.</span>';
        document.getElementById('loading').style.display = 'none';
        return;
    }

    const airtimeAmount = Number(selectairtime.value);
    const phone = phonenumber.value.trim();

    // Input Validation
    if (!phone || airtimeAmount === 0) {
        document.getElementById('message').innerHTML = '<span style="color: red;">Phone number or airtime amount cannot be empty</span>';
        // alert('Phone number or airtime amount cannot be empty');
        document.getElementById('loading').style.display = 'none';
        return;
    }

    var docRef = db.collection("users").doc(user.email);

    docRef.get().then((doc) => {
        if (doc.exists) {
            const currentAccountBalance = Number(doc.data().account_balance);
            
            if (currentAccountBalance < airtimeAmount) {
                document.getElementById('message').innerHTML = '<span style="color: red;">Insufficient balance.</span>';
                return;
            }

            const newAccountBalance = currentAccountBalance - airtimeAmount;

            docRef.update({
                account_balance: newAccountBalance
            })
            .then(() => {
                accountBalance.innerHTML = '₦' + newAccountBalance;
                document.getElementById('message').innerHTML = '<span style="color: green;">Airtime purchase successful!</span>';
                
                // Clear inputs
                selectairtime.value = "";
                phonenumber.value = "";

                // Save transaction
                return savingTransaction(airtimeAmount, user.email, userName.innerHTML);
            })
            .catch((error) => {
                document.getElementById('message').innerHTML = `<span style="color: red;">Error updating balance: ${error.message}</span>`;
            });
        } else {
            document.getElementById('message').innerHTML = '<span style="color: red;">User document not found.</span>';
        }
    })
    .catch((error) => {
        document.getElementById('message').innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    })
    .finally(() => {
        document.getElementById('loading').style.display = 'none';
    });
}
function savingTransaction(airtimeAmount, email, username) {
    const airtimetransactionData = {
        date: new Date(),
        airtimeamount: airtimeAmount,
        airtimesenderemail: email,
        airtimesenderusername: username,
    };

    return db.collection("airtimetransactions").doc().set(airtimetransactionData)
        .then(() => {
            console.log("Airtime transaction document successfully written");
        })
        .catch((error) => {
            console.error("Error writing transaction document: ", error);
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
