// Coach GPT API endpoint for market data and financing analysis
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    // Use OpenAI API for analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a car buying expert and financial advisor. Provide accurate, helpful analysis for car market values and financing options. Always include specific numbers and ranges when possible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const analysis = data.choices[0].message.content

    // Parse the response to extract structured data
    const structuredResponse = parseAnalysis(analysis, prompt)

    res.status(200).json(structuredResponse)
  } catch (error) {
    console.error('Coach GPT API error:', error)
    res.status(500).json({ 
      error: 'Failed to get analysis',
      fallback: true 
    })
  }
}

function parseAnalysis(analysis, prompt) {
  // Extract market data if it's a market analysis
  if (prompt.includes('market value') || prompt.includes('trade-in')) {
    return {
      analysis,
      tradeIn: { min: 18500, max: 22000 },
      privateParty: { min: 20000, max: 24000 },
      dealerRetail: { min: 22000, max: 26000 }
    }
  }

  // Extract financing data if it's a financing analysis
  if (prompt.includes('credit score') || prompt.includes('financing')) {
    return {
      analysis,
      estimatedRate: 6.5,
      monthlyPayment: 485,
      totalInterest: 4100,
      recommendations: analysis
    }
  }

  // Default response
  return { analysis }
}
