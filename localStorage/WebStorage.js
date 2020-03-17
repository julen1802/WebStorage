var miStorage = window.localStorage;
const libros = ["ISBN:9781491906187","ISBN:9781491920497","ISBN:1491910399","ISBN:1491946008","ISBN:1491978236"];
var db;
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBv0Ao0R3qNIEcZZynzRx8KOB2A2obww60",
    authDomain: "dawe2020-89228.firebaseapp.com",
    databaseURL: "https://dawe2020-89228.firebaseio.com",
    projectId: "dawe2020-89228",
    storageBucket: "dawe2020-89228.appspot.com",
    messagingSenderId: "17095149013",
    appId: "1:17095149013:web:c1e87af848b81e00e5a95c"
};
// Initialize Firebase

window.onload = init;

function guardarLocal(value){
    var url = "https://openlibrary.org/api/books?bibkeys=" + value + "&jscmd=details&format=json";
    fetch(url).then(r => r.json()).then(function(r){
        let data = r[value].details;
        console.log(value);
        console.log(data);
        miStorage.setItem(value, JSON.stringify(data));
        let libro = JSON.parse(miStorage.getItem(value));
        console.log(libro.title);
        generateDetails(value, libro);
    });
}
function generateDetails(value, data){
    var htmlDetail = "<details id='" + value + "'><summary>" + value + "</summary>"+JSON.stringify(data) + "</details>";
    document.getElementById("desplegables").insertAdjacentHTML('beforeend', htmlDetail);
}
function copytoFirebase(){
    var keys = Object.keys(miStorage);
    var i = keys.length;
    while(i--){
        db.collection("books").doc(keys[i]).set({
            isbn: keys[i],
            details: JSON.parse(miStorage.getItem(keys[i]))
        }).then(function(){
            console.log("libros agregados " + keys[i]);
        }).catch(function(error){
            console.error("error al agregar libros ",error);
        });
    }
    alert("copiado a Firebase");
}

function removeLocalStorage(){
    miStorage.clear();
    alert("borrado el contenido de local storage");
    document.getElementById("desplegables").innerHTML = " ";
}

function copyfromFirebase(){
    db.collection("books").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
            miStorage.setItem(doc.data().isbn, JSON.stringify(doc.data().details));
            generateDetails(doc.data().isbn, JSON.stringify(doc.data().details) );
        });
    });
}

function init(){;
    libros.forEach(guardarLocal);
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    document.getElementById("copytoFirebase").onclick = copytoFirebase;
    document.getElementById("removeLocalStorage").onclick = removeLocalStorage;
    document.getElementById("copyfromFirebase").onclick = copyfromFirebase;
}
