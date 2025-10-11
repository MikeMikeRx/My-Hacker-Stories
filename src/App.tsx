import * as React from 'react'

type Story = {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: number,
}

type ListProps ={
  list: Story[]
}

type ItemProps ={
  item: Story
}

const App = () => {
  const stories: Story[] = [
  {
    title:'Ract',
    url: 'http://react.dev/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title:'Redux',
    url: 'http://redux.js.org/',
    author: 'Dan Abramov, Adrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
]

  return (
    <div>
      <h1>Hello React</h1>

      <Search/>

      <hr />

      <List list={stories}/>
    </div>
  )
}

const Search = () => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) =>{
    console.log(event)   
    console.log(event.target.value)   
  }

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange}/>
    </div>    
  )
}

const List = (props: ListProps) => (
  <ul>
    {props.list.map((item) => (
      <Item key={item.objectID} item={item}/>
    ))}
  </ul>
)

const Item = (props: ItemProps) => (
  <li>
    <span>
      <a href={props.item.url}>{props.item.title}</a>
    </span>
    <span>{props.item.author}</span>
    <span>{props.item.num_comments}</span>
    <span>{props.item.points}</span>
  </li>
)

export default App;