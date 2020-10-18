import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistic = ({ text, value }) => {

  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value} {(text === 'positive') ? '%' : ''}</td>
      </tr>
    </>
  )

}

const Statistics = ({ value }) => {

  const total = () =>
    value.good + value.bad + value.neutral

  const average = () =>
    (total() === 0) ? 0 : (value.good - value.bad) / total()

  const positive = () =>
    (total() === 0) ? 0 : value.good / total() * 100

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
      <table>
        <tbody>
          <Statistic text="good" value={value.good} />
          <Statistic text="neutral" value={value.neutral} />
          <Statistic text="bad" value={value.bad} />
          <Statistic text="total" value={total()} />
          <Statistic text="average" value={average()} />
          <Statistic text="positive" value={positive()} />
        </tbody>
      </table>
    </>
  )
}

const Button = ({ text, handleClick }) =>
  <button onClick={handleClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button text="good" handleClick={() => setGood(good + 1)} />
        <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
        <Button text="bad" handleClick={() => setBad(bad + 1)} />
      </div>
      <Statistics value={{ good, neutral, bad }} />
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)