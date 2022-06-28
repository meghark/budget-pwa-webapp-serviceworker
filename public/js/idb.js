//A new variable to hold the db connection
let db;

//open a connection  to new budget db, add version as 1
const request = indexedDB.open('budget-tracker', 1);

//Indexed db stores data in object store
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // point a reference to db 
    const db = event.target.result;
    
    //Add object store for withdrawals.
    db.createObjectStore('transaction', { autoIncrement: true });
  };

  // upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, send all budget and withdrawl information
    if (navigator.onLine) {
        uploadTransaction();
    }
  };

  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

  // When there is a connection failure and a new transaction is created following code will be executed.
function saveRecord(record) {
    // Open a connection to indexed db.
    const transaction = db.transaction(['transaction'], 'readwrite');
  
    // access the object store within the db
    const budgetObjectStore = transaction.objectStore('transaction');
  
    // add record to your store with add method
    budgetObjectStore.add(record);
  }

  function uploadTransaction()
  {
      // connection to db
        const transaction = db.transaction(['transaction'], 'readwrite');

        // access your object store
        const transactionObjectStore = transaction.objectStore('transaction');

        // read all data in the store
        const getAll = transactionObjectStore.getAll();

        // getAll() is an async function, once successful execute the following
         getAll.onsuccess = function() {
        // If db is not empty send data to api. result holds all saved data.
        if (getAll.result.length > 0) {
                fetch('/api/transaction', {
                    method: 'POST',
                    body: JSON.stringify(getAll.result),
                    headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                
                //Once saved to server remove all currently saved records.
                const transaction = db.transaction(['transaction'], 'readwrite');
                const transactionObjectStore = transaction.objectStore('transaction');
                transactionObjectStore.clear();
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
  }


//event listener when network connection    is back on
  window.addEventListener('online', uploadTransaction);