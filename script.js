var liveSearch = (function() {
  'use strict';
  var self,
    data,
    search = document.getElementById('search'),
    main = document.getElementById('main'),
    tooltip = document.getElementById('tooltip'),
    request,
    country,
    output = '',
    arr,
    searchVal, 
    button,
    re,
    li,
    i,
    p,
    a,
    table,
    map;

  function connect() {
    if (window.XMLHttpRequest) {
      request = new XMLHttpRequest();
    } else {
      request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    request.onreadystatechange = function() {
      if ((request.status === 200) &&
        (request.readyState === 4)) {
        data = JSON.parse(request.responseText);
        logJson(data);
      }
    };
    
  }

  function logJson(data) {
    main.innerHTML='';
    arr = data.countries.country;
    var result = arr.filter(matchRe) || '';
    result.forEach(function(element){
      main.appendChild(htmlConstruct(element));
    });
  }

  function htmlConstruct(element){
    li = document.createElement('li');
    i = document.createElement('i');
    p = document.createElement('p');
    a = document.createElement('a');
    table = document.createElement('div');
    map = document.createElement("object");
    map.type = "image/svg+xml";
    map.data = 'maps/'+ element.countryCode.toLowerCase() +'.svg';

    li.classList.add('collection-item');
    li.classList.add('avatar');
    i.classList.add('flag-icon-'+ element.countryCode.toLowerCase());
    i.classList.add('circle');
    i.classList.add('flag-icon');
    a.classList.add('secondary-content');
    table.classList.add('info');

    a.textContent = "|||";
    p.innerHTML = '<span class="title">'+  element.countryName +'</span> </br><strong> Capital:  </strong>'+ element.capital +'</br> <strong> Continent: </strong> '+element.continentName;
    table.innerHTML = '<table class="striped more-info"><tr><th>Population:</th> <td>'+element.population+'</td></tr><tr><th>Currency:</th><td>'+element.currencyCode+'</td></tr><tr><th>Area:</th><td>'+element.areaInSqKm+' sq </td></tr></table>';
    li.appendChild(i);
    li.appendChild(p);
    li.appendChild(a);
    li.appendChild(table);
    li.appendChild(map);
    a.addEventListener('click', toggle);
    map.addEventListener("load",function(){
        var svgDoc = map.contentDocument; 
        var delta = svgDoc.getElementsByTagName('path'); 
        for (var i = 0; i < delta.length; i++) { 
          loadInfo(delta[i]);
      }
    },false);
    return li;
  }

  function toggle(e){
    e.preventDefault();
    if (e.target === this){
      if(this.parentNode.classList.contains('open')){
        this.parentNode.classList.remove('open');
      }else{
        this.parentNode.classList.add('open');

      }
    }
  }

  function loadInfo(element){
    element.addEventListener('mouseover', function handler(e){
      element.style.fill="#e67e22"
      element.style.stroke = '#000';
    });
    element.addEventListener('mouseout', function handler(e){
      element.style.fill = '#CCCCCC';
      element.style.stroke = '#fff';
    })
  }



  function matchRe(el){
    if (searchVal){
      var re = new RegExp("^" + searchVal, 'i');
      return re.test(el.countryName);
    } else {
      return false;
    }
  }

  function initEvent() {
    search.addEventListener('keyup', function(ev) {
      if (ev.target == this) {
        searchVal = this.value;
        request.open('GET', 'data.json');
        request.send();
      }
    });
    connect();
  }

  function handler(e){
    e.preventDefault();
    if(e.target == this){
      this.parentNode().classList.toggle('open');
    }
  }

  initEvent();
  return self;
}());
