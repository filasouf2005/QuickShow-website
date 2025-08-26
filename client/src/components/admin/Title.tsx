import React from 'react'

interface TitleProps {
  text1: string;
  text2: string;
}

const Title = ({text1, text2}: TitleProps) => {
  return (

      <h1 className='font-medium text-2xl'>
          {text1} <span className='text-primary underline'>{text2}</span>
      </h1>
  )
}

export default Title