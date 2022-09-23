/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from "react";
import Routes from "./src/routes/routes";
import RNBootSplash from 'react-native-bootsplash';

const App: () => React$Node = () => {

  React.useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
    });
  }, []);

  return <Routes />
}

export default App;
