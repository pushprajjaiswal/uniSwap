// import { useEffect, useState } from 'react';
// import { createClient } from 'urql';
// import './App.css';

// function App() {
//   const [tokens, setTokens] = useState([]);

//   const QueryURL = "https://gateway.thegraph.com/api/7c0bd9d0e7937cb4fb164de09d9d8be6/subgraphs/id/HUZDsRpEVP2AvzDCyzDHtdc64dyDxx8FQjzsmqSg4H3B";

//   const client = createClient({
//     url: QueryURL
//   });

//   const query = `{
//     tokens(first: 5) {
//       id
//       name
//       symbol
//       decimals
//     }
//   }`

//   useEffect(() => {
//     const getTokens = async () => {
//       const { data } = await client.query(query).toPromise();
//       setTokens(data.tokens);
//     };
//     getTokens();
//   }, []);

//   return (
//     <>
//       <div>
//         <h1>Tokens Information</h1>
//         {tokens !== null && tokens.length > 0 && tokens.map((token) => {
//           return (
//             <div key={token.id}>
//               <div>{token.id}</div>
//               <div>{token.name}</div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }

// export default App;

import { useEffect, useState } from 'react';
import { createClient } from 'urql';
import './App.css';

function App() {
  const [pools, setPools] = useState([]);
  const [topTokens, setTopTokens] = useState([]);
  const [error, setError] = useState(null);

  const QueryURL = "https://gateway.thegraph.com/api/7c0bd9d0e7937cb4fb164de09d9d8be6/subgraphs/id/HUZDsRpEVP2AvzDCyzDHtdc64dyDxx8FQjzsmqSg4H3B";

  const client = createClient({
    url: QueryURL
  });

  const poolsQuery = `query {
    pools(first: 5, orderBy: liquidity, orderDirection: desc) {
      id
      token0 {
        id
        name
        symbol
      }
      token1 {
        id
        name
        symbol
      }
      liquidity {
        id
        name
      }
    }
  }`;

  const tokensQuery = `{
    tokens(first: 5, orderBy: totalValueLockedUSD, orderDirection: desc) {
      id
      name
      symbol
      totalSupply
      volumeUSD
      totalValueLockedUSD
    }
  }`;

  useEffect(() => {
    const getPools = async () => {
      try {
        const { data, error } = await client.query(poolsQuery).toPromise();
        if (error) {
          throw new Error(error.message);
        }
        setPools(data?.pools || []);
      } catch (err) {
        setError(err.message);
      }
    };

    const getTopTokens = async () => {
      try {
        const { data, error } = await client.query(tokensQuery).toPromise();
        if (error) {
          throw new Error(error.message);
        }
        setTopTokens(data?.tokens || []);
      } catch (err) {
        setError(err.message);
      }
    };

    getPools();
    getTopTokens();
  }, []);

  return (
    <div>
      {error && <div className="error">Error: {error}</div>}
      <h1>Top 5 Liquidity Pools</h1>
      <table>
        <thead>
          <tr>
            <th>Pool ID</th>
            <th>Token 0</th>
            <th>Token 1</th>
            <th>Liquidity</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool) => (
            <tr key={pool.id}>
              <td>{pool.id}</td>
              <td>{pool.token0.name} ({pool.token0.symbol})</td>
              <td>{pool.token1.name} ({pool.token1.symbol})</td>
              <td>{pool.liquidity.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Top 5 Tokens by Price</h1>
      <table>
        <thead>
          <tr>
            <th>Token Name</th>
            <th>Symbol</th>
            <th>Total Supply</th>
            <th>Volume (USD)</th>
            <th>Total Value Locked (USD)</th>
          </tr>
        </thead>
        <tbody>
          {topTokens.map((token) => (
            <tr key={token.id}>
              <td>{token.name}</td>
              <td>{token.symbol}</td>
              <td>{token.totalSupply}</td>
              <td>{token.volumeUSD}</td>
              <td>{token.totalValueLockedUSD}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default App;