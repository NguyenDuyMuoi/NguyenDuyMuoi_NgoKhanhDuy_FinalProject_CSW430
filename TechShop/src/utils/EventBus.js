// utils/EventBus.js
import { NativeEventEmitter } from "react-native";

const emitter = new NativeEventEmitter();

export const EventBus = {
  emit(eventName, data) {
    emitter.emit(eventName, data);
  },

  on(eventName, handler) {
    return emitter.addListener(eventName, handler);
  }
};
