import { Button } from "@rte-ds/react";
import "./App.css";

function App() {
  return (
    <Button
      variant="primary"
      onClick={() => alert("Design System RTE Button clicked!")}
      label="Design System RTE Button"
    />
  );
}

export default App;
