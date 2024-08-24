import { useEffect } from 'react';

export const nodeIdURLParam = "nodeId";

// push new history state and update url params
export function navToFileId(nodeId: string, pushing: boolean) {
  const url = new URL(window.location.href); 
  url.searchParams.set(nodeIdURLParam, nodeId);
  const newURL = url.pathname + '?' + url.searchParams.toString();

  if (pushing) {
    window.history.pushState({nodeId: nodeId}, '', newURL);
  } else {
    window.history.replaceState({nodeId: nodeId}, '', newURL);
  }
}

export function usePopState(nodeId: string, setNodeId: React.Dispatch<React.SetStateAction<string>>) {
  useEffect(() => {

    // set initial history state
    navToFileId(nodeId, false);

    // event listener to update page based on state
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setNodeId(event.state.nodeId);
      }
    };
    window.addEventListener('popstate', handlePopState);

    // cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    }
  }, []);
}