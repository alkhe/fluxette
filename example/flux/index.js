import Flux from '../..';
import stores from './stores';
import { user, game } from './creators';
import equal from '../equal';

let log = ::console.log;
let flux = new Flux(stores);

export default flux;
export let state = ::flux.state

flux.hook(log);

// logged in
flux.dispatch(user.setname('Thomas'), user.setemail('thomas@example.com'));
// got some points
flux.dispatch(game.addpoints(100));
// got more points
flux.dispatch(game.addpoints(200));
// got a ton of points
flux.dispatch(game.addpoints(900));
// lost a ton of points
flux.dispatch(game.reducepoints(900));
// lost more points
flux.dispatch(game.reducepoints(200));
// restarted the game
flux.dispatch(game.reset());
// got some points
flux.dispatch(game.reducepoints(500));

log(flux.history);
