import { Suspense } from 'react'
import EditCharacterForm from './edit-form'

export default async function EditCharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCharacterForm id={resolvedParams.id} />
    </Suspense>
  )
}
