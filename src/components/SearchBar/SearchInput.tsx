import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { IonSearchbar, SearchbarChangeEventDetail } from "@ionic/react";

import { SearchPageProps } from "../../types";
import Debounce from "../Debounce";

export interface SearchInputProps extends SearchPageProps {
  placeholder: string;
}

const useStyles = makeStyles(
  {
    input: {
      padding: "10.5px 12px"
    },
    root: {
      flex: 1
    }
  },
  {
    name: "SearchInput"
  }
);

const SearchInput: React.FC<SearchInputProps> = props => {
  const { initialSearch, onSearchChange, placeholder } = props;

  const classes = useStyles(props);
  const [search, setSearch] = React.useState(initialSearch);
  React.useEffect(() => setSearch(initialSearch), [initialSearch]);

  return (
    <Debounce debounceFn={onSearchChange}>
      {debounceSearchChange => {
        const handleSearchChange = (
          event: IonSearchbarCustomEvent<SearchbarChangeEventDetail>
        ) => {
          const value = event.target.value;
          setSearch(value);
          debounceSearchChange(value);
        };

        return (
          // <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>

          <IonSearchbar
            debounce={1000}
            data-test-id="searchInput"
            className={classes.root}
            placeholder={placeholder}
            style={{ textAlign: "left" }}
            value={search}
            onIonChange={handleSearchChange}
          />
        );
      }}
    </Debounce>
  );
};

SearchInput.displayName = "SearchInput";
export default SearchInput;
