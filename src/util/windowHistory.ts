
const nodeIdURLParam = "nodeId";

export function navToFileId(nodeId: string, pushing: boolean) {
  const url = new URL(window.location.href); 
  url.searchParams.set(nodeIdURLParam, nodeId);
  const newURL = url.pathname + '?' + url.searchParams.toString();
  console.log("pushing state", nodeId);
  if (pushing)
    window.history.pushState({nodeId: nodeId}, '', newURL);
  else window.history.replaceState({nodeId: nodeId}, '', newURL);
}

// function useWindowHistory() {
//   // enable browswer backbutton event
//   useEffect(() => {
//     const handlePopState = (event: PopStateEvent) => {
//       if (event.state) {
//         setNodeId(event.state.nodeId);
//       }
//     };

//     const newURL = url.pathname + '?' + url.searchParams.toString();
//     window.history.replaceState({nodeId: nodeId}, '', );

//     window.addEventListener('popstate', handlePopState);
//     return () => window.removeEventListener('popstate', handlePopState);
//   }, []);


// }

// export default useWindowHistory;