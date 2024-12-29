import PaperSearch from './components/paper-search'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Academic Paper Search</h1>
      <PaperSearch />
    </main>
  )
}

