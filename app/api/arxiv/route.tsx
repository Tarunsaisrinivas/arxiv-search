import { NextResponse } from 'next/server';
import axios from 'axios';
import { parseString } from 'xml2js';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await axios.get(`http://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=10`)
    const xmlData = response.data

    return new Promise((resolve, reject) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          reject(NextResponse.json({ error: 'Failed to parse XML' }, { status: 500 }))
        } else {
          const papers = result.feed.entry.map((entry: any) => ({
            title: entry.title[0],
            authors: entry.author.map((author: any) => author.name[0]),
            abstract: entry.summary[0],
            url: entry.id[0],
          }))
          resolve(NextResponse.json(papers))
        }
      })
    })
  } catch (error) {
    console.error('Error fetching from arXiv:', error)
    return NextResponse.json({ error: 'Failed to fetch papers from arXiv' }, { status: 500 })
  }
}

