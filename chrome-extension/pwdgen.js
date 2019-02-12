SVL = {}; SVL.storage = {};
SVL.storage.get = function(callback, key = 'mainkey') {
  if (window.chrome && chrome.storage) // this requires 'storage' permissions in the manifest.json
    chrome.storage.local.get([key],function(result){
      callback(result[key])
    })
  else callback( localStorage.getItem(key) )
}
SVL.storage.set = function(value, key = 'mainkey') {
  if (window.chrome && chrome.storage) {
    var obj = {}; obj[key] = value
    chrome.storage.local.set(obj)
  }
  else localStorage.setItem(key, value)
}

function genPwdHash(apex,secret,maxlength){
  var str = apex + secret
  for (var i=0;i<100;i++) {
    var hash1 = CryptoJS.SHA512(str).toString()
    console.log('First hash, the sha512sum',hash1, hash1.length)
    var hash2 = CryptoJS.SHA1(hash1).toString()
    console.log('Hash used for base64',hash2, hash2.length)
    var pairs = hash2.match(/\w{2}/g)
    var binarr = pairs.map(function(a){return String.fromCharCode(parseInt(a, 16));} )
    var binstr = binarr.join("")
    var base64 = btoa(binstr)
    if (base64.length > maxlength)
      base64 = base64.substr(base64.length - maxlength)
    if ( /[0-9]/.test(base64)
        && /[A-Z]/.test(base64)
        && /[a-z]/.test(base64) )
      break
    else {
      str += 'p'
      console.log('Adding a p as padding')
    }
  }
  return base64
}

function shortpwd(){ generate(12) }
function fullpwd(){ generate(28) }

function generate(maxlength) {
  var apex = document.getElementById('apex').value
  var secret = getSecVal()
  var pwd = genPwdHash(apex, secret, maxlength).toString()
  var outp = document.getElementById('output')
  outp.value = pwd
  outp.disabled = false
  outp.select()
  document.execCommand("Copy")
  outp.disabled = true
}
function getSecVal() {
  var secretelem = document.getElementById('secret')
  secretelem.type = 'password'
  return secretelem.value
}
function eye() {
  var e = document.getElementById("secret")
  if(e.type === 'text') return

  e.value = ''
  e.type = 'text'
}
function save() {
  SVL.storage.set(getSecVal())
  alert('Saved to LocalStorage')
}

function enlargeOutputfld() {
  document.getElementById('output').style = 'width:275px;'
}

//set the saved password from localstorage
SVL.storage.get(function(saved){
  if (! saved) return
  document.getElementById('secret').value = saved
  getSecVal() // make it type password instead of text
})


function getApexFromChrome(){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var tab = tabs[0]
    var url = tab.url;
    var host = url.split('//')[1].split('/')[0]
    
    var hostarr = host.split('.')
    if (hostarr[0] === 'www') hostarr.shift()

    var apexpart = hostarr[hostarr.length - 2]
    var tld = hostarr[hostarr.length - 1]
    var domain = apexpart + '.' + tld
    // it could be that the apex is a subdomain like something.[co,edu,net,org].uk.
    if (hostarr.length > 2 && apexpart.length < 4)
      domain = hostarr[hostarr.length - 3] + '.' + domain

    document.querySelector('#apex').value = domain
  })
}
if (window.chrome && chrome.tabs) getApexFromChrome()
else {
  if (window.location.hash)
    document.querySelector('#apex').value = window.location.hash.substr('1')
}

document.querySelector('#eyebtn').addEventListener('click',eye)
document.querySelector('#savebtn').addEventListener('click',save)
document.querySelector('#fullpwdbtn').addEventListener('click',fullpwd)
document.querySelector('#shortpwdbtn').addEventListener('click',shortpwd)
document.querySelector('#enlargeOutputfldbtn').addEventListener('click',enlargeOutputfld)
document.querySelector('#showHelpBtn').addEventListener('click',function(){
  var ps = document.querySelectorAll('p')
  ps.forEach(function(p){ p.style.display = 'block' })
  document.querySelector('#showHelpBtn').style.display = 'none'
})

/*
The following enables us to have a PWA
Progressive Web App

Having a service worker is a requirement,
please see: https://developers.google.com/web/fundamentals/app-install-banners/#criteria
*/
if (navigator && 'serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
let deferredPrompt;
var btnAdd = document.querySelector('#addPWAbtn')
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can add to home screen
  btnAdd.style.display = 'block';
});
btnAdd.addEventListener('click', (e) => {
  // hide our user interface that shows our A2HS button
  btnAdd.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
});


