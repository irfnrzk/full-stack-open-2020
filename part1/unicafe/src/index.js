import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({ value }) => {

  const total = () =>
    value.good + value.bad + value.neutral

  const average = () =>
    (total() === 0) ? 0 : (value.good - value.bad) / total()

  const positive = () =>
    (total() === 0) ? 0 : value.good / total()

  if (
    value.good === 0 &&
    value.bad === 0 &&
    value.neutral === 0
  ) {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }

  return (
    <>
      <h1>statistics</h1>
      <p>good {value.good}</p>
      <p>neutral {value.neutral}</p>
      <p>bad {value.bad}</p>
      <p>all {total()}</p>
      <p>average {average()}</p>
      <p>positive {positive()} %</p>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <button onClick={() => setGood(good + 1)}>good</button>
        <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
        <button onClick={() => setBad(bad + 1)}>bad</button>
      </div>
      <Statistics value={{ good, neutral, bad }} />
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)