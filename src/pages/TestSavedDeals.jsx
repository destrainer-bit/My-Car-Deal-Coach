import React from 'react'

function TestSavedDeals({ deals }) {
  console.log('TestSavedDeals rendering with deals:', deals)
  
  return (
    <div style={{ padding: '20px', background: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Test Saved Deals Page</h1>
      <p>Deals count: {deals ? deals.length : 'undefined'}</p>
      
      {deals && deals.length > 0 ? (
        <div>
          <h2>Found {deals.length} deals:</h2>
          {deals.map((deal, index) => (
            <div key={deal.id || index} style={{ border: '1px solid #333', padding: '10px', margin: '10px 0' }}>
              <h3>{deal.vehicle?.year} {deal.vehicle?.make} {deal.vehicle?.model}</h3>
              <p>Status: {deal.status}</p>
              <p>Price: ${deal.price?.asking}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>No deals found</h2>
          <p>Deals data: {JSON.stringify(deals, null, 2)}</p>
        </div>
      )}
    </div>
  )
}

export default TestSavedDeals



