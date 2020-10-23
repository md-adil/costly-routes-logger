import { EventEmitter } from "events";
import pidusage from 'pidusage';
export default function systemTracker(threashold: number, frequency: number = 300) {
    const events = new EventEmitter();
    let readyToTrigger = true;
    setInterval(async () => {
        try {
            const state = await pidusage(process.pid);
            if (state.cpu > threashold) {
                if (readyToTrigger) {
                    events.emit("load", state);
                    readyToTrigger = false;
                }
            } else {
                readyToTrigger = true;
            }
        } catch(err) {
            events.emit("error", err);
        }
    }, 300)
    return events;
}
