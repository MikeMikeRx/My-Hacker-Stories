import * as React from "react"
import './App.css'
import axios from "axios";
import { API_ENDPOINT } from "./constants/api";
import type { Story } from "./types/story.types";
import { useStorageState } from "./hooks/useStorageState";
import { storiesReducer } from "./reducers/storiesReducer";
import SearchForm from "./components/SearchForm/SearchForm"
import List from "./components/StoryList/List";

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`)
  
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { 
      data: [],
      isLoading: false,
      isError: false
    }
  );

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
  }, [url]);

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

    const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value)
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault()
  };


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
  );
};

export default App;