import * as React from 'react'
import axios from 'axios'

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

type StoriesState = {
  data: Story[]
  isLoading: boolean
  isError: boolean
}

type StoriesFetchInitAction = {
  type: 'STORIES_FETCH_INIT'
}

type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS'
  payload: Story[]
}

type StoriesFetchFailureAction ={
  type: 'STORIES_FETCH_FAILURE'
}

type StoriesRemoveAction = {
  type: 'REMOVE_STORY'
  payload: Story
}

type StoriesAction = 
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction 

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
        (story: Story) => action.payload.objectID !== story.objectID
      )
    }
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

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`)
  
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  )

  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return

    dispatchStories({ type: 'STORIES_FETCH_INIT' })

    fetch(url)
    .then((response) => response.json())
    .then((result) => {
      dispatchStories({
        type:'STORIES_FETCH_SUCCESS',
        payload: result.hits
      })
    })
    .catch(() => 
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    )
  }, [url])

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

    const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })
  }

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value)    
  }

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearchInput}
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <button
      type="button"
      disabled={!searchTerm}
      onClick={handleSearchSubmit}
      >
        Submit
      </button>

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List 
          list={stories.data} 
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