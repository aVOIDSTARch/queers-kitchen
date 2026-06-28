import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>QUEERS KITCHEN</h1>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR.
      </p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Count is {count}
      </button>
    </main>
  );
}
