import React, { useEffect, useState } from "react";

import { Provider } from "./DateContext";

// interface DateProviderState {
//   date: number;
// }

export const DateProvider = (props) => {

  const [state, setState] = useState({
    date: Date.now()
  })

  useEffect(() => {
    let intervalId = window.setInterval(
      () => setState({ date: Date.now() }),
      10000
    );

    return window.clearInterval(intervalId);
  }, [])

  const { children } = props;
  const { date } = state;
  return <Provider value={date}>{children}</Provider>;
}