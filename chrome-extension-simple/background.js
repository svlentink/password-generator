
function getPassword(){
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

    var pwdurl = 'https://lent.ink/projects/pwd/#' + domain
    chrome.tabs.create({'url':pwdurl})
  })
}

chrome.browserAction.onClicked.addListener(getPassword);
