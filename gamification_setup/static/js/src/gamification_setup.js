/* Javascript for GamificationSetupXBlock. */

function register(){
        questions.forEach((item,i) => ([1,2,3,4,5,6,7].forEach((j,k) => ((document.getElementById("chk-" + j + "-" + i).checked) ? profile[questions_PT[i]] += Number(document.getElementById("chk-" + j + "-" + i).value) : console.log("none")))));
        total_sum = profile.reduce((a, b) => a + b, 0);
        profile.forEach((item,index) => (profile[index] /= total_sum));
        console.log(profile);
        create_user();
    }

function create_user(){
          //Creates an user into ::
          //  - AGModule
          //  - nanoMOOCS_API 

    var nmHeaders = new Headers();
    nmHeaders.append("Content-Type", "text/plain");

    var agHeaders = new Headers();
    agHeaders.append("Content-type", "application/json; charset=UTF-8");

    var nm_raw = JSON.stringify(
        {
            "id": uname,
            "gamer_profile": {
                "disruptor": profile[0],
                "free_spirit": profile[1],
                "achiever": profile[2],
                "player": profile[3],
                "socializer": profile[4],
                "philantropist": profile[5],
                "no_player": profile[6]
            },
            "interactions" : [],
            "next_mechanic_id" : 0 
        });

    var ag_raw = JSON.stringify(
        {
            user: {
                username: "" + uname + "",
                email: ""
            },
            social_profile: {
                image: "art",
                description: "Description...",
                data: {}
            },
            gamer_profile: {
                disruptor: profile[0],
                free_spirit: profile[1],
                achiever: profile[2],
                player: profile[3],
                socializer: profile[4],
                philantropist: profile[5],
                no_player: profile[6],
                data: JSON.stringify({
                    "level":0,
                    "score":0,
                    "$":0,
                    "badges":[],
                    "unlockables":[],
                    "challenges":[], 
                    "gifts" : [], 
                    "accessible_mechanics" : [], 
                    "progress" : 0,
                    "case" : "C2"  // Case selection
                    })
            },
            emotion_profile: {
                valence: 0,
                arousal: 0
            }
        });

    var nm_requestOptions = {
        method: 'POST',
        headers: nmHeaders,
        body: nm_raw,
        redirect: 'follow'
    };
    var ag_requestOptions = {
        method: 'POST',
        headers: agHeaders,
        body: ag_raw,
        redirect: 'follow'
    };

    nmURL = "https://eqsriwyz93.execute-api.eu-west-1.amazonaws.com/dev/player"; 
    agURL = "https://agmodule.herokuapp.com/api/gamers/";

    fetch(nmURL, nm_requestOptions)
    .then(response => response.json())
    .then(resJson => console.log(resJson))
    .then(dump => (
        fetch(agURL, ag_requestOptions)
        .then(response => response.json())
        .then(resJson => console.log(resJson)) 
        .then(dump => alert("Your gamified user have been created!" + dashboard_url)) 
        .then(dump2 => (window.location.replace(dashboard_url)))
        .catch(error => (console.log("Error: " + error))) 
        ))
    .catch(error => (console.log("Error: " + error)))             
}

function GamificationSetupXBlock(runtime, element) {

    function setup_gamification(result) { 
        //Result have fields ::
        //  - username
        //  - dashboard_url
        //$('.count', element).text(result.count);
        uname = result["username"]; // read from result
        protocol = window.location.protocol;
        console.log(protocol);
        hostname = window.location.hostname;
        console.log(hostname);
        course_id = result["course_id"];
        console.log(course_id);
        tab_id = result["tab_id"];
        console.log(tab_id);
        dashboard_url = protocol + "//" + hostname + "/courses/" + course_id + "/" + tab_id;
        console.log(dashboard_url);
        console.log("test");
        
        questions = ["Interactuar con los demás es importante para mí.", 
                     "Me hace feliz ser capaz de ayudar a los demás.",
                     "Seguir mi propio camino es importante para mí.",
                     "Me gusta formar parte de un equipo.",
                     "Me gusta provocar.",
                     "Me gustan las competiciones donde se pueda ganar un premio.",
                     "Sentir que formo parte de una comunidad es importante para mí.",
                     "A menudo me dejo guiar por la curiosidad.",
                     "Me gusta cuestionar el estado de las cosas.",
                     "Los premios son una buena manera de motivarme.",
                     "Me gusta probar nuevas cosas.",
                     "Me gusta superar obstáculos.",
                     "Me gusta guiar a los demás en las nuevas situaciones.",
                     "Me describo a mí mismo como un rebelde.",
                     "Disfruto con las actividades grupales.",
                     "Realizar siempre por completo mis tareas es importante para mí.",
                     "No me gusta seguir las reglas.",
                     "Me gusta compartir mi conocimiento con los demás.",
                     "Me resulta difícil abandonar un problema antes de que haya encontrado una solución.",
                     "El retorno de inversión es importante para mí.",
                     "Ser independiente es importante para mí.",
                     "Me gusta dominar tareas difíciles.",
                     "El bienestar de los demás es importante para mí.",
                     "Si el premio es adecuado, voy a hacer un esfuerzo.",
                    ];
        //Disruptor = 0, Free spirit = 1, Achiever = 2, Player = 3, Socializer = 4, Philantropist = 5, No Player = 6
        questions_PT = [4,5,1,4,0,3,4,1,0,3,1,2,5,0,4,2,0,5,2,3,1,2,5,3]
        profile = [0,0,0,0,0,0,0]

        questions.forEach((item,index) => (document.getElementById("poll").innerHTML += '<div></div><h2>Question ' + (index + 1) + '</h2><h3>'+ item + '</h3>' +
                                                                                        '<div><ul class="likert">'+
                                                                                          '<li> Disagree </li>'+
                                                                                          '<li><input id="chk-1-' + index + '" type="radio" name="chk-' + index + '" value="1" /></li>'+
                                                                                          '<li><input id="chk-2-' + index + '" type="radio" name="chk-' + index + '" value="2" /></li>'+
                                                                                          '<li><input id="chk-3-' + index + '" type="radio" name="chk-' + index + '" value="3" /></li>'+
                                                                                          '<li><input id="chk-4-' + index + '" type="radio" name="chk-' + index + '" value="4" /></li>'+
                                                                                          '<li><input id="chk-5-' + index + '" type="radio" name="chk-' + index + '" value="5" /></li>'+
                                                                                          '<li><input id="chk-6-' + index + '" type="radio" name="chk-' + index + '" value="6" /></li>'+
                                                                                          '<li><input id="chk-7-' + index + '" type="radio" name="chk-' + index + '" value="7" /></li>'+
                                                                                          '<li> Agree </li>'+
                                                                                        '</ul></div><br><br><br><br><br><br><br>'));
        document.getElementById("poll").innerHTML += '<br><br><br><br><div style="text-align:center;"><button style="width:20%;" onclick="register()">Start Gamification</button></div>';

    }

    var handlerUrl = runtime.handlerUrl(element, 'init_gamification');

    $(function ($) {
        /* Here's where you'd do things on page load. */
         $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({"hello": "world"}),
            success: setup_gamification
        });
    });
}
