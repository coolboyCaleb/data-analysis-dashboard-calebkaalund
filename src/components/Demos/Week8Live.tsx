import React from "react";
import MockAIChatSolution from "../MockAIChatSolution";
import { BrokenNullProperty, BrokenFailedFetch } from "../broken/BrokenExamples";
import ErrorBoundary from "../ErrorBoundary";
import LoadingExample from "../LoadingExample";
import Performance from "../Performance";


const Week8Live = () => {
    return (
        <div>
            <h1>Week 8 Live Demo</h1>
            <p>This is the content for Week 8 Live Demo.</p>
             <MockAIChatSolution />
        <ErrorBoundary>
            {/* <BrokenNullProperty/> */}
            <BrokenFailedFetch/>
        </ErrorBoundary>
        <LoadingExample />
        <Performance />
        </div>
    );
}
export default Week8Live;