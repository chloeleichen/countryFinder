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
      if (this.state.filterText){
        var re = new RegExp("^" + this.state.filterText, 'i');
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
        <ul>
        {results.map(function(result) {
          <CountryData result = {result}/>
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
      value={this.props.filterText}
      />
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
    console.log(this.props);
    var country = this.props.result;
    var dataToLoad = <li> </li>;
    if(country){
      var iconClass = 'circle flag-icon flag-icon-'+ country.countryCode.toLowerCase();
      var listClass = (this.state.open? 'open': 'close') + ' collection-item avatar';
        return (
          <li key={country.countryCode} className={listClass}>
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
          </li>
          );
        }
    }
 });

  React.render(
    <CountryDataWrapper url="data.json" />,
    document.getElementById('search')
  );


 }());



