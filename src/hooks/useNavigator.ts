import { useHistory } from "react-router-dom";
import urlJoin from "url-join";

export type UseNavigatorResult = (
  url: string,
  replace?: boolean,
  preserveQs?: boolean
) => void;
function useNavigator(): UseNavigatorResult {
  const history = useHistory();
  const navigator = history.push;

  return (url: string, replace = false, preserveQs = false) => {
    const targetUrl = preserveQs ? url + window.location.search : url;
    const path = `${urlJoin("/", targetUrl)}`;
    navigator(path, { replace: replace });
  };
}

export default useNavigator;
