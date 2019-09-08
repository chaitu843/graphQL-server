let firebase = require('firebase'),
    firebaseConfig = {
        apiKey: "AIzaSyBwmmPvbrwAYqAvyq0kDw5f4GXxYa_ed-8",
        authDomain: "graphql-server-b843a.firebaseapp.com",
        databaseURL: "https://graphql-server-b843a.firebaseio.com",
        projectId: "graphql-server-b843a",
        storageBucket: "graphql-server-b843a.appspot.com",
        messagingSenderId: "898617734168",
        appId: "1:898617734168:web:cc1c139ae8dc895ed93f6d"
    };

firebase.initializeApp(firebaseConfig);

module.exports = firebase;