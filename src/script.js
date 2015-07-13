(function () {
 'use strict';
  var CountryDataWrapper = React.createClass({
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
      <div>
      <SearchBox filterText={this.state.filterText}
                 onUserInput={this.handleUserInput} />
        <ul className="collection">
        {results.map(function(result) {
          // <li> {result} </li>
          return(<CountryData key={result.countryCode} result = {result} />)
          // <CountryData result = {result} />
        })}
        </ul>
      </div>
      );
   }
 });

 var SearchBox = React.createClass({
  handleChange:function(event){
    this.props.onUserInput(
      event.target.value
      );
  },

  render: function() {
    return (
      <form>
      <label htmlFor="search">Start typing a country name:</label>
      <input
      id="search"
      type="text"
      className="field"
      autoComplete="off"
      onChange = {this.handleChange}
      value={this.props.filterText}/>
      </form>
      );
    }
  });

 var CountryData = React.createClass({
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
          <li className={listClass}>
          <i className={iconClass}></i>
          <p><span className ='title'>{country.countryName}</span>
          <br/>
          <strong> Capital </strong>
          {country.capital}
          <br/>
          <strong> Continent </strong>
          {country.continentName}
          </p>
          <a onClick={this.handleClick} className='secondary-content'> ||| </a>
          <table className='striped more-info'>
          <tbody>
          <tr>
          <th>Country code</th>
          <td>{country.countryCode}</td>
          </tr>
          <tr>
          <th>Population</th>
          <td>{country.population}</td>
          </tr>
          <tr>
          <th>Currency</th>
          <td>{country.currencyCode}</td>
          </tr>
          <tr>
          <th>Area</th>
          <td>{country.areaInSqKm}</td>
          </tr>
          </tbody>
          </table>
          <CountryMap countryCode ={country.countryCode}/>
          </li>
          );
        }
    }
 });
  
var CountryMap = React.createClass({
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
        <div>
        <p> {text} </p>
        <svg width="300px" height="300px" viewBox="0 0 300 300">
              {arr.map(function(el){
              return (<path onMouseOver= {this.mouseOver} onMouseOut={this.mouseOut} id ={el.title} key = {el.title} d ={el.d}></path>)
              }, this)}
             </svg>
        </div>
      );
    } else{
      return <div> </div>
    }

  }
});

  React.render(
    <CountryDataWrapper url="data.json" />,
    document.getElementById('search')
  );


 }());



