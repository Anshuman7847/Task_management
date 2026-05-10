import { useEffect, useState } from "react";
import { subscribeToNetworkActivity } from "../services/api";
import LoadingScreen from "./LoadingScreen";

const GlobalNetworkLoader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer;

    const unsubscribe = subscribeToNetworkActivity((activeRequests) => {
      window.clearTimeout(showTimer);

      if (activeRequests === 0) {
        setVisible(false);
        return;
      }

      showTimer = window.setTimeout(() => {
        setVisible(true);
      }, 250);
    });

    return () => {
      window.clearTimeout(showTimer);
      unsubscribe();
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] sm:right-6 sm:top-6">
      <LoadingScreen compact message="Loading data..." />
    </div>
  );
};

export default GlobalNetworkLoader;
