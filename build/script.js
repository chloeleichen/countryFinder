(function () {
 'use strict';
  var CountryDataWrapper = React.createClass({displayName: "CountryDataWrapper",
  getInitialState:function(){
    return {
      data: [],
      filterText: '',
      results : []
    }
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({
          data: data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleUserInput: function(filterText) {
    function matchRe(el){
      if (filterText){
        var re = new RegExp("^" + filterText, 'i');
        return re.test(el.countryName);
      } else {
        return false;
      }
    };
    var matchRe = matchRe.bind(this);

    var r = (this.state.data)? this.state.data.countries.country.filter(matchRe):[]

    this.setState({
      filterText: filterText,
      results: r
    });
  },

  render:function(){
    var results = this.state.results;
    return (
      React.createElement("div", null, 
      React.createElement(SearchBox, {filterText: this.state.filterText, 
                 onUserInput: this.handleUserInput}), 
        React.createElement("ul", {className: "collection"}, 
        results.map(function(result) {
          // <li> {result} </li>
          return(React.createElement(CountryData, {key: result.countryCode, result: result}))
          // <CountryData result = {result} />
        })
        )
      )
      );
   }
 });

 var SearchBox = React.createClass({displayName: "SearchBox",
  handleChange:function(event){
    this.props.onUserInput(
      event.target.value
      );
  },

  render: function() {
    return (
      React.createElement("form", null, 
      React.createElement("label", {htmlFor: "search"}, "Start typing a country name:"), 
      React.createElement("input", {
      id: "search", 
      type: "text", 
      className: "field", 
      autoComplete: "off", 
      onChange: this.handleChange, 
      value: this.props.filterText})
      )
      );
    }
  });

 var CountryData = React.createClass({displayName: "CountryData",
  getInitialState:function(){
    return {open: false};
  },

  handleClick: function(event) {
    this.setState({open: !this.state.open});
  },

  render:function(){
    var country = this.props.result;
    var dataToLoad;
    if(country){
      var iconClass = 'circle flag-icon flag-icon-'+ country.countryCode.toLowerCase();
      var listClass = (this.state.open? 'open': 'close') + ' collection-item avatar';
        return (
          React.createElement("li", {className: listClass}, 
          React.createElement("i", {className: iconClass}), 
          React.createElement("p", null, React.createElement("span", {className: "title"}, country.countryName), 
          React.createElement("br", null), 
          React.createElement("strong", null, " Capital "), 
          country.capital, 
          React.createElement("br", null), 
          React.createElement("strong", null, " Continent "), 
          country.continentName
          ), 
          React.createElement("a", {onClick: this.handleClick, className: "secondary-content"}, " ||| "), 
          React.createElement("table", {className: "striped more-info"}, 
          React.createElement("tbody", null, 
          React.createElement("tr", null, 
          React.createElement("th", null, "Country code"), 
          React.createElement("td", null, country.countryCode)
          ), 
          React.createElement("tr", null, 
          React.createElement("th", null, "Population"), 
          React.createElement("td", null, country.population)
          ), 
          React.createElement("tr", null, 
          React.createElement("th", null, "Currency"), 
          React.createElement("td", null, country.currencyCode)
          ), 
          React.createElement("tr", null, 
          React.createElement("th", null, "Area"), 
          React.createElement("td", null, country.areaInSqKm)
          )
          )
          ), 
          React.createElement(CountryMap, {countryCode: country.countryCode})
          )
          );
        }
    }
 });

var CountryMap = React.createClass({displayName: "CountryMap",
  getInitialState:function(){
    return {
      data: [],
      active: ''
    }
  },

  mouseOver:function(event){
    event.target.style.fill="#e88630";
    this.setState({active:event.target.id });
  },

  mouseOut: function(event){
    event.target.style.fill="#ccc";
    this.setState({active:'' });

  },

  componentDidMount: function() {
    var targetUrl = 'maps/'+ this.props.countryCode.toLowerCase()+'.json';
      $.ajax({
        url: targetUrl,
        dataType: 'json',
        cache: false,
        success: function(data) {
          this.setState({
            data: data
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.log('file not found');
        }.bind(this)
      });
  },


  render: function(){
    if (this.state.data.path){
      var arr = this.state.data.path;
      var text = this.state.active ? this.state.active : 'hover over map for more info';
      return (
        React.createElement("div", null, 
        React.createElement("p", null, " ", text, " "), 
        React.createElement("svg", {width: "600px", height: "400px", viewBox: "0 0 600 600"}, 
              arr.map(function(el){
              return (React.createElement("path", {onMouseOver: this.mouseOver, onMouseOut: this.mouseOut, id: el.title, key: el.title, d: el.d}))
              }, this)
             )
          )
      );
    } else{
      return React.createElement("div", null, " ")
    }
  }
});
  React.render(
    React.createElement(CountryDataWrapper, {url: "data.json"}),
    document.getElementById('search')
  );
 }());



