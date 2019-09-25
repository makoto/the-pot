import logo from './logo.svg';
import './App.css';
import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import moment from 'moment';
import C3Chart from 'react-c3js';
import 'c3/c3.css'
import styled from '@emotion/styled'

let Container = styled.div({
  width:'90%',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row'
})

let SmallText = styled.div({
  fontSize:'small'
})
let OuterContainer = styled.div({
  width:'90%',
})
let ParticipantContainer = styled.div({
  width:'90%',
})
let ChartColumn = styled.div({
  width:'40%',
  // float:'left'
})
 
const axis = {
  x: {
      type: 'timeseries',
      tick: {
          format: '%Y/%m/%d',
          culling: {
            max: 4 // the number of tick texts will be adjusted to less than this value
          }
      }
  }
}
 
const GET_META = gql`
  query {
    metaEntities {
      numParties
      limitOfParticipants
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
      amountInDai
      amountOutDai
    }
  }
`
function Chart({data, grid, max}){
  const axis = {
    x: {
        type: 'timeseries',
        tick: {
            format: '%Y/%m/%d',
            culling: {
              max: 4 // the number of tick texts will be adjusted to less than this value
            }
        }
    },
    y: {
      min:0,
      max: max + 10,
      // Range includes padding, set 0 if no padding needed
      padding: {top:10, bottom:10}
    }
  }

  return(
    <C3Chart
      data={data}
      axis={axis}
      tooltip={{show:false}}
      point= {{show:false}}
      grid= { {y:{lines:[{value: max, text: 'MAX CAPACITY'}]} }}
      color={{
        pattern: ['#aec7e8']
      }}
    />
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Kickback staking</h1>
        <Query query={GET_META}>
          {({ metaloading, metaerror, data:metadata}) => {
            const meta = metadata && metadata.metaEntities[0]
            console.log({meta})
            if (metaloading) return <div>Loading...</div>;
            if (metaerror) return <div>Error :(</div>;
            return (
              <Query query={GET_STATS}>
              {({ loading, error, data }) => {
                if (loading) return <div>Loading...</div>;
    
                const pushItem = function(items, item, iscurrency=true){
                  let delimiter = iscurrency ?  (10 ** 18) : 1
                  let lastitem = items[items.length - 1] || 0
                  let newitem = (parseInt(item) || 0) / (delimiter)
                  items.push(lastitem + newitem )
                }
                console.log({data})
                if (error) return <div>Error :(</div>;
    
                  let dates = []
                  let numins = []
                  let ins = []
                  let outs = []
                  let insDai = []
                  let outsDai = []
                  let diffs = []
                  let diffsDai = []
                  data.statsEntities
                  .sort((a, b) => a.timestamp - b.timestamp)
                  .map(({
                    timestamp,
                    numIn,
                    numOut,
                    amountIn,
                    amountOut,
                    amountInDai,
                    amountOutDai
                  }) =>{
                    let date = moment(new Date(parseInt(timestamp) * 1000))
                    dates.push(date)
                    // console.log({
                    //   numIn,
                    //   amountIn,
                    //   amountInDai  
                    // })
                    // console.log({numins})
                    pushItem(numins, numIn, false)
                    pushItem(ins, amountIn)
                    pushItem(outs, amountOut)
                    pushItem(insDai, amountInDai)
                    pushItem(outsDai, amountOutDai)
                  });
                  dates.unshift('x')
                  ins.map((d, i)=>{
                    diffs[i] = d - outs[i]
                  })
                  insDai.map((d, i)=>{
                    diffsDai[i] = d - outsDai[i]
                  })
                  numins.unshift('in')
                  ins.unshift('in')
                  outs.unshift('out')
                  diffs.unshift('delta')
                  insDai.unshift('in')
                  outsDai.unshift('out')
                  diffsDai.unshift('delta')
    
                  const chartdata = {
                      x: 'x',
                      columns: [
                        dates, ins
                      ],
                      types: {
                        in: 'spline'
                      }  
                  };
                  const chartdataDai = {
                    x: 'x',
                    columns: [
                      dates, insDai,
                    ],
                    types: {
                      in: 'spline'
                    },
                  };
                  const chartdataParticipants = {
                    x: 'x',
                    columns: [
                      dates, numins
                    ],
                    types: {
                      in: 'spline'
                    }
                  };
                  const lastnumins = numins[numins.length - 1]
                  const lastinsDai = insDai[insDai.length - 1]
                  const lastins = ins[ins.length - 1]
                  console.log({lastnumins, lastinsDai, lastins})
                return (
                  <>
                  <div>
                  {meta && meta.numParties} events are currently hosted on Kickback.
                  <br/>
                  {lastnumins} people are committing {lastins} ETH and {lastinsDai} DAI to attend.
                  <br/>
                  <SmallText>
                  The data powered by  <a href='https://thegraph.com/explorer/subgraph/makoto/deployer'>The Graph</a>.
                  </SmallText>
                  </div>
                  <OuterContainer>
                  <Container>
                    <ChartColumn>
                      <h2>ETH</h2>
                      <C3Chart
                        data={chartdata}
                        axis={axis}
                        tooltip={{show:false}}
                        point= {{show:false}}
                        regions={
                          [
                            {start:0, end:1768844390, class:'foo'}
                          ]
                        } 
                        color={{
                          pattern: ['#1f77b4']
                        }}
                      />
                    </ChartColumn>
                    <ChartColumn>
                      <h2>
                        DAI
                      </h2>
                      <C3Chart
                        data={chartdataDai}
                        axis={axis}
                        tooltip={{show:false}}
                        point= {{show:false}}
                        color={{
                          pattern: ['#ff7f0e']
                        }}
                      />
                    </ChartColumn>
                  </Container>
                  <ParticipantContainer>
                    <h3>Participants</h3>
                    <Chart
                      data={chartdataParticipants}
                      max={meta.limitOfParticipants}
                    />
                  </ParticipantContainer>
                  </OuterContainer>
                  </>
                )
              }}
            </Query>    
            )
          }}
        </Query>
      </header>
    </div>
  );
}

export default App;
