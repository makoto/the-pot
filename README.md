# The pot

The pot aggregates and visualise how much commitments on active Kickback events.

- [Frontend](http://pot.kickback.events)
- [Subgraph](https://thegraph.com/explorer/subgraph/makoto/deployer)
- [Subgraph repo](https://github.com/makoto/deployer)

![screenshot](/screenshot.png?raw=true "Screenshot")

## Experience using The graph.

I have used the graph on and off by mostly quering already made subgraph or extending existing ones, so it was first time to create a subgraph from scratch.

The documentation is a lot clearler than what it was 6 months ago when I had first looked into it during ETH Denver. Also support teams at Discord was super helpful where Leo or Jannis constantly answering questions.

The avility to scan any block and ethereum calls were useful feature but it took a lot of time to index (2~5 hrs) which made my development super slow.

Then Leo suggested using datastore template which satisfied most of my requirements. I am especially impressed that I can just call smart contract at any events to supplement data which we haven't emitted. This eliminates the need to upgrade smart contract just for the sake of getting extra data, which is a game changer.

## What is significant about this hack?

The ability to track how much commitments have been on our smartcontract is critical for us to assess the overall risk as well as exploring the opportunity to receive interests via Compound.
The historical data does not exist even in our backend database and keep syncing blockchain is a daunting task so kudos for The graph team taking care of all the heavy lifting works.

One thing I did differently than originally planned was to track stats info as you index.
Initially I was adding the ins/out of commitment into `MoneyEntity` but that forces frontend to traverse potentially thousands of data (initially I was tracking thousands of data since Devcon4). Keeping the aggregate data into `MetaEntry` and daily stats into `StatsEntry` made frontend query super simple.

## What's next?

There were two things I wanted to do during hackathon but lover to do are.

- Increase insurance amount as pot size increase (could not do because I was unable to verity smart contract source code on Etherscan which is prerequisite to get quotes from Nexus mutual).
- Convert DAI into RDAI.

## How to start

```
yarn
yarn start
```