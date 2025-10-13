import * as React from 'react'

type Story = {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: number,
}

type SearchProps = {
  search: string
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
}

type ListProps ={
  list: Story[]
}

type ItemProps = {
  title: string
  url: string
  author: string
  num_comments: number
  points: number
}

const App = () => {
  const stories: Story[] = [
  {
    title:'React',
    url: 'http://react.dev/',
    author: 'Jordan Walker',
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

  const [searchTerm, setSearchTerm] = React.useState('React')

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value)
  }

  const searchedStories: Story[] = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search search={searchTerm} onSearch={handleSearch}/>

      <hr />

      <List list={searchedStories}/>
    </div>
  )
}

const Search = ({ search, onSearch }: SearchProps) => {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input 
        id="search" 
        type="text"
        value={search} 
        onChange={onSearch}/>
    </div>    
  )
}

const List = ({ list }: ListProps) => (
  <ul>
    {list.map(({ objectID, ...item }) => (
      <Item key={objectID} {...item} />
    ))}
  </ul>
)

const Item = ({ title, url, author, num_comments, points }: ItemProps) => (
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
)

export default App;