(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){e(require("jquery"))}else{e(jQuery)}})(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function r(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function s(e){if(e.indexOf('"')===0){e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{e=decodeURIComponent(e.replace(t," "));return u.json?JSON.parse(e):e}catch(n){}}function o(t,n){var r=u.raw?t:s(t);return e.isFunction(n)?n(r):r}var t=/\+/g;var u=e.cookie=function(t,s,a){if(s!==undefined&&!e.isFunction(s)){a=e.extend({},u.defaults,a);if(typeof a.expires==="number"){var f=a.expires,l=a.expires=new Date;l.setTime(+l+f*864e5)}return document.cookie=[n(t),"=",i(s),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}var c=t?undefined:{};var h=document.cookie?document.cookie.split("; "):[];for(var p=0,d=h.length;p<d;p++){var v=h[p].split("=");var m=r(v.shift());var g=v.join("=");if(t&&t===m){c=o(g,s);break}if(!t&&(g=o(g))!==undefined){c[m]=g}}return c};u.defaults={};e.removeCookie=function(t,n){if(e.cookie(t)===undefined){return false}e.cookie(t,"",e.extend({},n,{expires:-1}));return!e.cookie(t)}})
$( document ).ready(function() {
 function getUsersLocation(){
    $.getJSON('/api/get-locations',function(locations) {
      locations.results.forEach(function(person) {
        console.log(parseFloat(person.value.lon));
        map.addMarker({
          lat: parseFloat(person.value.lat),
          lng: parseFloat(person.value.lon),
          title: 'Your location',
          icon: '/img/pointer_user.png',
          infoWindow: {
            content: "<div class='row info-window'><div class='twitter-img'><img src="+person.value.profilePic+" class='img-circle'></div><div class='twitter-details'><p class='handle'>"+person.value.username+"</p><p class='profession'>"+person.value.profession+"</p><p class='display-name'>"+person.value.displayName+"</p></div></div>"
          }
          });
      });
    });
  }

  var cookies = $.cookie();
  if(cookies['t_username'] != undefined){
  	console.log(cookies['t_username']);
  }else{
  	console.log('no twitter username stored');
  }
  	function showL(nb1, nb2){
      console.log(nb1);
    var lati = nb1['coords']['latitude'];
    var longi = nb1['coords']['longitude'];
    var uniq = document.cookie['accessToken'];
    console.log(lati);
    console.log(longi);
// $.ajax({
//   url: "/api/update-location?uniq=" + uniq + '&lat=' + lati + '&lon=' + longi}).done(function() {
// console.log('loc sent');
// });


    }
  function getLocation(){
    if (navigator.geolocation)
      {
      navigator.geolocation.getCurrentPosition(showL);
      }
    else{
      console.log = ("Geolocation is not supported by this browser.");
    }
  }
    
  getLocation();

  var map = new GMaps({
    div: '#map',
    lat: 51.523106399999996,
    lng: -0.0871506
  });

// /api/update-location?uniq=[cookie]&lat=X&long=Y
// /api/get-locations
  GMaps.geolocate({
  success: function(position) {
    map.setCenter(position.coords.latitude, position.coords.longitude);
    map.addMarker({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      title: 'Your location',
      icon: '/img/you.png',
      infoWindow: {
        content: "<div class='row info-window'><div class='twitter-img'><img src='https://pbs.twimg.com/profile_images/438295703077396482/I0NoL2Ey_normal.jpeg' class='img-circle'></div><div class='twitter-details'><p class='handle'>julienbrunuk</p><p class='profession'>Web Developer</p><p class='display-name'>Julien Brun</p></div></div>"
      }
    });
    
  },
  error: function(error) {
    alert('Geolocation failed: '+error.message);
  },
  not_supported: function() {
    alert("Your browser does not support geolocation");
  }
});
map.addMarker({
      lat: 51.52531,
      lng: -0.09280,
      title: 'Look Mum No Hands',
      icon: '/img/pointer_partner.png',
      infoWindow: {
        content: "<div class='row info-window'><div class='twitter-img'><img src='https://pbs.twimg.com/profile_images/1317582521/logo-blue-circle-cutout_bigger.png' class='img-circle'></div><div class='twitter-details'><p class='handle'>lookmum</p><p class='profession'>Coffee Shop</p><p class='display-name'>Look Mum No Hands</p></div></div>"
      }
    });




getUsersLocation();
setTimeout(function(){
  map.setZoom(17);
}, 10000);

});

