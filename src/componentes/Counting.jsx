import React, { useEffect, useState } from 'react';

const Counting = () => {
    const [visitorCount, setVisitorCount] = useState(0);

    useEffect(() => {
        // Call the API to record the visit
        fetch('http://localhost:5000/api/visit')
            .then(() => {
                // Fetch the updated visitor count
                return fetch('http://localhost:5000/api/visitor-count');
            })
            .then(response => response.json())
            .then(data => setVisitorCount(data.count))
            .catch(err => console.error('Error tracking visitor:', err));
    }, []);

    return (
        <div>
            <h1>Welcome to the Railway App!</h1>
            <p>Visitor Count: {visitorCount}</p>
            {/* Your existing component code */}
        </div>
    );
};

export default Counting;
