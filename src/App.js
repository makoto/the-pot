import logo from './logo.svg';
import './App.css';
import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import moment from 'moment';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
 
// const chartdata = {
//   x: 'x',
//   columns: [
//     ['x', '2013-01-01', '2013-01-02','2013-01-03','2013-01-04','2013-01-05','2013-01-06'],
//     ['data1', 30, 200, 100, 400, 150, 250],
//     ['data2', 50, 20, 10, 40, 15, 25]
//   ]
// };

const axis = {
  x: {
      type: 'timeseries',
      tick: {
          format: '%Y/%m/%d'
      }
  }
}
 
const GET_META = gql`
  query {
    metaEntities {
      numParties
      numMoneyTransactions
    }
  }
`

const GET_STATS = gql`
  query {
    statsEntities {
      timestamp
      numIn
      numOut
      amountIn
      amountOut
    }
  }
`

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Kickkback staking</h1>
        <Query query={GET_META}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            console.log({data})
            if (error) return <div>Error :(</div>;
            return (
              <div>
                {data.metaEntities[0].numParties} parties has been hosted on Kickback
              </div>
            )
          }}
        </Query>
        <Query query={GET_STATS}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            const pushItem = function(items, item){
              let lastitem = items[items.length - 1] || 0
              let newitem = (parseInt(item) || 0) / (10 ** 18)
              items.push(lastitem + newitem )
            }
            if (error) return <div>Error :(</div>;
              let dates = []
              let ins = []
              let outs = []
              let diffs = []
              data.statsEntities
              .sort((a, b) => a.timestamp - b.timestamp)
              // .filter(({timestamp}) => {return parseInt(timestamp) > 1549649866})
              .map(({timestamp, numIn, numOut, amountIn, amountOut}) =>{
                let date = moment(new Date(parseInt(timestamp) * 1000))
                dates.push(date)
                pushItem(ins, amountIn)
                pushItem(outs, amountOut)
              });
              dates.unshift('x')
              ins.map((d, i)=>{
                diffs[i] = d - outs[i]
              })
              ins.unshift('Money In')
              outs.unshift('Money Out')
              diffs.unshift('Delta')
              const chartdata = {
                  x: 'x',
                  columns: [
                    dates, ins, outs, diffs
                  ]
                };
                

            const listItems = data.statsEntities
              .sort((a, b) => a.timestamp - a.timestamp)
              .filter(({timestamp}) => {return parseInt(timestamp) < 1549649866})
              .map(({timestamp, numIn, numOut, amountIn, amountOut}) =>
              <li>{[moment(new Date(parseInt(timestamp) * 1000)).calendar(),timestamp,  numIn, numOut, amountIn, amountOut].join(',')}</li>
            );
            return (
              <>
                <C3Chart data={chartdata} axis={axis} />
                {/* <ul>
                  {listItems}
                </ul> */}
              </>
            )
          }}
        </Query>
      </header>
    </div>
  );
}

export default App;
