import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await axios.get(`https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&limit=10&fields=title,authors,abstract,url`)
    const papers = response.data.data.map((paper: any) => ({
      title: paper.title,
      authors: paper.authors.map((author: any) => author.name),
      abstract: paper.abstract || 'No abstract available',
      url: paper.url,
    }))
    return NextResponse.json(papers)
  } catch (error) {
    console.error('Error fetching from Semantic Scholar:', error)
    return NextResponse.json({ error: 'Failed to fetch papers from Semantic Scholar' }, { status: 500 })
  }
}

