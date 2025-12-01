import React from 'react';
import DataAnalyzer from '../DataAnalyzer';

import SimpleChart from '../SimpleChart';

const Week5Live = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Week 5 Live Demo</h1>
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Data Analysis</h2>
                    <DataAnalyzer />
                </section>
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Data Visualization</h2>
                    <SimpleChart />
                </section>
            </div>
        </div>
    );
}
export default Week5Live;