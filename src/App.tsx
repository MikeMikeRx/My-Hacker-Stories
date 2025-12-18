import * as React from 'react'
import axios from 'axios'
import './App.css'

// Type Definitions
type Story = {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: string,
}

type SearchFormProps = {
  searchTerm: string
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void
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

// API endpoint
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

// Reducer function to manage stories state
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

// Hook to persist state in localStorage
const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  )

  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue] as const
}

/* --------------- Main App Component --------------- */
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

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' })

    try {
      const result = await axios.get<{hits: Story[]}>(url)

      dispatchStories({
        type:'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      })
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    } 
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

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault()
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

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

/* --------------- Subcomponents --------------- */
const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}: SearchFormProps) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id='search'
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search: </strong>
    </InputWithLabel>

    <button type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
)

// Input component with label
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

// List component to display stories
const List = ({ list, onRemoveItem }: ListProps) => (
  <>
    <div className="list-header">
      <span>Title</span>
      <span>Author</span>
      <span>Comments</span>
      <span>Points</span>
      <span>Action</span>
    </div>
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
      ))}
    </ul>
  </>
)

// Item component to display individual story
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