import { useIonRouter } from "@ionic/react";
import urlJoin from "url-join";

export type UseNavigatorResult = (
  url: string,
  replace?: boolean,
  preserveQs?: boolean
) => void;
function useNavigator(): UseNavigatorResult {
  const history = useIonRouter();
  const navigator = history.push;

  return (url: string, preserveQs = false) => {;
    const targetUrl = preserveQs ? url + window.location.search : url;
    const path = `${urlJoin("/", targetUrl)}`;
    navigator(path);
  };
}

export default useNavigator;
