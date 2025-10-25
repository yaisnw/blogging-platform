import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { setSearchQuery } from "@/slices/uiSlice"
import styles from "@/styles/nav.module.css"
import AppInput from "../atoms/AppInput"
import { useNavigate } from "react-router"

const SearchBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const searchQuery = useSelector((state: RootState) => state.ui.searchQuery)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }



  return (
    <form
      className={styles.searchBar}
      onSubmit={(e) => {
        e.preventDefault();
        navigate("search");
      }}
      role="search"
      aria-label="Search posts and users"
    >
      <div className={styles.inputWrapper}>
        <AppInput
          type="search"
          placeholder="Search posts or users..."
          value={searchQuery}
          onChange={handleChange}
          className={styles.searchInput}
          aria-label="Search input"
        />
    
      </div>
      <button className={styles.searchButton} type="submit" aria-label="Go to search">
        <img src="/search.svg" alt="" aria-hidden="true" />
      </button>
    </form>
  );
}

export default SearchBar
