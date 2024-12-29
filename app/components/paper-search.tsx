'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface Paper {
  title: string
  authors: string[]
  abstract: string
  url: string
}

export default function PaperSearch() {
  const [query, setQuery] = useState('')
  const [papers, setPapers] = useState<Paper[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [useSemanticScholar, setUseSemanticScholar] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`/api/${useSemanticScholar ? 'semantic-scholar' : 'arxiv'}?query=${encodeURIComponent(query)}`)
      if (response.ok) {
         const data = await response.json()
         setPapers(data.length > 0 ? data : null)
      }
    } catch (error) {
      console.error('Error fetching papers:', error)
      setPapers(null)
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      <div className="flex items-center space-x-2">
        <Switch
          id="use-semantic-scholar"
          checked={useSemanticScholar}
          onCheckedChange={setUseSemanticScholar}
        />
        <Label htmlFor="use-semantic-scholar">Use Semantic Scholar</Label>
      </div>
      <div className="space-y-4">
        {papers === null ? (
          <Card>
            <CardContent className="p-4">
              <p className="text-center text-gray-500">No details found for the given search query.</p>
            </CardContent>
          </Card>
        ) : (
          papers.map((paper, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{paper.title}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {paper.authors.join(', ')}
                </p>
                <p className="text-sm mb-2">{paper.abstract}</p>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Read more
                </a>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

