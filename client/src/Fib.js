import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    console.log("server is started")
    const values = await axios.get('/api/values/current');
    console.log("/api/values/current", values.data);
    console.log("/api/values/current", values.data[0]);
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    try{
      
      const seenIndexes = await axios.get('/api/values/all');
      console.log("get the seen indexes one value",seenIndexes[0]);

      console.log("get the indexes",seenIndexes);
      if ((seenIndexes.data).length<=0){
        this.state.seenIndexes.push(1)
      }
      this.setState({
        seenIndexes: seenIndexes.data,
      });
    }catch(e){
      console.log(e)
      this.state.seenIndexes.push(1)
    }
  
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post('/api/values', {
      index: this.state.index,
    });
    this.setState({ index: '' });
  };

  renderSeenIndexes() {
    console.log('renderSeenIndexes',this.state.seenIndexes);
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
