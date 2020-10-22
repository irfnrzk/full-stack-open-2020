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

const Course = ({ course }) => {
  console.log(course)

  return (
    <>
      <Header course={course} />
      <Content course={course} />
    </>
  )

}

export default Course