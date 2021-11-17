/* Javascript for GamificationSetupXBlock. */

  //Custom alerts
    var swal = "";
    try{
        require(['https://cdn.jsdelivr.net/npm/sweetalert2@11.1.9/dist/sweetalert2.js'], 
            function (Swal) {
                swal = Swal;
            }
        );
    }catch (cmserr){
        swal = import("https://cdn.jsdelivr.net/npm/sweetalert2@11.1.9/dist/sweetalert2.js");
    }

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

    var PTs = ["Disruptor", "Free Spirit", "Achiever", "Player", "Socializer", "Philantropist"]
    var PTTexts = [
      "A aquest tipus de jugadors els hi agrada anar en contra de les normes i el sistema.",
      "A aquest tipus de jugadors els hi agrada sentir-se lliures i explorar tot el que poden.",
      "A aquest tipus de jugadors els hi agrada col·leccionar i desbloquejar objectes.",
      "A aquest tipus de jugadors els hi agraden les competicions i els premis.",
      "A aquest tipus de jugadors els hi agrada establir relacions personals.",
      "A aquest tipus de jugadors els hi agrada ajudar als demés incondicionalment.",
      "Això indica que no desitges fer l'experiència gamificada...",
    ]
    var pred_pt_mx = 0;
    var pred_pt = 7;
    for (i = 0; i < 7; i++){
      if(profile[i] > pred_pt_mx){
        pred_pt = i;
      }
    }

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
                    "case" : gtype, // Case selection
                    "edx_data" : {}
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

    // fetch(nmURL, nm_requestOptions)
    // .then(response => response.json())
    // .then(resJson => console.log(resJson))
    // .then(dump => (
        fetch(agURL, ag_requestOptions)
        .then(response => response.json())
        .then(resJson => console.log(resJson)) 
        .then(dump => swal.fire({
                        title: PTs[pred_pt],
                        text: "Hem detectat que el teu tipus de jugador predominat és " + PTs[pred_pt] + ". " + PTTexts[pred_pt],
                        icon: 'success',
                        confirmButtonText: 'Comença'
                      })) 
        .then(dump2 => (window.location.replace(dashboard_url)))
        .catch(error => (console.log("Error: " + error))) 
        //))
    //.catch(error => (console.log("Error: " + error)))             
}

function GamificationSetupXBlock(runtime, element) {

    function setup_gamification(result) { 
        //Result have fields ::
        //  - username
        //  - dashboard_url
        //$('.count', element).text(result.count);
        uname = result["username"]; // read from result
        gtype = result["gtype"];
        console.log(gtype);
        if(gtype == "Adaptive"){
          gtype = "C2";
        }else{
          gtype = "B";
        }
        console.log(gtype);
        protocol = window.location.protocol;
        //console.log(protocol);
        hostname = window.location.hostname;
        //console.log(hostname);
        course_id = result["course_id"];
        //console.log(course_id);
        tab_id = result["tab_id"];
        //console.log(tab_id);
        dashboard_url = protocol + "//" + hostname + "/courses/" + course_id + "/" + tab_id;
        //console.log(dashboard_url);
        //console.log("test");
        
        questions = ["Interactuar amb els demés és important per a mi.", 
                     "Em fa feliç ajudar als demés.",
                     "Seguir el meu propi camí és important per a mi.",
                     "M'agrada formar part d'un equip.",
                     "M'agrada provocar.",
                     "M'agraden les competicions on es poden guanyar premis.",
                     "Sentir que formo part d'una comunitat és important per a mi.",
                     "Sovint em deixo guiar per la curiositat.",
                     "M'agrada qüestionar l'estat de les coses.",
                     "Els premis son una bona forma de motivar-me.",
                     "M'agrada provar coses noves.",
                     "M'agrada superar obstacles.",
                     "M'agrada guiar als demés en situacions noves.",
                     "EM descric a mi mateix com un rebel.",
                     "Disfruto de les activitats grupals.",
                     "Realitzar sempre les meves tasques completament és important per a mi.",
                     "No m'agrada seguir les normes.",
                     "M'agrada compartir el meu coneixament amb els demés.",
                     "M'és difícil abandonar un problema abans d'haver-hi trobat una solució.",
                     "M'importa beneficiar-me del que inverteixo (temps, esforç,...)",//"El retorno de inversión es importante para mí.",
                     "Ser independent és important per a mi.",
                     "M'agrada dominar tasques difícils.",
                     "El benestar dels demés és important per a mi.",
                     "Si el premi és adequat, faré un esforç.",
                    ];
        //Disruptor = 0, Free spirit = 1, Achiever = 2, Player = 3, Socializer = 4, Philantropist = 5, No Player = 6
        questions_PT = [4,5,1,4,0,3,4,1,0,3,1,2,5,0,4,2,0,5,2,3,1,2,5,3]
        profile = [0,0,0,0,0,0,0]

        fetch("https://agmodule.herokuapp.com/api/gamers/" + uname + "/")
        .then(response => response.json())
        .then(function(resJson){
          console.log(resJson);
          if(resJson.user.username != "undefined"){
            console.log("Gamification user found: " + resJson.user.username);
            document.getElementById("poll").innerHTML = "<div>Com ja sabem quin tipus de jugador ets, ja pots començar el curs... <a href='" + dashboard_url + "'>Endavant!</a>  </div>";
          }else{
            throw Error("Gamified user not found: Initial questionnaire shown.");
          }
        })
        .catch(error => (console.log("Error: " + error), questions.forEach((item,index) => (document.getElementById("poll").innerHTML += '<div></div><h2>Question ' + (index + 1) + '</h2><h3>'+ item + '</h3>' +
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
                                                                                        '</ul></div><br><br><br><br><br><br><br>')),
        document.getElementById("poll").innerHTML += '<br><br><br><br><div style="text-align:center;"><button style="width:20%;" onclick="register()">Start Gamification</button></div>'))  
        

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
