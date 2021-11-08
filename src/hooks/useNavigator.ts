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
    const clientIntegration = location.pathname.includes('ecommerce');
    const path = `${urlJoin(clientIntegration ? '/ecommerce' : '/', targetUrl)}`;
    navigator(path, { replace: replace });

    window.scrollTo({ behavior: "smooth", top: 0 });
  };
}

export default useNavigator;
