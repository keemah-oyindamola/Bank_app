let accountBalance = document.getElementById('account_balance')
let acc_number = document.getElementById("acc_number")
let eye = document.getElementById('eye')
let airtimePage = document.getElementById("airtimePage")
let Transactionspage = document.getElementById("Transactionspage")
let mainpage = document.getElementById("mainPage")
let userName = document.getElementById("userName")



function airtime_Page() {
  airtimePage.style.display = 'block'
  Transactionspage.style.display = 'none'
  mainpage.style.display = 'none'
}
function transaction_page(){
  airtimePage.style.display = 'none'
  mainpage.style.display = 'none'
  Transactionspage.style.display = 'block'
}
function home_page() {
  airtimePage.style.display = 'none'
  Transactionspage.style.display = 'none'
  mainpage.style.display = 'block'
}


const firebaseConfig = {
  apiKey: "AIzaSyD3NepjPiw4J6oK6PuShK1Smbxdy0LsOcM",
  authDomain: "level2-project-8e0a8.firebaseapp.com",
  projectId: "level2-project-8e0a8",
  storageBucket: "level2-project-8e0a8.appspot.com",
  messagingSenderId: "627012890577",
  appId: "1:627012890577:web:04178a719788ae64f77af0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var storageRef = firebase.storage().ref();

// function isloggedin() {

//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       var uid = user.uid;
//       var docRef = db.collection("users").doc(user.email);

//       docRef.get().then((doc) => {
//         if (doc.exists) {
//           // console.log("Document data:", doc.data());
//           // console.log('yes');
//           userName.innerHTML = doc.data().username
//           acc_number.innerHTML = doc.data().accountNumber
//           accountBalance.innerHTML ='₦' + doc.data().account_balance
//           let getemail = doc.data().email
          
//         } else {
//           // doc.data() will be undefined in this case
//           console.log("No such document!");
//         }
//       }).catch((error) => {
//         console.log("Error getting document:", error);
//       });
      
//       // ...
//     } else {
//       console.log("No user found");
//       window.location.href="signup.html"
      
//       // User is signed out
//       // ...
//     }
//   });
// }
// isloggedin()

function isloggedin() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            var docRef = db.collection("users").doc(user.email);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    userName.innerHTML = doc.data().username;
                    acc_number.innerHTML = doc.data().accountNumber;
                    accountBalance.innerHTML = '₦' + doc.data().account_balance;
                    let currentUserEmail = doc.data().email;

                    // Fetch and display transaction history for the current user
                    getTransactions(currentUserEmail);
                    gettransaction(currentUserEmail)
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        } else {
            console.log("No user found");
            window.location.href = "signup.html";
        }
    });
}

function getTransactions(currentUserEmail) {
    const transactionsRef = db.collection("transactions");

    // Clear existing table content
    tbody.innerHTML = '';
    // transactionsRef.where("senderemail", "==", currentUserEmail)
    //                .get()
    //                .then((querySnapshot) => {
    //                    querySnapshot.forEach((doc) => {
    //                        const senderName = doc.data().senderusername;
    //                        const receiverName = doc.data().receivername;
    //                        const amount = doc.data().amountTransferred;
    //                        const transactionDate = doc.data().date.toDate().toLocaleDateString(); // Convert date to string
    //                        const isSender = doc.data().senderemail === currentUserEmail;

    //                        // Determine counterparty's name and transaction type (sent or received)
    //                        const counterPartyName = isSender ? receiverName : senderName;
    //                        const transactionType = isSender ? "Sent" : "Received";

    //                        // Append transaction to the table
    //                        tbody.innerHTML += `
    //                            <tr>
    //                                <td>${transactionDate}</td>
    //                                <td>${transactionType}</td>
    //                                <td>${counterPartyName}</td>
    //                                <td>${amount}</td>
    //                            </tr>
    //                        `;
    //                    });

    //                    // If no transactions were added, display a message
    //                    if (tbody.innerHTML === '') {
    //                        tbody.innerHTML = `<tr><td colspan="4">No transactions found.</td></tr>`;
    //                    }
    //                })
    //                .catch((error) => {
    //                    console.error("Error getting transactions:", error);
    //                });

    // Fetch transactions where the current user is the sender
    transactionsRef.where("senderemail", "==", currentUserEmail).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Append each transaction to the table
            tbody.innerHTML += `
                <tr>
                    <td><img style="width: 50px;" src="transfer.webp" alt=""><img src="" alt=""></td>
                    <td>${doc.data().senderusername}</td>
                    <td>to</td>
                    <td>${doc.data().receivername}</td>
                    <td>${-doc.data().amountTransferred}</td>
                    <td>${ doc.data().date.toDate().toLocaleDateString()}</td>
                </tr>
            `;
        });

        // If no transactions were added, display a message
        if (tbody.innerHTML === '') {
            tbody.innerHTML = `<tr><td colspan="3">No transactions found.</td></tr>`;
        }
    }).catch((error) => {
        console.error("Error getting transactions:", error);
    });
}
function gettransaction(currentUserEmail) {
  const airtimetransactionsRef = db.collection("airtimetransactions");

    // Clear existing table content
    tbody.innerHTML = '';

    // Fetch transactions where the current user is the sender
    airtimetransactionsRef.where("airtimesenderemail", "==", currentUserEmail).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Append each transaction to the table
            tbody.innerHTML += `
              <tr>
                  <td><img style="width: 50px;" src="airtime.jpg" alt=""></td>
                  <td>Airtime</td>
                  <td>${-doc.data().airtimeamount}</td>
                  <td>${ doc.data().date.toDate().toLocaleDateString()}</td>
              </tr>
          `;
        });

        // If no transactions were added, display a message
        if (tbody.innerHTML === '') {
            tbody.innerHTML = `<tr><td colspan="3">No transactions found.</td></tr>`;
        }
    }).catch((error) => {
        console.error("Error getting transactions:", error);
    });
  // // Clear the tbody before appending new data
  // tbody.innerHTML = '';

//   // // Get all documents from the "airtimetransactions" collection
//   // db.collection("airtimetransactions").get().then((querySnapshot) => {
//   //     // Iterate through each document
//   //     querySnapshot.forEach((doc) => {
//   //         // Display data from each document in the table
//   //         tbody.innerHTML += `
//   //             <tr>
//   //                 <td><img style="width: 50px;" src="airtime.jpg" alt=""></td>
//   //                 <td>Airtime</td>
//   //                 <td>${-doc.data().airtimeamount}</td>
//   //             </tr>
//   //         `;
//   //     });
// //   }).catch((error) => {
// //       console.error("Error getting documents: ", error);
// //   });
}

// Call the isloggedin() function when the page loads
isloggedin();




