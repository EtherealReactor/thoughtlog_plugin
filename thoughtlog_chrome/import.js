var __request_code;
var __access_token_string;

function process_bookmarks ( bookmarks ) {
    // document.getElementById("progress-icon").innerHTML = "<img height='50px' width='50px' src='uploading.gif'></img>"
    // document.getElementById("progress-text").innerHTML = "Uploadig bookmarks to Pocket"
    console.log("Beginning import...")
    for ( var i =0; i < bookmarks.length; i++ ) {
        var bookmark = bookmarks[i];
        if ( bookmark.url ) {
            // xmlhttp = make_xmlhttprequest("POST", "https://getpocket.com/v3/add", true)
            console.log( "Adding url: "+ bookmark.url );
            // make_http_request("http://ec2-35-154-178-237.ap-south-1.compute.amazonaws.com/api/thoughts", bookmark.title, bookmark.url)
            chota_div = document.createElement('div')
            chota_div.innerHTML= "Added Url:  "+ bookmark.url;
            console.log(chota_div)
            //document.getElementById("progress").appendChild(chota_div)   
            // xmlhttp.send("consumer_key="+ consumer_key +"&" + __access_token_string +"&url="+ encodeURI(bookmark.url) + "&tags=ChromeBookmarks")
            document.getElementById("bookmarkDiv").innerHTML=document.getElementById("bookmarkDiv").innerHTML+ 
            "<div> <input type='checkbox' id='url' name='book' value='<a href="+encodeURI(bookmark.url)+" >"+ encodeURI(bookmark.title) +" </a>'checked > " + bookmark.title +"</input></div>"
        }

        if ( bookmark.children ) {
            process_bookmarks( bookmark.children );
        }
    }
    console.log("Completed import...")
}

function make_http_request(action, title, url){
// var decodedCookie = decodeURIComponent(document.cookie);
// var ca = decodedCookie.split('=');
// var f=$.parseJSON(ca[1])
// var username= f["currentUser"]["username"]
var username=__request_code.username
desc= "<a href='"+url +"' > "+ title+" </a> "
// console.

myDataVar= {created_by: username  , description: desc}
// console.log(myDataVar);
$.ajax({
      type: "POST",
      url: action ,
      data: myDataVar,
      dataType: "json",
      headers: {
                    'Access-Control-Allow-Origin': '*'
                },
      success: function(resultData){
          console.log("Save Complete : " + myDataVar);
      }
});

}

function get_redirect_url () {
    return chrome.identity.getRedirectURL();
}

//TODO place your pocket consumer key here
function get_pocket_consumer_key () {
    return "your_consumer_key_here"
}

function make_xmlhttprequest (method, url, flag) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, url, flag);
    xmlhttp.setRequestHeader( "Content-type","application/x-www-form-urlencoded" );
    return xmlhttp
}

function get_request_code (consumer_key) {
    redirect_url = get_redirect_url();
    xmlhttp = make_xmlhttprequest ('POST', 'https://getpocket.com/v3/oauth/request', true) 
    xmlhttp.onreadystatechange = function () {
        if ( xmlhttp.readyState === 4 ) {

            if (xmlhttp.status === 200){
                request_code = xmlhttp.responseText.split('=')[1];
                __request_code = request_code
                lauch_chrome_webAuthFlow_and_return_access_token(request_code);
                }
                else {
                    document.getElementById("progress-icon").innerHTML = "<img height='50px' width='50px' src='failed.png'></img>"
                    document.getElementById("progress-text").innerHTML = "Authentication failed!!"
                }
        }
    }
    xmlhttp.send("consumer_key="+ consumer_key +"&redirect_uri="+ redirect_url)

}

function get_access_token () {
    xmlhttp = make_xmlhttprequest('POST', 'https://getpocket.com/v3/oauth/authorize', true); 
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            access_token_string = xmlhttp.responseText.split('&')[0]
            __access_token_string = access_token_string
            chrome.bookmarks.getTree( process_bookmarks );

        }
    }
    xmlhttp.send( "consumer_key="+ consumer_key +"&code="+ request_code )
}

function lauch_chrome_webAuthFlow_and_return_access_token (request_code) {
    redirect_url = get_redirect_url();
    chrome.identity.launchWebAuthFlow(
        {'url': "https://getpocket.com/auth/authorize?request_token="+ request_code + "&redirect_uri="+ redirect_url, 'interactive': true},
        function(redirect_url) { 
            //Get access token
            get_access_token(consumer_key, request_code);
        });

}

function import_my_chrome_bookmarks () {
    document.getElementById("progress-icon").innerHTML = "<img height='50px' width='50px' src='authenticating.gif'></img>"
    document.getElementById("progress-text").innerHTML = "Authenticating with Poket"
    consumer_key = get_pocket_consumer_key();
    get_request_code(consumer_key);

}

window.onload = function(){
    // import_my_chrome_bookmarks();
    // chrome.bookmarks.getTree( process_bookmarks );
};

  // document.getElementById("bookmark").addEventListener('click', addThis);
  // document.getElementById("thlink").addEventListener('click', showThought);
  // document.getElementById("currTabs").addEventListener('click', currentTab);
  // document.getElementById("addTab").addEventListener('click', addTabs);

function addThis(){
    console.log('cccc :: addThis' )
    document.getElementById("bookmarkOuterDiv").style.display="block";
    document.getElementById("bookmarkDiv").innerHTML="";
    document.getElementById("tabNav").style.display="block";
    chrome.bookmarks.getTree( process_bookmarks );
    document.getElementById("thoughts").style.display="none";
    
    
}

function addTabs(){
    console.log('cccc :: addTabs' )
    document.getElementById("bookmarkOuterDiv").style.display="block";
    document.getElementById("tabNav").style.display="block";
    document.getElementById("bookmarkDiv").innerHTML="";
    document.getElementById("thoughts").style.display="none";
    chrome.tabs.query({},function(tabs){     
    console.log("\n/////////////////////\n");
    tabs.forEach(function(tab){
      console.log(tab.url);
      chota_div = document.createElement('div')
            chota_div.innerHTML= "Added Url:  "+ bookmark.url;
            console.log(chota_div)
            //document.getElementById("progress").appendChild(chota_div)   
            // xmlhttp.send("consumer_key="+ consumer_key +"&" + __access_token_string +"&url="+ encodeURI(bookmark.url) + "&tags=ChromeBookmarks")
            document.getElementById("bookmarkDiv").innerHTML=document.getElementById("bookmarkDiv").innerHTML+ 
            "<div> <input type='checkbox'  id='url' name='book' value='<a href=\""+encodeURI(tab.url)+"\" >"+ escape(tab.title) +" </a>' checked > " + tab.title +"</input></div>"
    });
 }); 
}

function currentTab(){
    console.log('cccc :: currenttab' )
    var currenttab;
    document.getElementById("bookmarkOuterDiv").style.display="block";
    document.getElementById("tabNav").style.display="block";
    document.getElementById("thoughts").style.display="none";
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        currenttab = tabs[0].url;
         document.getElementById("bookmarkDiv").innerHTML=document.getElementById("bookmarkDiv").innerHTML+ 
            "<div> <input type='checkbox'  id='url' name='book' value='<a href=\""+encodeURI(tabs[0].url)+"\" >"+ escape(tabs[0].title) +" </a>' checked > " + tabs[0].title +"</input></div>"
    });
     
}


function showThought(){
    // chrome.bookmarks.getTree( process_bookmarks );
    document.getElementById("thoughts").style.display="block";
    document.getElementById("bookmarkOuterDiv").style.display="none";
    document.getElementById("tabNav").style.display="block";

    
}

//  addThoughtapi = function(word){
//     var query = word.selectionText;
//     chrome.tabs.create({url: "http://thoughtlog.thehelmet.life?term=" + query});
//  };

// chrome.contextMenus.create({
//  title: "add ThoughtLog",
//  contexts:["selection"],  // ContextType
//  onclick: addThoughtapi // A callback function
// });

