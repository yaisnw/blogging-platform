import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { setSearchQuery, clearSearchQuery } from "@/slices/uiSlice"
import styles from "@/styles/nav.module.css"
import AppInput from "../atoms/AppInput"
import AppButton from "../atoms/AppButton"
import { useNavigate } from "react-router"

const SearchBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const searchQuery = useSelector((state: RootState) => state.ui.searchQuery)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const handleClear = () => {
    dispatch(clearSearchQuery())
  }

  return (
    <div className={styles.searchBar}>
      <div className={styles.inputWrapper}>
        <AppInput
          type="text"
          placeholder="Search posts or users..."
          value={searchQuery}
          onChange={handleChange}
          className={styles.searchInput}
        />
        {searchQuery && (
          <AppButton onClick={handleClear}>
            X
          </AppButton>
        )}
      </div>
      <img onClick={() => navigate('search')} src="/search.svg" />

    </div>
  )
}

export default SearchBar
