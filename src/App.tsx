import * as React from 'react'

type Story = {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: number,
}

type InputWithLabelProps = {
  id: string
  label: string
  value: string
  type?: string
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

type ListProps ={
  list: Story[]
}

type ItemProps = {
  item: Story;
}

const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  )

  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue] as const
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

  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  )

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value)    
  }

  const searchedStories: Story[] = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        label="Search: "
        value={searchTerm}
        onInputChange={handleSearch}
      />

      <hr />

      <List list={searchedStories}/>
    </div>
  )
}

const InputWithLabel = ({ 
  id,
  label,
  value,
  type = 'text',
  onInputChange,
}: InputWithLabelProps) =>  (
    <>
      <label htmlFor={id}>{label}</label>
      <input 
        id={id} 
        type={type}
        value={value} 
        onChange={onInputChange}/>
    </>    
  )

const List = ({ list }: ListProps) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
)

const Item = ({ item }: ItemProps) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
)

export default App;