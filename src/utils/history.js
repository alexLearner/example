import { browserHistory, createMemoryHistory } from 'react-router';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

const history = canUseDOM ? browserHistory : createMemoryHistory();
export default history;
