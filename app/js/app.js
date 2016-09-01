
/*
    Global functions
    Called from everywhere * . *
*/

// How to split big numbers (1000)
var seperationString = ' ';

// Our beautiful vanilla JS ajax call function <3
function ajaxcall(url, done) {
    var r = new XMLHttpRequest();

    r.onload = function () {
        if (r.readyState != 4) {
            return;
        }

        if(r.status == 401) {
            window.location.replace('/');
        }

        var jsendResponse = JSON.parse(r.responseText);

        if (jsendResponse.status) {
            if(jsendResponse.status != 'success') {
                return done('Er is een fout opgetreden: ' + jsendResponse.message);
            }
            return done(null, jsendResponse.data);
        }

        if(r.status != 200) {
            return done('Er is een fout opgetreden (Code ' + r.status + ')');
        }

        return done(null, jsendResponse);
    };
    r.onerror = function() {
        return done('Er is een fout opgetreden (Server niet bereikbaar, Code ' + r.status + ')');
    };

    r.open("GET", url, true);
    // Needs to be allowed on server
    //r.setRequestHeader('max-age', '3600');
    r.send();
    return r; // Return it so we can cancel it * . *
}

function toggle(item) {
    var i = document.getElementById(item);
    if(i.style.display == 'block') i.style.display = 'none';
    else i.style.display = 'block';   
}

function showmenu() {
    document.getElementById("user-container-id").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var d = document.getElementById("user-container-id");
        d.classList.remove('show');
    }
};

