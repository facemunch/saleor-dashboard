import { TextField } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonFooter
} from "@ionic/react";

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
        const handleSearchChange = (event: React.ChangeEvent<any>) => {
          const value = event.target.value;
          setSearch(value);
          debounceSearchChange(value);
        };

        return (
          // <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>

          <IonSearchbar
            data-test-id="searchInput"
            className={classes.root}
            inputProps={{
              className: classes.input,
              placeholder
            }}
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
