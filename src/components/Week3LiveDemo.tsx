import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const COLORS = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];

const Week3LiveDemo = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [bgColor, setBgColor] = useState("#fff")
  const [showMsg, setShowMsg] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

  }

  const handleReset = () => {
    setCount(0)
    setName("")
    setGreeting("")
    setBgColor("#fff")
    setShowMsg(true)
  }
  
  return (
    <div>
      {greeting && (<p className="text-center text-green-600 font-medium">{greeting}</p>)}
        <span>Count = {count}</span>
        <Button onClick={() => setCount(count + 1)}>+1</Button>
        <br></br>
        <Input
           placeholder="Enter your name"
           value={name}
           onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={() => setGreeting('Hello, ${name}!')}>Submit</Button>
      <span>Pick a background color:</span>
      <div>
        {COLORS.map((color) => (
          <button key={color} style={{ background: color, width: 32, height: 32, borderRadius: "50%" }}onClick={() => setBgColor(bgColor)}/>
        ))}
      </div>
      <Button onClick={() => setShowMsg(v => !v)}>
        {showMsg ? "Hide Message" : "Show Message"}
      </Button>
      {showMsg && <p>This message can be toggled!</p>}
      <Button onClick={handleReset}>Reset All</Button>
     </div>
  );
};

export default Week3LiveDemo;
