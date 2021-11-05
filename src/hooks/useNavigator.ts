import { useNavigate } from "react-router-dom";
import urlJoin from "url-join";

export type UseNavigatorResult = (
  url: string,
  replace?: boolean,
  preserveQs?: boolean
) => void;
function useNavigator(): UseNavigatorResult {
  const navigator = useNavigate()

  return (url: string, replace = false, preserveQs = false) => {
    const targetUrl = preserveQs ? url + window.location.search : url;
    if (replace) {
      //window.location.replace(`${urlJoin('/ecommerce', targetUrl)}`);
    } else {
      navigator(`${urlJoin('/ecommerce', targetUrl)}`);
    }

    window.scrollTo({ behavior: "smooth", top: 0 });
  };
}

export default useNavigator;
