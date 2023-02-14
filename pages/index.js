import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [traitInput, setTraitInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trait: traitInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      data.result = data.result.split(",").slice(0, -1);
      setResult(data.result);
      console.log("zac", data.result)
      setTraitInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Natasha</title>
        <link rel="icon" href="/heart.svg" />
      </Head>

      <main className={styles.main}>
        {/* <img src="/feather.svg" className={styles.icon} /> */}
        <h3>I want Zac to compliment me on:</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="trait"
            placeholder="What would you like me to compliment you on Natasha?"
            value={traitInput}
            onChange={(e) => setTraitInput(e.target.value)}
          />
          <input type="submit" value="Feed my ego please" />
        </form>
        <div className={styles.result}>{result}</div>
        <img src="/heart.svg" className={styles.heart} height="100" />
       
      </main>
    </div>
  );
}
