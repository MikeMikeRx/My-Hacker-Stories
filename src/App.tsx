import * as React from 'react'

const initialStories: Story[] = [
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
  value: string
  type?: string
  isFocused: boolean
  children: React.ReactNode
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void  
}

type ListProps ={
  list: Story[]
  onRemoveItem:(item: Story) => void
}

type ItemProps = {
  item: Story;
  onRemoveItem:(item: Story) => void
}

type StoriesState = Story[]

type StoriesSetAction = {
  type: 'SET_STORIES'
  payload: Story[]
}

type StoriesRemoveAction = {
  type: 'REMOVE_STORY'
  payload: Story
}

type StoriesAction = StoriesSetAction | StoriesRemoveAction

//Fetch simulation
const getAsyncStories = (): Promise<{ data: { stories: Story[] } }> =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  )

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload
    case 'REMOVE_STORY':
      return state.filter(
        (story: Story) => action.payload.objectID !== story.objectID
      )
    default:
      throw new Error()
  }
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
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  )
  
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    []
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(false)

  React.useEffect(() => {
    setIsLoading(true)

    getAsyncStories()
    .then((result) => {
      dispatchStories({
        type:'SET_STORIES',
        payload: result.data.stories
      })
      setIsLoading(false)
    })
    .catch(() => setIsError(true))
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value)    
  }

  const searchedStories: Story[] = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List 
          list={searchedStories} 
          onRemoveItem={handleRemoveStory} 
        />
      )}
    </div>
  )
}

const InputWithLabel = ({ 
  id,
  value,
  type = 'text',
  children,
  isFocused,
  onInputChange,
}: InputWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(()=>{
    if(isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input 
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        autoFocus={isFocused} 
        onChange={onInputChange}/>
    </>    
  )
}


const List = ({ list, onRemoveItem }: ListProps) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
    ))}
  </ul>
)

const Item = ({ item, onRemoveItem }: ItemProps) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type='button' onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
)

export default App;