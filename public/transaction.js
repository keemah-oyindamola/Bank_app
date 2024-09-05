let inputacc_no = document.getElementById("inputacc_no")
let useracc_no = document.getElementById("useracc_no")
let amountacc_no = document.getElementById("amountacc_no")
let amounttransf = document.getElementById("amounttransf")
let narration = document.getElementById("narration")
let usertransf = document.getElementById("usertransf")
let amountgateway = document.getElementById("amountgateway")
let amounttransfmodal = document.getElementById("amounttransfmodal")
let p1 = document.getElementById('pn1')
let p2 = document.getElementById('pn2')
let p3 = document.getElementById('pn3')
let p4 = document.getElementById('pn4')
let buy = document.getElementById("buy")
let modall = document.getElementById('mf-modal')

let tbody = document.getElementById('tbody')
// let currentAccountbalance
function pinn() {
    if (p1.value.length == 1) {
        p2.focus()
    }
    if (p2.value.length == 1) {
        p3.focus()
    }
    if (p3.value.length == 1) {
        p4.focus()
    }
    if (p4.value.length == 1) {
        buy.focus()
    }
}


function closeup() {
    modall.style.display = "none"
}


let finduser = null
// let founduser
function foundreceiver() {
    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if (doc.data().accountNumber == inputacc_no.value) {
                finduser = {
                    email: doc.id,
                    balance: doc.data().account_balance,
                    accountnumber: doc.data().accountNumber,
                    username: doc.data().username
                }
            }
        });
        if (finduser) {
            console.log(`user found with email : ${finduser.email}`);
            useracc_no.value = finduser.username
        } else {
            console.log('user not found');
        }
    });

}
foundreceiver()

// function transfer() {
//     // ... existing code to check user and get document ...

//     if (`${p1.value}${p2.value}${p3.value}${p4.value}` == doc.data().mypin) {
//       if (amountacc_no.value <= 0 || amountacc_no.value > accountBalance.innerHTML) {
//         alert("Invalid Transfer Amount");
//       } else {
//         currentAccountbalance = Number(doc.data().account_balance) - Number(amountacc_no.value);
//         docRef.update({
//           account_balance: currentAccountbalance
//         })
//           .then(() => {
//             // Update UI for sender's balance
//             accountBalance.innerHTML = '₦' + currentAccountbalance;
//             console.log("Document successfully updated!");

//             // Update recipient's balance
//             var recipientDocRef = db.collection("users").doc(finduser.email);
//             recipientDocRef.update({
//               account_balance: finduser.balance + Number(amountacc_no.value)
//             })
//               .then(() => {
//                 console.log("Recipient's account balance updated successfully!");
//                 // Show success message to the user
//                 alert(`Transfer of N${amountacc_no.value} to ${useracc_no.value} Successful`);
//               })
//               .catch((error) => {
//                 console.log("Error updating recipient's account balance:", error);
//                 // Show error message to the user
//                 alert("An error occurred while updating the recipient's balance. Please try again.");
//               });
//           })
//           .catch((error) => {
//             console.log("Error getting document:", error);
//           });
//       }
//     } else {
//       alert('wrong pin');
//     }

//     // ... remaining code ...
//   }

function transfer() {
    document.getElementById('loading').style.display = 'inline';
    document.getElementById('message').innerHTML = ''; // Clear previous messages
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

                        if (`${p1.value}${p2.value}${p3.value}${p4.value}` == doc.data().mypin) {
                            if (amountacc_no.value <= 0 || amountacc_no.value > Number(doc.data().account_balance)) {
                                alert("Invalid Transfer Amount");
                                document.getElementById('message').innerHTML = '<span style="color: red;">Invalid Transfer Amount</span>';

                            } else {
                                currentAccountbalance = Number(doc.data().account_balance) - Number(amountacc_no.value);
                                docRef.update({
                                    account_balance: currentAccountbalance
                                })
                                    .then(() => {
                                        // Update UI for sender's balance
                                        accountBalance.innerHTML = '₦' + currentAccountbalance;
                                        console.log("Document successfully updated!");

                                        // Update recipient's balance
                                        var recipientDocRef = db.collection("users").doc(finduser.email);
                                        recipientDocRef.update({
                                            account_balance: finduser.balance + Number(amountacc_no.value)
                                        })
                                            .then(() => {
                                                db.collection("users").doc(user.email)
                                                    .onSnapshot((doc) => {
                                                        accountBalance.innerHTML = '₦' + doc.data().account_balance
                                                    });
                                                console.log("Document successfully updated!");

                                                console.log("Recipient's account balance updated successfully!");
                                            })
                                            .then(() => {
                                                // Show success message to the user
                                                alert(`Transfer of N${amountacc_no.value} to ${useracc_no.value} Successful`);
                                                document.getElementById('message').innerHTML = `<span style="color: green;">Transfer of N${amountacc_no.value} to ${useracc_no.value} Successful</span>`;

                                                saveTransaction()
                                                inputacc_no.value = ""
                                                useracc_no.value = ""
                                                amountacc_no.value = ""
                                                narration.value = ""
                                                p1.value = ""
                                                p2.value = ""
                                                p3.value = ""
                                                p4.value = ""
                                                modall.style.display = "none"
                                            })
                                            .catch((error) => {
                                                console.log("Error updating recipient's account balance:", error);
                                                // Show error message to the user
                                                alert("An error occurred while updating the recipient's balance. Please try again.");
                                            });
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
            window.location.href = "signup.html"

            // User is signed out
            // ...
        }
    });
    // saveTransaction()
}


// function transfer() {
//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {
//             var uid = user.uid;
//             var docRef = db.collection("users").doc(user.email);

//             docRef
//                 .get()
//                 .then((doc) => {
//                     if (doc.exists) {
//                         console.log(doc.data().mypin);
//                         // const benbalance = finduser.balance;
//                         // console.log("Document data:", doc.data());
//                         // console.log('yes');
//                         if (`${p1.value}${p2.value}${p3.value}${p4.value}` == doc.data().mypin) {
//                             if (amountacc_no.value <= 0 || amountacc_no.value > accountBalance.innerHTML) {
//                                 alert("Invalid Transfer Amount");
//                             } else {
//                                 currentAccountbalance = Number(doc.data().account_balance) - Number(amountacc_no.value)
//                                 docRef.update({
//                                     account_balance: currentAccountbalance
//                                 })
//                                     .then(() => {
//                                         db.collection("users").doc(user.email)
//                                             .onSnapshot((doc) => {
//                                                 accountBalance.innerHTML = '₦' + doc.data().account_balance
//                                             });
//                                         console.log("Document successfully updated!");

//                                     })
//                                     .then(() => {
//                                         alert(
//                                             `Transfer of N${amountacc_no.value} to ${useracc_no.value} Successful`
//                                         );
// inputacc_no.value = ""
// useracc_no.value = ""
// amountacc_no.value = ""
// narration.value = ""
// p1.value = ""
// p2.value = ""
// p3.value = ""
// p4.value = ""


//                                         // Update recipient's account balance
//                                         var recipientDocRef = db.collection("users").doc(finduser.email);
//                                         recipientDocRef.update({
//                                             account_balance: finduser.balance + Number(amountacc_no.value)
//                                         })
// .then(() => {
//     db.collection("users").doc(user.email)
//         .onSnapshot((doc) => {
//             accountBalance.innerHTML = '₦' + doc.data().account_balance
//         });
//     console.log("Document successfully updated!");

//     console.log("Recipient's account balance updated successfully!");
// })
//                                             .catch((error) => {
//                                                 console.log("Error updating recipient's account balance:", error);
//                                             });
//                                     })


//                             }
//                         } else {
//                             alert('wrong pin');
//                         }

//                     } else {
//                         // doc.data() will be undefined in this case
//                         console.log("No such document!");
//                     }
//                 }).catch((error) => {
//                     console.log("Error getting document:", error);
//                 });

//         } else {
//             console.log("No user found");
//             window.location.href = "signup.html"

//             // User is signed out
//             // ...
//         }
//     });
//     saveTransaction()
// }

function transfer1() {
    // document.getElementById('loading').style.display = 'inline';

    if (finduser) {
        modall.style.display = "block"
        amounttransf.innerHTML = `₦` + amountacc_no.value + `.00`
        amounttransfmodal.innerHTML = `₦` + amountacc_no.value + `.00`
        usertransf.innerHTML = useracc_no.value
    } else {
        alert('invalid user')
    }
}



// function saveTransaction() {
//     // Add a new document in the "transactions" collection
//     db.collection("transactions").doc(amountacc_no.value).set({
//         date: new Date(),
//         receiverBalance: finduser.balance + Number(amountacc_no.value),
//         receiveracc_no: finduser.accountnumber,
//         receivername: finduser.username,
//         receiveremail: finduser.email,
//         amouuntTransferred: Number(amountacc_no.value), // Fixed typo in variable name
//     })
//     .then((docRef) => {
//         // console.log("Transaction document written with ID: ", docRef.id);
//         console.log("Document successfully written");
//          // Call getransaction() to update the transaction history
//     })
//     .catch((error) => {
//         console.error("Error writing transaction document: ", error);
//     });
// }


// function saveTransaction() {

//     // Add a new document in collection "cities"
//     db.collection("transactions").doc(finduser.email).set({
//         date: new Date(),
//         receiverBalance: finduser.balance + Number(amountacc_no.value),
//         receiveracc_no: finduser.accountnumber,
//         receivername: finduser.username,
//         receiveremail: finduser.email,
//         // senderName: sender.data().username,
//         // senderBalance:currentAccountbalance,
//         amouuntTransferred: amountacc_no.value,
//     })
//         .then(() => {
//             console.log("Document successfully written!");
//             var docRef = db.collection("transactions").doc(finduser.email);
//             docRef.get().then((doc) => {
//                 if (doc.exists) {
//                     tbody.innerHTML += `
//                     <tr>
//                         <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
//                         <td>${doc.data().receivername}</td>
//                         <td>${-doc.data().amouuntTransferred}</td>
//                     </tr>
//                 `;


//                 } else {
//                     // doc.data() will be undefined in this case
//                     console.log("No such document!");
//                     //   console.log("cant find");
//                 }
//             }).catch((error) => {
//                 console.log("Error getting document:", error);
//                 console.log(error);
//             });
//         })
//         .catch((error) => {
//             console.error("Error writing document: ", error);
//             console.log(error);
//         });
// }

// //         const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory'));

// // if (transactionHistory) {
// //   tbody.innerHTML = `
// //     <td><img style="width: 50px;" src="transfer.webp" alt=""></td>
// //     <td>${transactionHistory.receivername}</td>
// //     <td> ${- transactionHistory.amouuntTransferred}</td>
// //   `;
// // } else {
// //   // Fetch the transaction history from Firestore
// //   var docRef = db.collection("transactions").doc(finduser.email);

// //   docRef.get().then((doc) => {
// //     if (doc.exists) {
// //       console.log("Document data:", doc.data());
// //       localStorage.setItem('transactionHistory', JSON.stringify(doc.data()));
// //       tbody.innerHTML = `
// //         <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
// //         <td>${doc.data().receivername}</td>
// //         <td> ${- doc.data().amouuntTransferred}</td>
// //       `;
// //     } else {
// //       console.log("No such document!");
// //     }
// //   }).catch((error) => {
// //     console.log("Error getting document:", error);
// //   });

// // }
// // Fetch transaction data from Firestore
// // Wait for the DOM to fully load
// // document.addEventListener("DOMContentLoaded", function() {
// //     // Fetch transaction data from Firestore
// //     var docRef = db.collection("transactions").doc(finduser.email);

// //     docRef.get().then((doc) => {
// //         if (doc.exists) {
// //             console.log("Document data:", doc.data());
// //             // Append transaction data to the table
// //             appendTransactionData(doc.data());
// //             // Store transaction data in local storage
// //             localStorage.setItem("transactionData", JSON.stringify(doc.data()));
// //         } else {
// //             console.log("No such document!");
// //         }
// //     }).catch((error) => {
// //         console.log("Error getting document:", error);
// //     });

// //     // Function to append transaction data to the table
// //     function appendTransactionData(data) {
// //         tbody.innerHTML += `
// //             <tr>
// //                 <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
// //                 <td>${data.receivername}</td>
// //                 <td>${-data.amouuntTransferred}</td>
// //             </tr>
// //         `;
// //     }

// //     // Check if transaction data exists in local storage and append it to the table if it does
// //     var storedData = localStorage.getItem("transactionData");
// //     if (storedData) {
// //         appendTransactionData(JSON.parse(storedData));
// //     }
// // });

//         // var docRef = db.collection("transactions").doc(finduser.email);

//         // docRef.get().then((doc) => {
//         //     if (doc.exists) {
//         //         console.log("Document data:", doc.data());
//         //            tbody.innerHTML  += `
//         //            <tr>
//         //            <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
//         //            <td>${doc.data().receivername}</td>
//         //            <td> ${- doc.data().amouuntTransferred}</td>
//         //            </tr>
//         //            `
//         //         //    tbody.innerHTML = doc.data().receivername
//         //     } else {
//         //         // doc.data() will be undefined in this case
//         //         console.log("No such document!");
//         //     }
//         // }).catch((error) => {
//         //     console.log("Error getting document:", error);
//         // });
//     // tbody.innerHTML = `
//     // <td>${useracc_no.value}</td>
//     // <td>${amountacc_no.value}</td>`
// }
// function getTransactions() {
//     var docId = amountacc_no.value.trim(); // Trim whitespace from the input value
//     if (docId) {
//         var docRef = db.collection("transactions").doc(docId);
//         docRef.get().then((doc) => {
//             if (doc.exists) {
//                 console.log('Document found:', docId);
//                 tbody.innerHTML += `
//                     <tr>
//                         <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
//                         <td>${doc.data().receivername}</td>
//                         <td>${-doc.data().amountTransferred}</td>
//                     </tr>
//                 `;
//             } else {
//                 console.log("Document not found:", docId);
//                 // Handle case when document doesn't exist
//             }
//         }).catch((error) => {
//             console.error("Error getting document:", error);
//         });
//     } else {
//         console.log("Document ID is empty.");
//         // Handle case when document ID is empty
//     }
// }

// getTransactions();

// function getransaction() {
//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {
//             var uid = user.uid;
//             var docRef = db.collection("transactions").doc(user.email);

//             docRef.get().then((doc) => {
//                 if (doc.exists) {
//                     tbody.innerHTML += `
//                         <tr>
//                             <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
//                             <td>${doc.data().receivername}</td>
//                             <td>${-doc.data().amouuntTransferred}</td>
//                         </tr>
//                     `;
//                 } else {
//                     console.log("No such document!");
//                 }
//             }).catch((error) => {
//                 console.log("Error getting document:", error);
//             });
//         } else {
//             console.log("No user found");
//         }
//     });
// }

// Call getransaction() inside onAuthStateChanged to ensure user authentication
// getransaction();

// function getransaction() {
//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {
//             var uid = user.uid;
//             var docRef = db.collection("transactions").doc(user.email);

//             docRef.get().then((doc) => {
//                 if (doc.exists) {
//                     // Clear existing table data
//                     tbody.innerHTML = "";

//                     // Loop through each transaction in the document
//                     doc.data().forEach((transaction) => {
//                         // Append transaction data to the table
//                         tbody.innerHTML += `
//                             <tr>
//                                 <td><img style="width: 50px;" src="transfer.webp" alt=""></td>
//                                 <td>${transaction.receivername}</td>
//                                 <td>${-transaction.amouuntTransferred}</td>
//                             </tr>
//                         `;
//                     });
//                 } else {
//                     console.log("No transaction history found for the user.");
//                 }
//             }).catch((error) => {
//                 console.log("Error getting transaction history:", error);
//             });
//         } else {
//             console.log("No user found");
//         }
//     });
// }
function saveTransaction() {
    const amount = Number(amountacc_no.value);
    if (!amount) {
        console.error("Amount must be a valid number.");
        return;
    }

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
                    const transactionData = {
                        date: new Date(),
                        receiverBalance: finduser.balance + amount,
                        receiveracc_no: finduser.accountnumber,
                        receivername: finduser.username,
                        receiveremail: finduser.email,
                        senderemail: getemail,
                        senderusername: userName.innerHTML,
                        amountTransferred: amount,
                    };

                    // Save the transaction document with the transactionData
                    db.collection("transactions").doc().set(transactionData)
                        .then(() => {
                            console.log("Transaction document successfully written");
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

// function getTransactions() {
//     const transactionsRef = db.collection("transactions");

//     // Clear existing table content
//     tbody.innerHTML = '';

//     // Fetch all transactions
//     transactionsRef.get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             // Check if the sender's username matches the current user's username
//             if (userName.innerHTML == doc.data().senderusername) {
//                 // Append the transaction to the table
//                 tbody.innerHTML += `
//                     <tr>
//                         <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
//                         <td>${doc.data().receivername}</td>
//                         <td>${-doc.data().amountTransferred}</td>
//                     </tr>
//                 `;
//             }
//         });

//         // If no transactions were added, display a message
//         if (tbody.innerHTML === '') {
//             tbody.innerHTML = `<tr><td colspan="3">No transactions found.</td></tr>`;
//         }
//     }).catch((error) => {
//         console.error("Error getting transactions:", error);
//     });
// }

// // Call the function to fetch transactions when the page loads
// getTransactions();


// function getTransactions() {
//     const docId = amountacc_no.value.trim(); // Trim whitespace from the input value
//     if (!docId) {
//         console.log("Document ID is empty.");
//         return;
//     }
//     const docRef = db.collection("transactions").doc(docId);
//     docRef.get().then((doc) => {
//         if (doc.exists) {
//             console.log('Document found:', docId);
//             tbody.innerHTML += `
//                 <tr>
//                     <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
//                     <td>${doc.data().receivername}</td>
//                     <td>${-doc.data().amountTransferred}</td>
//                 </tr>
//             `;
//         } else {
//             console.log("Document not found:", docId);
//             // Handle case when document doesn't exist
//         }
//     }).catch((error) => {
//         console.error("Error getting document:", error);
//     });
// }

// // Automatically fetch transactions when the page loads
// getTransactions();

// function getTransactions() {
//     const transactionsRef = db.collection("transactions");

//     // Clear existing table content
//     tbody.innerHTML = '';

//     // Fetch all transactions

//         transactionsRef.get().then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 // Append each transaction to the table
//                 if (userName.innerHTML == doc.data().senderusername) {
//                 tbody.innerHTML += `
//                     <tr>
//                         <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
//                         <td>${doc.data().receivername}</td>
//                         <td>${-doc.data().amountTransferred}</td>
//                     </tr>
//                 `;
//             } else {
//                 tbody.innerHTML = ""
//             }
//             });
//         }).catch((error) => {
//             console.error("Error getting transactions:", error);
//         });


// }

// // Call the function to fetch transactions when the page loads
// getTransactions();

function makePayment() {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("users").doc(user.email);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    let newAmount = Number(doc.data().account_balance) + Number(amountgateway.value)

                    FlutterwaveCheckout({
                        public_key: "FLWPUBK_TEST-0ed2f690e66bea65f9c36701a33ae2ff-X",
                        tx_ref: "Keemah-48981487343MDI0NzMx",
                        amount: amountgateway.value,
                        currency: "NGN",
                        payment_options: "card, mobilemoneyghana, ussd",
                        redirect_url: "./dashbd.html",
                        meta: {
                            consumer_id: 23,
                            consumer_mac: "92a3-912ba-1192a",
                        },
                        customer: {
                            email: doc.data().email,
                            phone_number: "08102909304",
                            name: doc.data().username,
                        },
                        customizations: {
                            title: "The Keemah Bank",
                            description: "Payment for an awesome cruise",
                            logo: "https://www.logolynx.com/images/logolynx/22/2239ca38f5505fbfce7e55bbc0604386.jpeg",
                        }
                    });
                    var washingtonRef = db.collection("users").doc(user.email);

                    // Set the "capital" field of the city 'DC'
                    return washingtonRef.update({
                        account_balance: newAmount
                    })
                        .then(() => {
                            accountBalance.innerHTML = '₦' + newAmount;
                            console.log("Document successfully updated!");
                        })
                        .catch((error) => {
                            // The document probably doesn't exist.
                            console.error("Error updating document: ", error);
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
