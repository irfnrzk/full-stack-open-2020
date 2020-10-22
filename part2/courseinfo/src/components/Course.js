import React from 'react';

const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Content = ({ course }) => {
  console.log(course.parts)
  return (
    <div>
      {
        course.parts.map(part => <Part key={part.id} part={part} />)
      }
    </div>
  )
}

const Total = ({ course }) => {

  const total = course.parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <>
      <strong>total of {total} exercises</strong>
    </>
  )

}

const Course = ({ course }) => {
  console.log(course)

  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  )

}

export default Course