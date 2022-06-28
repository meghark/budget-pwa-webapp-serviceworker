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
        //uploadTransaction();
    }
  };

  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };