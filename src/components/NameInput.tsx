import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const NameInput = () => {
   const [name, setName] = useState("");
   const [greeting, setGreeting] = useState("");
   const [error, setError] = useState("");
   const [email, setEmail] = useState("");

   const handleSubmit = () => {
      setError("");
      if (!name.trim()) {
         setError("Please enter your name");
         return;
      }
      if (name.trim().length < 2) {
         setError("Name must be at least 2 characters");
         return;
      }
      if (!email.trim().includes("@") || !email.trim().includes(".")) {
         setError("Email must contain '@' and '.'");
         return;
      }
      setGreeting(`Hello, ${name.trim()}! Welcome to data analysis!`);
   };
   const Clear = () => {
      setError("");
      setName("");
      setGreeting("");
      setEmail("");
   };

   return (
      <Card className="max-w-md mx-auto">
         <CardHeader>
            <CardTitle>Name Input</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <Input
               placeholder="Enter your name"
               value={name}
               onChange={(e) => setName(e.target.value)}
            />
            <Input
               placeholder="Enter your email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleSubmit} className="w-full">
               Submit
            </Button>
            {error && <p className="text-center text-red-600 text-sm">{error}</p>}
            {greeting && <p className="text-center text-green-600 font-medium">{greeting}</p>}
            <br></br>
            <Button onClick={Clear} className="w-full">
               Clear
            </Button>
         </CardContent>
      </Card>
   );
};

export default NameInput;

/* */
